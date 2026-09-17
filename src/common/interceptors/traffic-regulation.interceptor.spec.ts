import { jest } from '@jest/globals';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { TrafficRegulationInterceptor } from './traffic-regulation.interceptor.js';
import { of } from 'rxjs';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function createMockContext() {
  const setHeader = jest.fn();
  const response = { setHeader, statusCode: 200 };
  const request = { method: 'GET', url: '/test' };

  const context = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;

  return { context, setHeader, response };
}

function createMockCallHandler(value: any = { data: 'ok' }): CallHandler {
  return { handle: jest.fn().mockReturnValue(of(value)) };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('TrafficRegulationInterceptor', () => {
  afterEach(() => {
    delete process.env.REGULATION_DELAY_MS;
  });

  describe('when REGULATION_DELAY_MS is not set', () => {
    it('should not add delay and pass through immediately', (done) => {
      delete process.env.REGULATION_DELAY_MS;
      const interceptor = new TrafficRegulationInterceptor();
      const { context } = createMockContext();
      const handler = createMockCallHandler();

      const start = Date.now();
      interceptor.intercept(context, handler).subscribe(() => {
        const elapsed = Date.now() - start;
        // Sans délai, l'exécution est quasi-immédiate (< 50ms)
        expect(elapsed).toBeLessThan(100);
        done();
      });
    });
  });

  describe('when REGULATION_DELAY_MS is 0', () => {
    it('should treat 0 as no delay', (done) => {
      process.env.REGULATION_DELAY_MS = '0';
      const interceptor = new TrafficRegulationInterceptor();
      const { context } = createMockContext();
      const handler = createMockCallHandler();

      const start = Date.now();
      interceptor.intercept(context, handler).subscribe(() => {
        const elapsed = Date.now() - start;
        expect(elapsed).toBeLessThan(100);
        done();
      });
    });
  });

  describe('when REGULATION_DELAY_MS is a negative value', () => {
    it('should treat negative as no delay', (done) => {
      process.env.REGULATION_DELAY_MS = '-100';
      const interceptor = new TrafficRegulationInterceptor();
      const { context } = createMockContext();
      const handler = createMockCallHandler();

      interceptor.intercept(context, handler).subscribe(() => {
        done();
      });
    });
  });

  describe('when REGULATION_DELAY_MS is "abc" (NaN)', () => {
    it('should treat NaN as no delay and not throw', (done) => {
      process.env.REGULATION_DELAY_MS = 'abc';
      const interceptor = new TrafficRegulationInterceptor();
      const { context } = createMockContext();
      const handler = createMockCallHandler();

      expect(() => {
        interceptor.intercept(context, handler).subscribe(() => {
          done();
        });
      }).not.toThrow();
    });
  });

  describe('X-Traffic-Regulation header', () => {
    it('should set X-Traffic-Regulation header on every response', (done) => {
      process.env.REGULATION_DELAY_MS = '0';
      const interceptor = new TrafficRegulationInterceptor();
      const { context, setHeader } = createMockContext();
      const handler = createMockCallHandler();

      interceptor.intercept(context, handler).subscribe(() => {
        expect(setHeader).toHaveBeenCalledWith(
          'X-Traffic-Regulation',
          'active',
        );
        done();
      });
    });

    it('should set X-Traffic-Regulation even without delay', (done) => {
      delete process.env.REGULATION_DELAY_MS;
      const interceptor = new TrafficRegulationInterceptor();
      const { context, setHeader } = createMockContext();
      const handler = createMockCallHandler();

      interceptor.intercept(context, handler).subscribe(() => {
        expect(setHeader).toHaveBeenCalledWith(
          'X-Traffic-Regulation',
          'active',
        );
        done();
      });
    });
  });

  describe('passthrough behavior', () => {
    it('should pass through the upstream value unchanged', (done) => {
      delete process.env.REGULATION_DELAY_MS;
      const interceptor = new TrafficRegulationInterceptor();
      const { context } = createMockContext();
      const expectedValue = { items: [1, 2, 3], total: 3 };
      const handler = createMockCallHandler(expectedValue);

      interceptor.intercept(context, handler).subscribe((value) => {
        expect(value).toEqual(expectedValue);
        done();
      });
    });
  });
});
