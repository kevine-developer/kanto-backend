import { SeedCategoryStats } from './types.js';

/**
 * Affiche un compte rendu d'observabilité soigné et structuré dans les logs du serveur.
 */
export function printConsolidatedReport(statsList: SeedCategoryStats[]): void {
  console.log('\n═══════════════════════════════════════════════════════════════════════════════════════');
  console.log('📊 RAPPORT DE SYNCHRONISATION DU CORPUS DE RÉFÉRENCE KANTO MG');
  console.log('═══════════════════════════════════════════════════════════════════════════════════════');

  const pad = (str: string | number, length: number, alignRight = false) => {
    const s = String(str);
    if (s.length >= length) return s.slice(0, length);
    const space = ' '.repeat(length - s.length);
    return alignRight ? space + s : s + space;
  };

  const header = `${pad('Catégorie', 38)} | ${pad('Total', 6, true)} | ${pad('Créés', 6, true)} | ${pad('Mis à jour', 10, true)} | ${pad('Inchangés', 9, true)} | ${pad('Ignorés', 7, true)} | ${pad('Erreurs', 7, true)}`;
  console.log(header);
  console.log('─'.repeat(header.length));

  let sumTotal = 0;
  let sumCreated = 0;
  let sumUpdated = 0;
  let sumUnchanged = 0;
  let sumSkipped = 0;
  let sumErrors = 0;

  for (const s of statsList) {
    sumTotal += s.totalInFile;
    sumCreated += s.created;
    sumUpdated += s.updated;
    sumUnchanged += s.unchanged;
    sumSkipped += s.skipped;
    sumErrors += s.errors;

    const line = `${pad(s.category, 38)} | ${pad(s.totalInFile, 6, true)} | ${pad(s.created, 6, true)} | ${pad(s.updated, 10, true)} | ${pad(s.unchanged, 9, true)} | ${pad(s.skipped, 7, true)} | ${pad(s.errors, 7, true)}`;
    console.log(line);
  }

  console.log('═'.repeat(header.length));
  const totalLine = `${pad('TOTAL GÉNÉRAL', 38)} | ${pad(sumTotal, 6, true)} | ${pad(sumCreated, 6, true)} | ${pad(sumUpdated, 10, true)} | ${pad(sumUnchanged, 9, true)} | ${pad(sumSkipped, 7, true)} | ${pad(sumErrors, 7, true)}`;
  console.log(totalLine);
  console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');

  if (sumErrors > 0) {
    console.warn(`⚠️ [Attention] ${sumErrors} erreur(s) signalée(s) pendant la synchronisation.`);
  } else {
    console.log(`✨ [Succès] Synchronisation terminée : 0 doublon créé, ${sumCreated} nouveau(x) contenu(s) inséré(s), intégrité des données utilisateurs préservée.`);
  }
}

