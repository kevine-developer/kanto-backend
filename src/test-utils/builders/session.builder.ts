/**
 * Builders pour les sessions de jeu (Riddle, TrueFalse) dans les tests.
 */

let _counter = 1;

export function buildRiddleQuestion(overrides: Record<string, any> = {}) {
  const id = `riddle-q-${_counter++}`;
  return {
    id,
    questionMg: "Inona no lehiben'ny Madagascar?",
    questionFr: 'Quelle est la capitale de Madagascar ?',
    correctAnswer: 'Antananarivo',
    explanation: 'Antananarivo est la capitale depuis 1610.',
    level: 1,
    status: 'PUBLISHED',
    timesPlayed: 0,
    timesCorrect: 0,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

export function buildRiddleSession(
  userId: string | null = null,
  overrides: Record<string, any> = {},
) {
  return {
    id: `riddle-session-${_counter++}`,
    userId,
    totalQuestions: 5,
    score: null,
    streakMax: null,
    durationSeconds: null,
    xpEarned: null,
    isCompleted: false,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

export function buildRiddleAnswer(
  sessionId: string,
  questionId: string,
  overrides: Record<string, any> = {},
) {
  return {
    id: `riddle-ans-${_counter++}`,
    sessionId,
    questionId,
    userAnswer: 'Antananarivo',
    isCorrect: true,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

export function buildTrueFalseQuestion(overrides: Record<string, any> = {}) {
  return {
    id: `tf-q-${_counter++}`,
    questionMg: 'Madagascar dia ny firenena lehibe indrindra eto Afrika',
    questionFr: "Madagascar est le plus grand pays d'Afrique",
    isTrue: false,
    theme: 'GEN',
    difficulty: 'EASY',
    status: 'PUBLISHED',
    image: null,
    explanationMg: null,
    explanationFr: "Madagascar n'est pas le plus grand pays d'Afrique.",
    timesPlayed: 0,
    timesCorrect: 0,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

export function buildTrueFalseSession(
  userId: string | null = null,
  overrides: Record<string, any> = {},
) {
  return {
    id: `tf-session-${_counter++}`,
    userId,
    theme: 'GEN',
    difficulty: 'EASY',
    totalQuestions: 10,
    score: null,
    streakMax: null,
    durationSeconds: null,
    xpEarned: null,
    isCompleted: false,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

export function buildVintanaSign(overrides: Record<string, any> = {}) {
  return {
    id: `sign-${_counter++}`,
    nameMg: 'Alahamady',
    nameFr: 'Bélier',
    description: 'Premier signe du zodiaque malgache',
    symbol: '♈',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

export function buildVintanaForecast(
  signId: string,
  overrides: Record<string, any> = {},
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    id: `forecast-${_counter++}`,
    signId,
    date: today,
    prediction: 'Un jour propice à la réflexion.',
    mood: 'Positif',
    sign: buildVintanaSign({ id: signId }),
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    ...overrides,
  };
}
