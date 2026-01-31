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
        const details = await Promise.all(favourites.map(id => getPokemonDetails(id).catch(() => null)))
        if (mounted) setPokemons(details.filter(Boolean))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (favourites.length) load()
    else setPokemons([])
    return () => { mounted = false }
  }, [favourites])

  if (loading) return <div className="p-4">Loading favourites...</div>

  return (
    
    <div className="px-53 py-15 ">
      <h1 className="text-2xl font-bold mb-4">My Favourites</h1>
      {pokemons.length === 0 ? (
        <div>
          No favourites yet. <Link to="/">Browse pokémon</Link>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {pokemons.map(p => <PokemonCard key={p.id} pokemon={p} />)}
        </div>
      )}
    </div>
  )
}

export default Favourites
