import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Moon, Sun, Heart, Zap } from "lucide-react"

const Navbar = () => {
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(0)

  useEffect(() => {
    setMounted(true)

    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    )
    setFavoritesCount(storedFavorites.length)
  }, [])

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("dark", next)
      localStorage.setItem("theme", next ? "dark" : "light")
      return next
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <Zap className="h-5 w-5 text-primary" />
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">
              Pokédex
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Advanced Encyclopedia
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 mr-37">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            Explore
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
          </Link>

          <Link
            to="/favourites"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group flex items-center gap-2"
          >
            Favorites
            {mounted && favoritesCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {favoritesCount}
              </span>
            )}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/favourites" className="md:hidden relative">
            <Heart className="h-5 w-5" />
            {mounted && favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {favoritesCount}
              </span>
            )}
          </Link>

          <button
            onClick={toggleTheme}
            className="relative h-9 w-9 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && (
              <>
                <Moon
                  className={`h-5 w-5 transition-all ${
                    darkMode ? "rotate-90 scale-0" : "rotate-0 scale-100"
                  }`}
                />
                <Sun
                  className={`absolute h-5 w-5 transition-all ${
                    darkMode ? "rotate-0 scale-100" : "-rotate-90 scale-0"
                  }`}
                />
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar