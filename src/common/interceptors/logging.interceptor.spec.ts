import { jest } from '@jest/globals';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor.js';
import { of, throwError } from 'rxjs';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function createMockContext(
  overrides: {
    method?: string;
    url?: string;
    query?: Record<string, unknown>;
    body?: Record<string, unknown>;
    ip?: string;
  } = {},
) {
  const response = { statusCode: 200 };
  const request = {
    method: overrides.method ?? 'GET',
    originalUrl: overrides.url ?? '/test',
    url: overrides.url ?? '/test',
    ip: overrides.ip ?? '127.0.0.1',
    query: overrides.query ?? {},
    body: overrides.body ?? {},
  };

  const context = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;

  return { context, response, request };
}

function createSuccessHandler(value: any = { ok: true }): CallHandler {
  return { handle: jest.fn().mockReturnValue(of(value)) };
}

function createErrorHandler(error: any): CallHandler {
  return { handle: jest.fn().mockReturnValue(throwError(() => error)) };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests du masquage de données sensibles (sanitize)
// ─────────────────────────────────────────────────────────────────────────────

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    jest.spyOn(interceptor['logger'], 'log').mockImplementation(() => {});
    jest.spyOn(interceptor['logger'], 'error').mockImplementation(() => {});
  });

  describe('passthrough behavior', () => {
    it('should pass values through without modification', (done) => {
      const { context } = createMockContext();
      const expected = { data: [1, 2, 3] };
      const handler = createSuccessHandler(expected);

      interceptor.intercept(context, handler).subscribe((value) => {
        expect(value).toEqual(expected);
        done();
      });
    });

    it('should propagate errors without swallowing them', (done) => {
      const { context } = createMockContext();
      const error = new Error('Service error');
      const handler = createErrorHandler(error);

      interceptor.intercept(context, handler).subscribe({
        error: (err) => {
          expect(err).toBe(error);
          done();
        },
      });
    });
  });

  describe('request logging', () => {
    it('should call logger.log on each request', (done) => {
      const logSpy = jest.spyOn(interceptor['logger'], 'log');
      const { context } = createMockContext({
        method: 'GET',
        url: '/api/items',
      });
      const handler = createSuccessHandler();

      interceptor.intercept(context, handler).subscribe(() => {
        expect(logSpy).toHaveBeenCalledTimes(2); // REQ + RES
        done();
      });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests isolés de la fonction sanitize (accessible via le module)
// On teste le comportement observable via les logs
// ─────────────────────────────────────────────────────────────────────────────

describe('LoggingInterceptor — masquage de champs sensibles', () => {
  let interceptor: LoggingInterceptor;
  let logMessages: string[];

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    logMessages = [];
    jest
      .spyOn(interceptor['logger'], 'log')
      .mockImplementation((msg: string) => {
        logMessages.push(msg);
      });
    jest.spyOn(interceptor['logger'], 'error').mockImplementation(() => {});
  });

  it('should mask "password" field in request body', (done) => {
    const { context } = createMockContext({
      method: 'POST',
      body: { email: 'test@kanto.mg', password: 'secret123' },
    });
    const handler = createSuccessHandler();

    interceptor.intercept(context, handler).subscribe(() => {
      const reqLog = logMessages.find((m) => m.includes('[REQ]'));
      expect(reqLog).toBeDefined();
      expect(reqLog).not.toContain('secret123');
      expect(reqLog).toContain('MASQUÉ');
      done();
    });
  });

  it('should mask "token" field in request body', (done) => {
    const { context } = createMockContext({
      method: 'POST',
      body: { token: 'supersecrettoken' },
    });
    const handler = createSuccessHandler();

    interceptor.intercept(context, handler).subscribe(() => {
      const reqLog = logMessages.find((m) => m.includes('[REQ]'));
      expect(reqLog).not.toContain('supersecrettoken');
      done();
    });
  });

  it('should mask "refreshToken" field regardless of case', (done) => {
    const { context } = createMockContext({
      method: 'POST',
      body: { refreshToken: 'refresh-abc-123' },
    });
    const handler = createSuccessHandler();

    interceptor.intercept(context, handler).subscribe(() => {
      const reqLog = logMessages.find((m) => m.includes('[REQ]'));
      expect(reqLog).not.toContain('refresh-abc-123');
      done();
    });
  });

  it('should mask "apiKey" field', (done) => {
    const { context } = createMockContext({
      method: 'POST',
      body: { apiKey: 'my-api-key-12345' },
    });
    const handler = createSuccessHandler();

    interceptor.intercept(context, handler).subscribe(() => {
      const reqLog = logMessages.find((m) => m.includes('[REQ]'));
      expect(reqLog).not.toContain('my-api-key-12345');
      done();
    });
  });

  it('should NOT mask non-sensitive fields', (done) => {
    const { context } = createMockContext({
      method: 'POST',
      body: { name: 'Andry', age: 25 },
    });
    const handler = createSuccessHandler();

    interceptor.intercept(context, handler).subscribe(() => {
      const reqLog = logMessages.find((m) => m.includes('[REQ]'));
      expect(reqLog).toContain('Andry');
      done();
    });
  });

  it('should truncate strings longer than 500 characters', (done) => {
    const longString = 'x'.repeat(600);
    const { context } = createMockContext({
      method: 'POST',
      body: { description: longString },
    });
    const handler = createSuccessHandler();

    interceptor.intercept(context, handler).subscribe(() => {
      const reqLog = logMessages.find((m) => m.includes('[REQ]'));
      expect(reqLog).toContain('tronqué');
      expect(reqLog).not.toContain(longString);
      done();
    });
  });

  it('should not log body when request body is empty', (done) => {
    const { context } = createMockContext({ method: 'GET', body: {} });
    const handler = createSuccessHandler();

    interceptor.intercept(context, handler).subscribe(() => {
      const reqLog = logMessages.find((m) => m.includes('[REQ]'));
      expect(reqLog).not.toContain('Body:');
      done();
    });
  });
});
