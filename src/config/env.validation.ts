import { Logger } from '@nestjs/common';

interface RequiredEnvConfig {
  name: string;
  requiredInProductionOnly?: boolean;
}

const REQUIRED_ENV_VARS: RequiredEnvConfig[] = [
  { name: 'DATABASE_URL' },
  { name: 'BETTER_AUTH_SECRET' },
  { name: 'BETTER_AUTH_URL' },
  { name: 'CLOUDINARY_CLOUD_NAME', requiredInProductionOnly: true },
  { name: 'CLOUDINARY_API_KEY', requiredInProductionOnly: true },
  { name: 'CLOUDINARY_API_SECRET', requiredInProductionOnly: true },
  { name: 'GEMINI_API_KEY', requiredInProductionOnly: true },
  { name: 'RESEND_API_KEY', requiredInProductionOnly: true },
];

/**
 * Valide les variables d'environnement au démarrage.
 * Émet des avertissements clairs ou lève une exception si une variable critique est absente.
 */
export function validateEnvironment(): void {
  const logger = new Logger('EnvironmentValidator');
  const isProduction = process.env.NODE_ENV === 'production';
  const missingCritical: string[] = [];
  const missingOptional: string[] = [];

  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar.name];
    if (!value || value.trim() === '') {
      if (envVar.requiredInProductionOnly && !isProduction) {
        missingOptional.push(envVar.name);
      } else {
        missingCritical.push(envVar.name);
      }
    }
  }

  if (missingOptional.length > 0) {
    logger.warn(
      `⚠️ [Config] Variables d'environnement tierces non définies en développement : ${missingOptional.join(', ')} (Les services associés fonctionneront en mode dégradé).`,
    );
  }

  if (missingCritical.length > 0) {
    const errorMsg = `❌ [Config] Variables d'environnement obligatoires manquantes : ${missingCritical.join(', ')}`;
    logger.error(errorMsg);
    if (isProduction) {
      throw new Error(errorMsg);
    }
  } else {
    logger.log("✅ [Config] Validation des variables d'environnement réussie.");
  }
}
