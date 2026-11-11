import crypto from 'node:crypto';

/**
 * Récupère la clé secrète serveur pour le hachage HMAC-SHA-256 des adresses e-mail.
 */
function getHmacSecret(): string {
  return (
    process.env.BETA_HMAC_SECRET ||
    process.env.JWT_SECRET ||
    process.env.BETTER_AUTH_SECRET ||
    'kanto_beta_default_hmac_secret_2026_do_not_use_in_prod'
  );
}

/**
 * Récupère la clé dérivée de 32 octets pour le chiffrement réversible AES-256-GCM.
 */
function getAesKey(): Buffer {
  const secret =
    process.env.BETA_ENCRYPTION_SECRET ||
    process.env.ENCRYPTION_KEY ||
    process.env.JWT_SECRET ||
    'kanto_beta_default_aes_key_2026_do_not_use_in_prod';
  // Dérivation d'une clé de 32 octets déterministe via SHA-256
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Hachage déterministe HMAC-SHA-256 d'une adresse email normalisée.
 * Permet l'indexation, la détection exacte des doublons et la recherche rapide
 * tout en protégeant contre les attaques par dictionnaire ou tables arc-en-ciel.
 */
export function hashEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }
  const normalized = email.trim().toLowerCase();
  return crypto
    .createHmac('sha256', getHmacSecret())
    .update(normalized)
    .digest('hex');
}

/**
 * Chiffre une adresse e-mail avec l'algorithme AES-256-GCM (chiffrement réversible sécurisé).
 * Format de sortie sérialisé : `enc:v1:<iv_hex>:<authTag_hex>:<ciphertext_hex>`
 */
export function encryptEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }
  const cleanEmail = email.trim().toLowerCase();
  // Ne pas ré-chiffrer si déjà au format chiffré
  if (cleanEmail.startsWith('enc:v1:')) {
    return cleanEmail;
  }

  const iv = crypto.randomBytes(16);
  const key = getAesKey();
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(cleanEmail, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `enc:v1:${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Déchiffre une adresse e-mail chiffrée avec AES-256-GCM.
 * Si la chaîne n'est pas chiffrée (adresse legacy existante en base), elle est retournée telle quelle.
 */
export function decryptEmail(value: string | null | undefined): string {
  if (!value || typeof value !== 'string') {
    return '';
  }
  if (!value.startsWith('enc:v1:')) {
    return value; // Donnée legacy en clair
  }

  try {
    const parts = value.split(':');
    if (parts.length !== 5) {
      return value;
    }
    const [, , ivHex, tagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(tagHex, 'hex');
    const key = getAesKey();

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    // Si échec de déchiffrement, renvoie la valeur brute
    return value;
  }
}

/**
 * Masque une adresse e-mail pour l'affichage administratif par défaut et les journaux de logs.
 * Exemple: "kevine-developer@gmail.com" -> "kev***@gmail.com"
 * Exemple: "rado@orange.mg" -> "ra***@orange.mg"
 * Exemple: "a@b.com" -> "a***@b.com"
 */
export function maskEmail(emailOrCipher: string | null | undefined): string {
  if (!emailOrCipher || typeof emailOrCipher !== 'string') {
    return '—';
  }
  // Déchiffrer si nécessaire avant masquage
  const clearEmail = decryptEmail(emailOrCipher).trim();
  if (!clearEmail || !clearEmail.includes('@')) {
    return '—';
  }

  const [username, domain] = clearEmail.split('@');
  if (!domain) {
    return clearEmail;
  }

  let maskedUser: string;
  if (username.length <= 2) {
    maskedUser = `${username[0]}***`;
  } else if (username.length <= 4) {
    maskedUser = `${username.slice(0, 2)}***`;
  } else {
    maskedUser = `${username.slice(0, 3)}***`;
  }

  return `${maskedUser}@${domain}`;
}

/**
 * Protection contre l'injection de formules dans les fichiers CSV (CWE-1236).
 * Si une cellule commence par `=, +, -, @, \t, \r`, elle est neutralisée avec une apostrophe `'`.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value);
  // Neutralisation des formules malveillantes Excel / Calc (CWE-1236)
  if (/^[=+\-@\t\r]/.test(str.trimStart()) || /^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Échappement des guillemets doubles
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Génère un jeton cryptographiquement sécurisé.
 */
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Hache un jeton public avec SHA-256 pour stockage sécurisé au repos.
 */
export function hashToken(token: string): string {
  if (!token || typeof token !== 'string') {
    return '';
  }
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}
