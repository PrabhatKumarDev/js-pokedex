import React from 'react'
import { useParams } from 'react-router-dom'

const PokemonDetails = () => {
  const { name } = useParams()
  return (
    <div>
      Pokemon Details:{name}
    </div>
  )
}

export default PokemonDetails
