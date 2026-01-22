export const POINTS = {
  TRUTH_COMPLETE: 10,
  DARE_COMPLETE: 20,
  CHALLENGE_COMPLETE: 15,
  QUIZ_CORRECT: 10,
  SKIP: -5,
  STREAK_BONUS: 25,
  FAVOURITE: 2,
}

const gameCompletePoints = {
  truth: POINTS.TRUTH_COMPLETE,
  dare: POINTS.DARE_COMPLETE,
  challenge: POINTS.CHALLENGE_COMPLETE,
  rather: 0,
  quiz: 0,
  fantasy: 0,
}

export function calculatePoints(action, gameId) {
  switch (action) {
    case 'skip':
      return POINTS.SKIP
    case 'favourite':
      return POINTS.FAVOURITE
    case 'correct':
      return POINTS.QUIZ_CORRECT
    case 'complete':
      return gameCompletePoints[gameId] || 0
    default:
      return 0
  }
}

export function checkStreak(history, playerIndex) {
  const playerEntries = history
    .filter((e) => e.playerIndex === playerIndex && e.result === 'completed')
  const lastFive = playerEntries.slice(0, 5)
  return lastFive.length === 5
}

export function formatScore(score) {
  if (score > 0) return `+${score}`
  return `${score}`
}
