import { jest } from '@jest/globals';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma-exception.filter.js';
import { Prisma } from '../../../generated/prisma/client.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function createMockHost(method = 'POST', url = '/test') {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });

  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ method, originalUrl: url, url }),
    }),
  } as unknown as ArgumentsHost;

  return { host, json, status };
}

function createKnownRequestError(
  code: string,
  meta?: Record<string, unknown>,
): Prisma.PrismaClientKnownRequestError {
  const error = new Prisma.PrismaClientKnownRequestError(
    `Prisma error ${code}`,
    { code, clientVersion: '5.0.0', meta },
  );
  return error;
}

function createValidationError(): Prisma.PrismaClientValidationError {
  return new Prisma.PrismaClientValidationError(
    'Argument `where` is missing.',
    { clientVersion: '5.0.0' },
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;

  beforeEach(() => {
    filter = new PrismaExceptionFilter();
  });

  describe('P2002 — Contrainte unique violée (Conflict)', () => {
    it('should return 409 with conflict message', () => {
      const { host, status, json } = createMockHost();
      const exception = createKnownRequestError('P2002', { target: ['email'] });

      filter.catch(exception, host);

      expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(json.mock.calls[0][0]).toMatchObject({
        success: false,
        statusCode: 409,
        error: 'Conflict',
      });
    });

    it('should mention the conflicting field in the message', () => {
      const { host, json } = createMockHost();
      const exception = createKnownRequestError('P2002', { target: ['email'] });

      filter.catch(exception, host);

      expect(json.mock.calls[0][0].message).toContain('email');
    });

    it('should return generic conflict message when no target is provided', () => {
      const { host, json } = createMockHost();
      const exception = createKnownRequestError('P2002', {});

      filter.catch(exception, host);

      expect(json.mock.calls[0][0].message).toBeTruthy();
    });

    it('should join multiple conflicting fields with comma', () => {
      const { host, json } = createMockHost();
      const exception = createKnownRequestError('P2002', {
        target: ['userId', 'itemId'],
      });

      filter.catch(exception, host);

      const message = json.mock.calls[0][0].message;
      expect(message).toContain('userId');
      expect(message).toContain('itemId');
    });
  });

  describe('P2025 — Enregistrement introuvable (Not Found)', () => {
    it('should return 404', () => {
      const { host, status } = createMockHost('DELETE', '/items/123');
      const exception = createKnownRequestError('P2025', {
        cause: 'Record to delete does not exist.',
      });

      filter.catch(exception, host);

      expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    });

    it('should include cause message when available', () => {
      const { host, json } = createMockHost();
      const exception = createKnownRequestError('P2025', {
        cause: 'Record to update does not exist.',
      });

      filter.catch(exception, host);

      expect(json.mock.calls[0][0].message).toContain(
        'Record to update does not exist',
      );
    });

    it('should return generic not found message when cause is missing', () => {
      const { host, json } = createMockHost();
      const exception = createKnownRequestError('P2025', {});

      filter.catch(exception, host);

      const message = json.mock.calls[0][0].message;
      expect(message).toBeTruthy();
      expect(message.length).toBeGreaterThan(5);
    });
  });

  describe('P2003 — Violation de clé étrangère (Foreign Key)', () => {
    it('should return 400 with FK violation error', () => {
      const { host, status, json } = createMockHost();
      const exception = createKnownRequestError('P2003', {
        field_name: 'userId',
      });

      filter.catch(exception, host);

      expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(json.mock.calls[0][0].error).toBe('Foreign Key Violation');
    });

    it('should mention the field name in the message', () => {
      const { host, json } = createMockHost();
      const exception = createKnownRequestError('P2003', {
        field_name: 'categoryId',
      });

      filter.catch(exception, host);

      expect(json.mock.calls[0][0].message).toContain('categoryId');
    });
  });

  describe('P2024 — Timeout base de données', () => {
    it('should return 503 Service Unavailable', () => {
      const { host, status, json } = createMockHost();
      const exception = createKnownRequestError('P2024');

      filter.catch(exception, host);

      expect(status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
      expect(json.mock.calls[0][0].error).toBe('Database Timeout');
    });
  });

  describe('Autre code Prisma inconnu', () => {
    it('should return 500 for unknown Prisma error codes', () => {
      const { host, status } = createMockHost();
      const exception = createKnownRequestError('P9999');

      filter.catch(exception, host);

      expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return Database Error as error type for unknown codes', () => {
      const { host, json } = createMockHost();
      const exception = createKnownRequestError('P9999');

      filter.catch(exception, host);

      expect(json.mock.calls[0][0].error).toBe('Database Error');
    });
  });

  describe('PrismaClientValidationError — Données non conformes au schéma', () => {
    it('should return 400 for validation errors', () => {
      const { host, status } = createMockHost();
      const exception = createValidationError();

      filter.catch(exception, host);

      expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });

    it('should use Validation Error as error type', () => {
      const { host, json } = createMockHost();
      const exception = createValidationError();

      filter.catch(exception, host);

      expect(json.mock.calls[0][0].error).toBe('Validation Error');
    });
  });

  describe('Structure de réponse standard', () => {
    it('should always include required fields in the response', () => {
      const { host, json } = createMockHost('POST', '/api/items');
      const exception = createKnownRequestError('P2002', { target: ['email'] });

      filter.catch(exception, host);

      const response = json.mock.calls[0][0];
      expect(response).toMatchObject({
        success: false,
        path: '/api/items',
        method: 'POST',
      });
      expect(typeof response.statusCode).toBe('number');
      expect(typeof response.timestamp).toBe('string');
      expect(typeof response.message).toBe('string');
    });
  });
});
