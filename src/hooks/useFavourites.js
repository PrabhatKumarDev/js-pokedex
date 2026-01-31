import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'favourites'

export default function useFavourites() {
  const [favourites, setFavourites] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (_) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
    } catch (_) {}
  }, [favourites])

  const isFavorite = useCallback((id) => favourites.includes(id), [favourites])

  const toggleFavorite = useCallback((id) => {
    setFavourites(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      return [...prev, id]
    })
  }, [])

  return { favourites, isFavorite, toggleFavorite }
}
