import {
  hashEmail,
  encryptEmail,
  decryptEmail,
  maskEmail,
  sanitizeCsvCell,
  generateSecureToken,
  hashToken,
} from './beta-crypto.util.js';

describe('BetaCryptoUtil', () => {
  describe('hashEmail (HMAC-SHA-256 déterministe)', () => {
    it('génère un hash hexadécimal de 64 caractères', () => {
      const hash = hashEmail('test@example.com');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('est invariant à la casse et aux espaces périphériques', () => {
      const h1 = hashEmail('Test.User@example.com');
      const h2 = hashEmail('  test.user@example.com  ');
      expect(h1).toBe(h2);
    });

    it('génère des hashes distincts pour des adresses différentes', () => {
      const h1 = hashEmail('alice@kanto.mg');
      const h2 = hashEmail('bob@kanto.mg');
      expect(h1).not.toBe(h2);
    });

    it('renvoie une chaîne vide si email invalide', () => {
      expect(hashEmail('')).toBe('');
      expect(hashEmail(null as any)).toBe('');
    });
  });

  describe('encryptEmail & decryptEmail (AES-256-GCM)', () => {
    it('chiffre et déchiffre fidèlement une adresse email', () => {
      const original = 'rakoto.kanto@gmail.com';
      const encrypted = encryptEmail(original);

      expect(encrypted).toMatch(/^enc:v1:[a-f0-9]{32}:[a-f0-9]{32}:[a-f0-9]+/);
      expect(encrypted).not.toContain(original);

      const decrypted = decryptEmail(encrypted);
      expect(decrypted).toBe(original);
    });

    it('génère des ciphertexts différents pour deux chiffrements consécutifs (IV aléatoire)', () => {
      const email = 'user@example.com';
      const enc1 = encryptEmail(email);
      const enc2 = encryptEmail(email);

      expect(enc1).not.toBe(enc2);
      expect(decryptEmail(enc1)).toBe(email);
      expect(decryptEmail(enc2)).toBe(email);
    });

    it('déchiffre de façon transparente les données legacy en clair', () => {
      const legacy = 'ancien.testeur@orange.mg';
      expect(decryptEmail(legacy)).toBe(legacy);
    });
  });

  describe('maskEmail (Masquage visuel et journaux)', () => {
    it('masque un email de longueur standard', () => {
      expect(maskEmail('kevine-developer@gmail.com')).toBe('kev***@gmail.com');
    });

    it('masque un email court', () => {
      expect(maskEmail('rado@orange.mg')).toBe('ra***@orange.mg');
      expect(maskEmail('ab@domain.com')).toBe('a***@domain.com');
    });

    it('sait masquer directement un email chiffré', () => {
      const encrypted = encryptEmail('soalaza@kanto.mg');
      expect(maskEmail(encrypted)).toBe('soa***@kanto.mg');
    });

    it('gère les entrées nulles ou vides sans planter', () => {
      expect(maskEmail('')).toBe('—');
      expect(maskEmail(null)).toBe('—');
      expect(maskEmail(undefined)).toBe('—');
    });
  });

  describe('sanitizeCsvCell (Protection contre CSV Formula Injection CWE-1236)', () => {
    it('neutralise les cellules commençant par =', () => {
      expect(sanitizeCsvCell('=1+1')).toBe(`"'=1+1"`);
      expect(sanitizeCsvCell('=cmd|/c calc')).toBe(`"'=cmd|/c calc"`);
    });

    it('neutralise les cellules commençant par +, -, @, \\t, \\r', () => {
      expect(sanitizeCsvCell('+234')).toBe(`"'+234"`);
      expect(sanitizeCsvCell('-12')).toBe(`"'-12"`);
      expect(sanitizeCsvCell('@SUM(A1:A10)')).toBe(`"'@SUM(A1:A10)"`);
      expect(sanitizeCsvCell('\tmalicious')).toBe(`"'\tmalicious"`);
    });

    it('échappe proprement les guillemets et préserve les valeurs saines', () => {
      expect(sanitizeCsvCell('Rakoto "Kanto"')).toBe(`"Rakoto ""Kanto"""`);
      expect(sanitizeCsvCell('Normal Text')).toBe(`"Normal Text"`);
      expect(sanitizeCsvCell(null)).toBe('""');
    });
  });

  describe('generateSecureToken & hashToken', () => {
    it('génère un token aléatoire hexadécimal', () => {
      const token = generateSecureToken(16);
      expect(token).toHaveLength(32);
    });

    it('hache un token avec SHA-256', () => {
      const token = 'my-secret-token-123';
      const hash = hashToken(token);
      expect(hash).toHaveLength(64);
      expect(hash).toBe(hashToken(token));
    });
  });
});

