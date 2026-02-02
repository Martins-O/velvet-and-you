import useLocalStorage from '../../hooks/useLocalStorage'
import { useSound } from '../../hooks/useSound'
import { useToast } from '../ui/useToast'

function FavouriteButton({ card, gameId, intensity, onToggle }) {
  const [favourites, setFavourites] = useLocalStorage('velvet_favourites', [])
  const { addToast } = useToast()
  const { play } = useSound()

  const isSaved = favourites.some((f) => f.card === card || f.text === card)

  const handleToggle = () => {
    if (isSaved) {
      setFavourites(favourites.filter((f) => f.card !== card))
      addToast('Removed from favourites')
      onToggle?.(card, false)
    } else {
      setFavourites([
        { card, gameId, intensity, savedAt: Date.now() },
        ...favourites,
      ])
      play('favourite')
      addToast('Saved to favourites ♥')
      onToggle?.(card, true)
    }
  }

  return (
    <button
      onClick={handleToggle}
      title={isSaved ? 'Remove from favourites' : 'Save to favourites'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        lineHeight: 1,
        padding: '0.25rem',
        color: isSaved ? 'var(--blush)' : 'var(--text-dim)',
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.target.style.color = 'var(--blush)'
      }}
      onMouseLeave={(e) => {
        e.target.style.color = isSaved ? 'var(--blush)' : 'var(--text-dim)'
      }}
    >
      {isSaved ? '\u2665' : '\u2661'}
    </button>
  )
}

export default FavouriteButton
