import { validateEnvironment } from './env.validation.js';

describe('validateEnvironment', () => {
  const REQUIRED_VARS = [
    'DATABASE_URL',
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
  ];
  const PRODUCTION_ONLY_VARS = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'GEMINI_API_KEY',
  ];

  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Sauvegarder et nettoyer les variables d'environnement
    originalEnv = { ...process.env };
    for (const key of [...REQUIRED_VARS, ...PRODUCTION_ONLY_VARS]) {
      delete process.env[key];
    }
  });

  afterEach(() => {
    // Restaurer les variables d'environnement
    process.env = originalEnv;
  });

  describe('en mode développement (NODE_ENV != production)', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should not throw when all required variables are set', () => {
      process.env.DATABASE_URL = 'postgresql://localhost/test';
      process.env.BETTER_AUTH_SECRET = 'test-secret';
      process.env.BETTER_AUTH_URL = 'http://localhost:3000';

      expect(() => validateEnvironment()).not.toThrow();
    });

    it('should not throw when critical vars are missing in development (only warns)', () => {
      // En dev, les variables manquantes ne doivent pas faire planter l'app
      expect(() => validateEnvironment()).not.toThrow();
    });

    it('should not throw when production-only vars are missing in development', () => {
      process.env.DATABASE_URL = 'postgresql://localhost/test';
      process.env.BETTER_AUTH_SECRET = 'test-secret';
      process.env.BETTER_AUTH_URL = 'http://localhost:3000';
      // Pas de Cloudinary, pas de Gemini

      expect(() => validateEnvironment()).not.toThrow();
    });
  });

  describe('en mode production (NODE_ENV = production)', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should throw when DATABASE_URL is missing in production', () => {
      process.env.BETTER_AUTH_SECRET = 'secret';
      process.env.BETTER_AUTH_URL = 'http://app.kanto.mg';
      // Pas de DATABASE_URL

      expect(() => validateEnvironment()).toThrow();
    });

    it('should throw when BETTER_AUTH_SECRET is missing in production', () => {
      process.env.DATABASE_URL = 'postgresql://prod/db';
      process.env.BETTER_AUTH_URL = 'http://app.kanto.mg';

      expect(() => validateEnvironment()).toThrow();
    });

    it('should throw when BETTER_AUTH_URL is missing in production', () => {
      process.env.DATABASE_URL = 'postgresql://prod/db';
      process.env.BETTER_AUTH_SECRET = 'supersecret';

      expect(() => validateEnvironment()).toThrow();
    });

    it('should not throw when all critical and production vars are set', () => {
      process.env.DATABASE_URL = 'postgresql://prod/db';
      process.env.BETTER_AUTH_SECRET = 'supersecret';
      process.env.BETTER_AUTH_URL = 'http://app.kanto.mg';
      process.env.CLOUDINARY_CLOUD_NAME = 'cloud';
      process.env.CLOUDINARY_API_KEY = 'key';
      process.env.CLOUDINARY_API_SECRET = 'secret';
      process.env.GEMINI_API_KEY = 'gemini-key';

      expect(() => validateEnvironment()).not.toThrow();
    });

    it('should throw with an error message mentioning missing variable names', () => {
      // Toutes les vars absentes en production
      try {
        validateEnvironment();
      } catch (err) {
        expect((err as Error).message).toContain('DATABASE_URL');
      }
    });

    it('should throw even when variable is set to empty string', () => {
      process.env.DATABASE_URL = '   '; // espace uniquement → considéré vide
      process.env.BETTER_AUTH_SECRET = 'secret';
      process.env.BETTER_AUTH_URL = 'http://app.kanto.mg';

      expect(() => validateEnvironment()).toThrow();
    });
  });
});
