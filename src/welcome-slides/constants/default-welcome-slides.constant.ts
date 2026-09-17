export interface DefaultWelcomeSlideItem {
  id: string;
  badge: string;
  badgeMg: string;
  title: string;
  titleMg: string;
  tag: string;
  imageUrl: string;
  accentColor: string;
  orderIndex: number;
}

export const DEFAULT_WELCOME_SLIDES: DefaultWelcomeSlideItem[] = [
  {
    id: 'angano',
    badge: 'Contes',
    badgeMg: 'Angano',
    title: 'Ikotofetsy sy Imahakà',
    titleMg: 'Ikotofetsy sy Imahakà',
    tag: 'Récits & Audio',
    imageUrl:
      'https://res.cloudinary.com/dhe585mze/image/upload/v1788022553/kanto/images/onboarding/capture_d__cran_2026-06-15_183248_1788022552959.png',
    accentColor: '#4A6741',
    orderIndex: 0,
  },
  {
    id: 'kabary',
    badge: 'Art Oratoire',
    badgeMg: 'Kabary',
    title: 'Kabary am-panambadiana',
    titleMg: 'Kabary am-panambadiana',
    tag: 'Poésie & Rituels',
    imageUrl:
      'https://res.cloudinary.com/dhe585mze/image/upload/v1788022563/kanto/images/onboarding/capture_d__cran_2026-01-08_161138_1788022563950.png',
    accentColor: '#3E6B55',
    orderIndex: 1,
  },
  {
    id: 'ohabolana',
    badge: 'Proverbes',
    badgeMg: 'Ohabolana',
    title: 'Ny Fihavanana no lehibe',
    titleMg: 'Ny Fihavanana no lehibe',
    tag: 'Sagesses Malagasy',
    imageUrl:
      'https://res.cloudinary.com/dhe585mze/image/upload/v1788022560/kanto/images/onboarding/capture_d__cran_2025-12-08_164642_1788022559754.png',
    accentColor: '#5C7A3E',
    orderIndex: 2,
  },
  {
    id: 'hainteny',
    badge: 'Poésie',
    badgeMg: 'Hainteny',
    title: 'Haintenin-dRazana',
    titleMg: 'Haintenin-dRazana',
    tag: 'Orfèvrerie des Mots',
    imageUrl:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop',
    accentColor: '#7A5B3E',
    orderIndex: 3,
  },
  {
    id: 'valiha',
    badge: 'Musique',
    badgeMg: 'Feon-kira',
    title: 'Valiha sy Kalon-dRazana',
    titleMg: 'Valiha sy Kalon-dRazana',
    tag: 'Instruments Sacrés',
    imageUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    accentColor: '#8C6D3B',
    orderIndex: 4,
  },
  {
    id: 'lalao',
    badge: 'Jeux',
    badgeMg: 'Lalao',
    title: 'Vrai ou Faux & Défis',
    titleMg: 'Marina sa Diso',
    tag: 'Quiz & Multijoueur',
    imageUrl:
      'https://res.cloudinary.com/dhe585mze/image/upload/v1753433200/Photoroom-20250725_025113719_voarxl.png',
    accentColor: '#C58B38',
    orderIndex: 5,
  },
  {
    id: 'tantara',
    badge: 'Histoire',
    badgeMg: 'Tantara',
    title: 'Andrianampoinimerina',
    titleMg: 'Mpanjaka sy Lova',
    tag: 'Rois & Héritage',
    imageUrl:
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop',
    accentColor: '#B84040',
    orderIndex: 6,
  },
];
