import React, { useEffect, useState } from 'react'
import useFavourites from '../hooks/useFavourites'
import { getPokemonDetails } from '../services/pokeapi'
import PokemonCard from '../components/pokemon/PokemonCard'
import { Link } from 'react-router-dom'

const Favourites = () => {
  const { favourites } = useFavourites()
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const details = await Promise.all(
          favourites.map(id =>
            getPokemonDetails(id).catch(() => null)
          )
        )
        if (mounted) setPokemons(details.filter(Boolean))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (favourites.length) load()
    else setPokemons([])

    return () => { mounted = false }
  }, [favourites])

  if (loading) {
    return <div className="p-6 text-center">Loading favourites...</div>
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="mb-6 text-2xl font-bold">My Favourites</h1>

      {pokemons.length === 0 ? (
        <div className="text-muted-foreground">
          No favourites yet.{' '}
          <Link to="/" className="text-primary hover:underline">
            Browse Pokémon
          </Link>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-6
            gap-4
          "
        >
          {pokemons.map(p => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      )}
    </main>
  )
}

export default Favourites
