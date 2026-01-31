import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import PokemonDetails from './pages/PokemonDetails'
import Favourites from './pages/Favourites'
import NotFound from './pages/NotFound'
import Navbar from './components/layout/Navbar'
import './App.css'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pokemon/:name' element={<PokemonDetails />} />
        <Route path='/favourites' element={<Favourites />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;
