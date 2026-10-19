-- Migration : Normalisation des comptes credential pour conformité Better-Auth
-- Cette migration garantit que tous les comptes à mot de passe (credential) existants
-- disposent du bon issuer ('local:credential') et accountId ('userId'), éliminant
-- définitivement l'erreur "Credential account not found" lors des modifications de mot de passe.

UPDATE "accounts"
SET "issuer" = 'local:credential'
WHERE "providerId" = 'credential' AND ("issuer" IS NULL OR "issuer" != 'local:credential');

UPDATE "accounts"
SET "accountId" = "userId"
WHERE "providerId" = 'credential' AND ("accountId" IS NULL OR "accountId" != "userId");
