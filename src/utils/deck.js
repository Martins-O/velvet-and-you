export function shuffle(arr) {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export async function buildDeck(gameId, intensity) {
  const data = await import(`../data/prompts/${gameId}.json`)

  let rawPrompts
  if (gameId === 'bottle') {
    rawPrompts = [...data.default]
  } else {
    rawPrompts = [...data.default[intensity]]
  }

  const builtIn = rawPrompts.map((p) =>
    typeof p === 'string' ? { text: p } : p
  )

  const customRaw = JSON.parse(
    localStorage.getItem(`velvet_custom_${gameId}`) || '[]'
  )
  const custom = customRaw
    .filter((c) => c.intensity === intensity)
    .map((c) => ({ text: c.text, __custom: true }))

  return shuffle([...builtIn, ...custom])
}

export function drawNext(deck, usedIndices) {
  const usedSet = new Set(usedIndices)
  for (let i = 0; i < deck.length; i++) {
    if (!usedSet.has(i)) {
      return { card: deck[i], index: i, exhausted: false }
    }
  }
  return { card: null, index: -1, exhausted: true }
}

export function resetDeck(gameId, intensity) {
  return buildDeck(gameId, intensity)
}
