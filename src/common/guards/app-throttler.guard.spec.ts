import { AppThrottlerGuard } from './app-throttler.guard.js';

describe('AppThrottlerGuard', () => {
  let guard: AppThrottlerGuard;

  beforeEach(() => {
    // Instanciation directe avec des mocks minimaux
    guard = new (class extends AppThrottlerGuard {
      constructor() {
        super(
          [{ name: 'default', ttl: 60000, limit: 120 }],
          {} as any,
          {} as any,
        );
      }

      public async testTracker(req: any) {
        return this.getTracker(req);
      }
    })();
  });

  it('doit utiliser usr_ID si l utilisateur a une session authentifiée', async () => {
    const req = {
      session: { user: { id: 'user_123' } },
      ip: '192.168.1.50',
    };
    const tracker = await (guard as any).testTracker(req);
    expect(tracker).toBe('usr_user_123');
  });

  it('doit utiliser usr_ID si req.user existe', async () => {
    const req = {
      user: { id: 'user_456' },
      ip: '192.168.1.50',
    };
    const tracker = await (guard as any).testTracker(req);
    expect(tracker).toBe('usr_user_456');
  });

  it('doit se rabattre sur ip_IP si l utilisateur est anonyme', async () => {
    const req = {
      ip: '102.16.45.12',
    };
    const tracker = await (guard as any).testTracker(req);
    expect(tracker).toBe('ip_102.16.45.12');
  });

  it('doit extraire la première IP de x-forwarded-for si req.ip est indéfini', async () => {
    const req = {
      headers: {
        'x-forwarded-for': '41.242.100.5, 172.18.0.1',
      },
    };
    const tracker = await (guard as any).testTracker(req);
    expect(tracker).toBe('ip_41.242.100.5');
  });
});

