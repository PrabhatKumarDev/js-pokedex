import React, { useState } from "react";
import { Section, Zap } from "lucide-react";
import SearchBar from "../components/pokemon/SearchBar";
import PokemonGrid from "../components/pokemon/PokemonGrid";
const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')

  return (<>
    <section className="relative overflow-hidden border-b border-border/50">
      {/* background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/4 h-64 w-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 h-64 w-64 bg-accent/5 rounded-full blur-3xl" />

      {/* content */}
      <div className="flex flex-col justify-center items-center gap-6 py-16 px-4 md:py-24 border-b border-border/50 ">
        <div className=" text-xs tracking-tight text-foreground bg-primary/10 px-4 py-1.5 rounded-full text-center border border-primary/20 flex items-center gap-2 text-primary">
          <Zap className="h-3.5 w-3.5" />
          <h1 className="font-semibold tracking-wider">
            ADVANCED POKEMON ENCYCLOPEDIA
          </h1>
        </div>
        <h1 className="flex flex-col items-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
          Discover the World of
          <span className="block text-primary">Pokemon</span>
        </h1>

        <p className="max-w-xl text-base text-muted-foreground md:text-lg text-pretty">
          Explore detailed information about every Pokemon. Browse stats,
          abilities, and evolutions in our futuristic digital encyclopedia.
        </p>
        <div className="w-[80%] pt-4 ">
          <SearchBar onSearch={(q) => setSearchQuery(q)} />
        </div>
        <div className="flex items-center gap-8 pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">1000+</div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Pokemon
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">18</div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Types
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">9</div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Generations
            </div>
          </div>
        </div>
      </div>
    </section>
    <PokemonGrid query={searchQuery} />
    </>
  );
};

export default Home;
