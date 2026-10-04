/**
 * Kanto — Design Tokens & Helpers pour les emails transactionnels.
 * Respect strict de la charte Kanto (Vert Tanimbary, Ocre Doré, Terracotta, Fond parchemin),
 * typographie Plus Jakarta Sans, aucune dépendance d'emoji, compatibilité clients email.
 */

export const KANTO_COLORS = {
  // Vert Tanimbary (Signature principale de l'application)
  tanimbary: '#4A6741',
  tanimbaryHover: '#385131',
  tanimbaryLight: '#EEF3EC',
  tanimbaryBorder: '#CBD8C6',
  tanimbaryText: '#2F452A',

  // Ocre Doré / Ambre (Sagesse et culture malgache)
  ambre: '#C58B38',
  ambreHover: '#A8732A',
  ambreLight: '#FDF6EB',
  ambreBorder: '#F3DEC0',
  ambreText: '#7C5216',

  // Terracotta / Tany Mena (Actions de sécurité et alertes)
  terracotta: '#8B2519',
  terracottaHover: '#701B12',
  terracottaLight: '#FDF2F0',
  terracottaBorder: '#F0CECA',
  terracottaText: '#6F1C12',

  // Teintes sombres neutres
  dark: '#1A1A1A',
  darkHover: '#2A2A2A',

  // Structure & surfaces
  bodyBg: '#F5F4F0',
  cardBg: '#FFFFFF',
  cardBorder: '#E5E2DB',
  divider: '#EDEAE3',

  // Typographie & texte
  textPrimary: '#1A1A1A',
  textSecondary: '#4A4A4A',
  textMuted: '#6B6B6B',
  textFootnote: '#8A8A8A',
} as const;

export const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/**
 * Icône vectorielle officielle Google Play (compatible email HTML inline).
 * Conçue sans aucune dépendance d'image externe ni d'emoji.
 */
export function getGooglePlaySvgIcon(size = 22): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; display: inline-block;">
    <path d="M3.6 1.7C3.3 2 3.2 2.5 3.2 3.1V20.9C3.2 21.5 3.3 22 3.6 22.3L3.7 22.4L13.5 12.6V12.4V12.2L3.7 2.4L3.6 1.7Z" fill="#00E676"/>
    <path d="M16.7 15.8L13.5 12.6V12.4V12.2L16.7 9L16.8 9.1L20.6 11.2C21.7 11.8 21.7 12.8 20.6 13.4L16.8 15.6L16.7 15.8Z" fill="#FFC400"/>
    <path d="M16.8 15.7L13.5 12.4L3.6 22.3C4 22.7 4.7 22.8 5.5 22.3L16.8 15.7Z" fill="#FF3D00"/>
    <path d="M16.8 9.1L5.5 2.5C4.7 2.1 4 2.1 3.6 2.5L13.5 12.4L16.8 9.1Z" fill="#00B0FF"/>
  </svg>`;
}

/**
 * Icônes vectorielles sobres et épurées pour la charte graphique Kanto.
 */
export function getVectorIcon(
  name:
    | 'shield'
    | 'check'
    | 'mail'
    | 'book'
    | 'arrow'
    | 'device'
    | 'info'
    | 'terminal'
    | 'chat',
  color = KANTO_COLORS.tanimbary,
  size = 18,
): string {
  switch (name) {
    case 'shield':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>`;
    case 'check':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <polyline points="20 6 9 17 4 12"/>
      </svg>`;
    case 'mail':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>`;
    case 'book':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>`;
    case 'arrow':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>`;
    case 'device':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>`;
    case 'info':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>`;
    case 'terminal':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <polyline points="4 17 10 11 4 5"/>
        <line x1="12" y1="19" x2="20" y2="19"/>
      </svg>`;
    case 'chat':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>`;
  }
}
