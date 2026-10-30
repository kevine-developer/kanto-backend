import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateMalagasyItemsBatch,
  validateCitationsBatch,
  validateRakiTenyBatch,
  validateQuizBatch,
  validateTrueFalseBatch,
  validateRiddlesBatch,
} from './validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedDataDir = path.resolve(__dirname, '../seed-data');

console.log('🔍 [Kanto Seed Verify] Audit d\'intégrité des fichiers JSON de données...\n');

let totalFilesChecked = 0;
let totalErrors = 0;

function checkFile(fileName: string, validator: (data: unknown) => { isValid: boolean; issues: any[] }) {
  const filePath = path.join(seedDataDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ [Absent] ${fileName} n'existe pas dans ${seedDataDir}`);
    return;
  }

  totalFilesChecked++;
  try {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(rawContent);

    const report = validator(parsed);
    const count = Array.isArray(parsed) ? parsed.length : Array.isArray(parsed?.questions) ? parsed.questions.length : 0;

    if (!report.isValid) {
      console.error(`❌ [Validation Échouée] ${fileName} (${count} entrées) : ${report.issues.length} anomalie(s)`);
      report.issues.slice(0, 5).forEach((issue) => {
        console.error(`    - Ligne/Index ${issue.itemIndex} [${issue.identifier || 'sans-id'}]: ${issue.message}`);
      });
      if (report.issues.length > 5) {
        console.error(`    ... et ${report.issues.length - 5} autre(s) anomalie(s).`);
      }
      totalErrors += report.issues.length;
    } else {
      console.log(`✅ [Valide] ${fileName} (${count} éléments contrôlés)`);
    }
  } catch (err: any) {
    console.error(`❌ [Syntaxe JSON] ${fileName} : ${err.message}`);
    totalErrors++;
  }
}

// Vérification de tous les fichiers de données du corpus Kanto
checkFile('malagasy-items.data.json', validateMalagasyItemsBatch);
checkFile('proverbes.data.json', validateMalagasyItemsBatch);
checkFile('dictons.data.json', validateMalagasyItemsBatch);
checkFile('expressions.data.json', validateMalagasyItemsBatch);
checkFile('citations.data.json', validateCitationsBatch);
checkFile('citation.data.json', validateCitationsBatch);
checkFile('raki-teny.data.json', validateRakiTenyBatch);
checkFile('quiz-verified.data.json', validateQuizBatch);
checkFile('civic-quiz.data.json', validateQuizBatch);
checkFile('true-false-verified.data.json', validateTrueFalseBatch);
checkFile('tf-culture.data.json', validateTrueFalseBatch);
checkFile('tf-general.data.json', validateTrueFalseBatch);
checkFile('tf-geographie.data.json', validateTrueFalseBatch);
checkFile('tf-histoire.data.json', validateTrueFalseBatch);
checkFile('tf-litterature.data.json', validateTrueFalseBatch);
checkFile('tf-proverbes.data.json', validateTrueFalseBatch);
checkFile('riddles.data.json', validateRiddlesBatch);

console.log('\n────────────────────────────────────────────────────────────────────────');
if (totalErrors === 0) {
  console.log(`✨ Tous les fichiers vérifiés (${totalFilesChecked}) sont 100% conformes aux schémas Prisma.`);
  process.exit(0);
} else {
  console.error(`🛑 Échec de la vérification : ${totalErrors} anomalie(s) détectée(s) sur ${totalFilesChecked} fichiers.`);
  process.exit(1);
}
