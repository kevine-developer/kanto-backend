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
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
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
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
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
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
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
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
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
