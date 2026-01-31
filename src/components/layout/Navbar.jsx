import React from 'react'
import Logo from '../../assets/PokemonLogo.png'
import { House,Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <div className=' h-24 w-full flex justify-center items-center shadow-lg pb-2'>
      <div className="bg-white w-[60%] h-full flex ">
        <Link className="logo w-full h-full mx-4 my-2" to="/">
          <img className='h-full object-contain p-2' src={Logo} alt="Pokemon Logo" />
        </Link>
        <div className="nav-links flex gap-8 text-lg font-semibold text-gray-700 flex items-center mx-4">
          <Link className="home flex items-center gap-2" to="/"><House /> <span>Home</span></Link>
          <Link className="favourites flex items-center gap-2" to="/favourites"><Heart /> <span>Favourites</span></Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar
