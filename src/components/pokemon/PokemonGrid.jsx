import React, { useEffect, useState, useRef, useCallback } from 'react'
import PokemonCard from './PokemonCard'
import { getPokemonList, getPokemonDetails } from '../../services/pokeapi'

const PokemonGrid = ({ batch = 24, query = '' }) => {
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef(null)
  const sentinelRef = useRef(null)
  const loadingRef = useRef(false)

  const loadBatch = useCallback(async (nextOffset) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      const list = await getPokemonList(batch, nextOffset)
      const results = list.results || []
      if (results.length === 0) {
        setHasMore(false)
        return
      }

      const details = await Promise.all(results.map(r => getPokemonDetails(r.name).catch(() => null)))
      setPokemons(prev => [...prev, ...details.filter(Boolean)])
      setOffset(prev => prev + batch)
      // if less than batch returned, no more
      if (results.length < batch) setHasMore(false)
    } catch (err) {
      setError(err.message || 'Failed to load pokemons')
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [batch])

  // initial load is handled by the search-effect below (query === ''),
  // and by the observer when the sentinel comes into view. Guard against
  // duplicate network requests using `loadingRef`.

  // Watch for search query changes. If a query is present, fetch that pokemon and
  // replace the grid contents with the single result. If query is cleared, reset.
  useEffect(() => {
    let mounted = true
    async function runSearch() {
      if (!query) {
        // reset to initial infinite-list state
        setPokemons([])
        setOffset(0)
        setHasMore(true)
        setError(null)
        loadBatch(0)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const p = await getPokemonDetails(query)
        if (mounted) {
          setPokemons([p])
          setHasMore(false)
        }
      } catch (err) {
        if (mounted) {
          setPokemons([])
          setError('No Pokémon found')
          setHasMore(false)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    runSearch()
    return () => { mounted = false }
  }, [query])

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return
    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !loading) {
          loadBatch(offset)
        }
      })
    }, { rootMargin: '200px' })

    observerRef.current.observe(sentinelRef.current)
    return () => observerRef.current?.disconnect()
  }, [offset, loadBatch, hasMore, loading])

  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 p-4'>
        {pokemons.map(p => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-8 flex items-center justify-center">
        {loading ? <div>Loading more...</div> : hasMore ? <div /> : <div>End of list</div>}
      </div>
    </>
  )
}

export default PokemonGrid
