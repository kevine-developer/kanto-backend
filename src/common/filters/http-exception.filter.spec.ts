import { jest } from '@jest/globals';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function createMockHost(method = 'GET', url = '/test') {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const setHeader = jest.fn();

  const response = { status, setHeader };
  const request = {
    method,
    originalUrl: url,
    url,
    ip: '127.0.0.1',
  };

  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  } as unknown as ArgumentsHost;

  return { host, json, status, request };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  describe('HttpException — réponse string', () => {
    it('should return correct status and message for NotFoundException', () => {
      const { host, json, status } = createMockHost();
      const exception = new HttpException(
        'Ressource non trouvée',
        HttpStatus.NOT_FOUND,
      );

      filter.catch(exception, host);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          statusCode: 404,
          message: 'Ressource non trouvée',
        }),
      );
    });

    it('should return 401 for UnauthorizedException', () => {
      const { host, status } = createMockHost();
      const exception = new HttpException(
        'Non autorisé',
        HttpStatus.UNAUTHORIZED,
      );

      filter.catch(exception, host);

      expect(status).toHaveBeenCalledWith(401);
    });

    it('should return 403 for ForbiddenException', () => {
      const { host, status } = createMockHost();
      const exception = new HttpException('Accès refusé', HttpStatus.FORBIDDEN);

      filter.catch(exception, host);

      expect(status).toHaveBeenCalledWith(403);
    });

    it('should return 409 for ConflictException', () => {
      const { host, status } = createMockHost();
      const exception = new HttpException('Conflit', HttpStatus.CONFLICT);

      filter.catch(exception, host);

      expect(status).toHaveBeenCalledWith(409);
    });
  });

  describe('HttpException — réponse objet avec message tableau (ValidationPipe)', () => {
    it('should join validation messages with semicolon and populate details', () => {
      const { host, json } = createMockHost('POST', '/users');
      const exception = new HttpException(
        {
          message: ['Le champ email est invalide', 'Le nom est requis'],
          error: 'Bad Request',
          statusCode: 400,
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, host);

      const call = json.mock.calls[0][0];
      expect(call.message).toBe(
        'Le champ email est invalide ; Le nom est requis',
      );
      expect(call.details).toEqual([
        'Le champ email est invalide',
        'Le nom est requis',
      ]);
    });

    it('should set statusCode 400 for validation errors', () => {
      const { host, status } = createMockHost('POST', '/test');
      const exception = new HttpException(
        { message: ['Champ requis'], error: 'Bad Request', statusCode: 400 },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, host);

      expect(status).toHaveBeenCalledWith(400);
    });
  });

  describe('HttpException — réponse objet avec message string', () => {
    it('should extract message from object response', () => {
      const { host, json } = createMockHost();
      const exception = new HttpException(
        {
          message: 'Utilisateur non trouvé',
          error: 'Not Found',
          statusCode: 404,
        },
        HttpStatus.NOT_FOUND,
      );

      filter.catch(exception, host);

      expect(json.mock.calls[0][0].message).toBe('Utilisateur non trouvé');
    });
  });

  describe('Error générique (non-HttpException)', () => {
    it('should return 500 for generic Error in production mode', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const { host, status, json } = createMockHost();
      const exception = new Error('Détail interne critique');

      filter.catch(exception, host);

      expect(status).toHaveBeenCalledWith(500);
      // En production, le message brut ne doit PAS être exposé
      expect(json.mock.calls[0][0].message).not.toBe('Détail interne critique');

      process.env.NODE_ENV = originalNodeEnv;
    });

    it('should expose message in development mode', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const { host, json } = createMockHost();
      const exception = new Error('Message de dev visible');

      filter.catch(exception, host);

      expect(json.mock.calls[0][0].message).toBe('Message de dev visible');

      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('Exception inconnue (ni Error, ni HttpException)', () => {
    it('should return 500 for completely unknown exception type', () => {
      const { host, status, json } = createMockHost();

      filter.catch('une erreur string aléatoire', host);

      expect(status).toHaveBeenCalledWith(500);
      expect(json.mock.calls[0][0].success).toBe(false);
    });
  });

  describe('Structure de réponse standard', () => {
    it('should always include success, statusCode, timestamp, path, method', () => {
      const { host, json } = createMockHost('GET', '/api/items');
      const exception = new HttpException('Test', HttpStatus.BAD_REQUEST);

      filter.catch(exception, host);

      const response = json.mock.calls[0][0];
      expect(response).toMatchObject({
        success: false,
        statusCode: 400,
        path: '/api/items',
        method: 'GET',
        error: expect.any(String),
        message: expect.any(String),
      });
      expect(typeof response.timestamp).toBe('string');
    });

    it('should not include details when there are no validation errors', () => {
      const { host, json } = createMockHost();
      const exception = new HttpException(
        'Simple message',
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, host);

      const response = json.mock.calls[0][0];
      expect(response.details).toBeUndefined();
    });
  });
});
