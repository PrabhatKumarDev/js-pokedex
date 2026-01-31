import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import useFavourites from '../../hooks/useFavourites'

const PokemonCard = ({ pokemon }) => {
  if (!pokemon) return null

  const hiResUrl = pokemon.sprites?.other?.['official-artwork']?.front_default
  const lowResUrl = pokemon.sprites?.front_default
  const [src, setSrc] = useState(lowResUrl || hiResUrl)
  const [imgLoaded, setImgLoaded] = useState(false)

  const { favourites, toggleFavorite } = useFavourites()
  const [favorite, setFavorite] = useState(favourites.includes(pokemon.id))

  // Sync favorite with global favourites
  useEffect(() => {
    setFavorite(favourites.includes(pokemon.id))
  }, [favourites, pokemon.id])

  // Progressive hi-res image loading
  useEffect(() => {
    setSrc(lowResUrl || hiResUrl)
    setImgLoaded(false)

    if (hiResUrl && hiResUrl !== lowResUrl) {
      const img = new Image()
      img.src = hiResUrl
      img.onload = () => {
        setSrc(hiResUrl)
        setImgLoaded(true)
      }
    }
  }, [hiResUrl, lowResUrl])

  const idText = `#${String(pokemon.id).padStart(3, '0')}`

  return (
    <div className='group relative w-full'>
      <Link to={`/pokemon/${pokemon.name}`} className='block h-full'>
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 group-hover:-translate-y-1">
          <div className={"absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-2xl"} style={{ backgroundColor: `var(--type-${pokemon.types?.[0]?.type?.name || 'normal'})` }} />

          <div className="absolute top-3 left-3 z-10">
            <span className="font-mono text-xs font-bold text-muted-foreground/60">{idText}</span>
          </div>

          <div className="relative mx-auto mb-4 h-32 w-32">
            <div className="absolute inset-0 rounded-full bg-muted/50" />
            {src ? (
              <img
                src={src}
                alt={pokemon.name}
                width={128}
                height={128}
                loading="lazy"
                decoding="async"
                className={`relative mx-auto h-28 w-28 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-80 blur-sm'}`}
              />
            ) : null}
          </div>

          <div className="space-y-2 text-center">
            <h3 className="font-semibold capitalize text-foreground">{pokemon.name}</h3>

            <div className="flex items-center justify-center gap-1.5">
              {pokemon.types?.map(({ type }) => (
                <span
                  key={type.name}
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
                  style={{ backgroundColor: `var(--type-${type.name})` }}
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/50 pt-3">
            {pokemon.stats?.slice(0, 3).map(({ stat, base_stat }) => (
              <div key={stat.name} className="text-center">
                <div className="text-xs font-bold text-foreground">{base_stat}</div>
                <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
                  {stat.name === 'special-attack' ? 'Sp.Atk' : stat.name === 'special-defense' ? 'Sp.Def' : stat.name.slice(0, 3)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Link>

      <button
        type="button"
        className={`absolute flex justify-center items-center top-3 right-3 z-20 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm transition-all hover:scale-110 ${favorite ? 'text-red-500 hover:text-red-600' : ''}`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleFavorite(pokemon.id)   // update global favourites
          setFavorite(!favorite)       // update local immediately
        }}
      >
        <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
        <span className="sr-only">
          {favorite ? "Remove from favorites" : "Add to favorites"}
        </span>
      </button>
    </div>
  )
}

export default PokemonCard
