import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Mars, Venus } from "lucide-react";
import {
  getPokemonDetails,
  getPokemonSpecies,
  getEvolutionChain,
} from "../services/pokeapi";
import useFavourites from "../hooks/useFavourites";

function getIdFromSpeciesUrl(url) {
    return url.split("/").filter(Boolean).pop();
  }
const PokemonDetails = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutions, setEvolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weaknesses, setWeaknesses] = useState([]);
  const { isFavorite, toggleFavorite } = useFavourites();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const p = await getPokemonDetails(name);
        const s = await getPokemonSpecies(name);
        setPokemon(p);
        setSpecies(s);

        // Fetch evolution chain
        (async () => {
  try {
    const typeResponses = await Promise.all(
      p.types.map((t) => fetch(t.type.url).then((r) => r.json()))
    );

    const weakTo = new Set();
    typeResponses.forEach((type) => {
      type.damage_relations.double_damage_from.forEach((d) =>
        weakTo.add(d.name)
      );
    });

    if (mounted) setWeaknesses([...weakTo]);
  } catch {}
})();


        if (s.evolution_chain?.url) {
          try {
            const chain = await getEvolutionChain(s.evolution_chain.url);
            const evolutionList = [];
            async function traverse(node) {
              const id = getIdFromSpeciesUrl(node.species.url);

              evolutionList.push({
                name: node.species.name,
                id,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
              });

              if (node.evolves_to?.length) {
                for (const child of node.evolves_to) {
                  await traverse(child);
                }
              }
            }

            await traverse(chain.chain);
            if (mounted) setEvolutions(evolutionList);
          } catch (_) {}
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [name]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!pokemon) return <div className="p-8 text-center">No data</div>;

  const favorite = isFavorite(pokemon.id);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  const flavor =
    species?.flavor_text_entries
      ?.find((f) => f.language.name === "en")
      ?.flavor_text?.replace(/\f|\n/g, " ") || "No description available";

  const MAX_STAT = 255;

  const generation = species?.generation?.name
    ? species.generation.name
        .replace("generation-", "Generation ")
        .toUpperCase()
    : "Unknown Generation";

  const generationColors = {
    "generation-i": "bg-red-500 text-white",
    "generation-ii": "bg-green-500 text-white",
    "generation-iii": "bg-blue-500 text-white",
    "generation-iv": "bg-yellow-500 text-black",
    "generation-v": "bg-purple-500 text-white",
    "generation-vi": "bg-pink-500 text-white",
    "generation-vii": "bg-indigo-500 text-white",
    "generation-viii": "bg-orange-500 text-white",
  };
  const genKey = species?.generation?.name || "unknown";
  const genClass = generationColors[genKey] || "bg-gray-500 text-white";
  const generationText = genKey
    .replace("generation-", "Generation ")
    .toUpperCase();


  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to={favorite ? "/favourites" : "/"}
          className="inline-flex items-center gap-2 px-4 py-2 my-6 rounded-lg text-primary font-semibold text-sm shadow hover:text-primary/60 transition-all"
        >
          ← Back {favorite ? "to Favourites" : "to browse"}
        </Link>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Image - Large bento box */}
          <div className="relative md:col-span-6 md:row-span-2 bg-card rounded-2xl p-8 flex flex-col items-center justify-center border border-border/50 relative group">
            {/* Glow effect behind image */}

            <div className=" flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-2xl blur-3xl opacity-15"
                style={{
                  backgroundColor: `var(--type-${pokemon.types?.[0]?.type?.name || "normal"})`,
                }}
              />

              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={pokemon.name}
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 w-64 h-64 object-contain drop-shadow-xl"
                />
              ) : (
                <div className="relative z-10 w-64 h-64 bg-muted/20 rounded flex items-center justify-center">
                  No image
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold capitalize">
                {pokemon.name}
              </h1>
              <span className="text-lg font-mono text-muted-foreground">
                #{String(pokemon.id).padStart(3, "0")}
              </span>
            </div>
            {/* Favorite button */}
            <button
              type="button"
              onClick={() => toggleFavorite(pokemon.id)}
              className={`absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm transition-all hover:scale-110 flex items-center justify-center ${favorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Heart className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} />
              <span className="sr-only">
                {favorite ? "Remove from favorites" : "Add to favorites"}
              </span>
            </button>

            <div className="mt-6 flex gap-2 flex-wrap justify-center relative z-10">
              {pokemon.types.map(({ type }) => (
                <span
                  key={type.name}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white capitalize"
                  style={{ backgroundColor: `var(--type-${type.name})` }}
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>

          {/* Description - Top right */}
          <div className="md:col-span-6 bg-card rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-lg mb-2">Description</h3>

            <p className="text-muted-foreground leading-relaxed">{flavor}</p>
            <span
              className={`inline-block px-2 py-1 mt-2 rounded-full text-xs font-semibold mb-2 ${genClass}`}
            >
              {generationText}
            </span>
          </div>

          {/* Basic Info - Height & Weight */}
          <div className="md:col-span-3 bg-card rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-lg mb-4">Basic Info</h3>

            <div className="space-y-3">
              {/* Category */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Category</span>
                <span className="font-semibold">
                  {(
                    species?.genera?.find((g) => g.language.name === "en")
                      ?.genus || "Unknown"
                  ).replace(/ Pokémon$/i, "")}
                </span>
              </div>

              <div className="h-px bg-border/30" />

              {/* Gender */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Gender</span>
                <div className="flex gap-2">
                  {species.gender_rate === -1 ? (
                    <span className="font-semibold">Unknown</span>
                  ) : (
                    <>
                      <Mars className="h-4 w-4 text-blue-500" />
                      <Venus className="h-4 w-4 text-pink-500" />
                    </>
                  )}
                </div>
              </div>

              <div className="h-px bg-border/30" />

              {/* Height */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Height</span>
                <span className="font-semibold">{pokemon.height / 10}m</span>
              </div>

              <div className="h-px bg-border/30" />

              {/* Weight */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Weight</span>
                <span className="font-semibold">{pokemon.weight / 10}kg</span>
              </div>
            </div>
          </div>

          {/* Abilities */}
          <div className="md:col-span-3 bg-card rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-lg mb-4">Abilities</h3>
            <div className="space-y-2">
              {pokemon.abilities.map((a) => (
                <div key={a.ability.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm capitalize">{a.ability.name}</span>
                  {a.is_hidden && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      Hidden
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="md:col-span-12 bg-card rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-lg mb-4">Weaknesses</h3>

            {weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {weaknesses.map((type) => (
                  <span
                    key={type}
                    className="rounded-full px-4 py-2 text-sm font-semibold text-white capitalize"
                    style={{ backgroundColor: `var(--type-${type})` }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">None</p>
            )}
          </div>

          {/* Stats - Full width with bars */}
          <div className="md:col-span-12 bg-card rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-lg mb-4">Stats</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pokemon.stats.map((s) => (
                <div key={s.stat.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm capitalize text-muted-foreground">
                      {s.stat.name === "special-attack"
                        ? "Sp. Attack"
                        : s.stat.name === "special-defense"
                          ? "Sp. Defense"
                          : s.stat.name}
                    </span>
                    <span className="text-sm font-semibold">{s.base_stat}</span>
                  </div>

                  <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full transition-[width] duration-700 ease-out"
                      style={{
                        width: `${Math.min(
                          Math.max((s.base_stat / MAX_STAT) * 100, 8),
                          100,
                        )}%`,
                        backgroundColor: `var(--stat-${s.stat.name})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evolutions */}
          {evolutions.length > 1 && (
            <div className="md:col-span-12 bg-card rounded-2xl p-6 border border-border/50">
              <h3 className="font-semibold text-lg mb-6">Evolution Chain</h3>

              <div className="flex flex-wrap items-start gap-6">
                {evolutions.map((evo, idx) => (
                  <React.Fragment key={evo.name}>
                    {/* Pokemon card */}
                    <Link
                      to={`/pokemon/${evo.name}`}
                      className="group relative flex flex-col items-center gap-2"
                    >
                      {/* Glow */}
                      <div
                        className="absolute inset-0 rounded-2xl blur-2xl opacity-20 group-hover:opacity-35 transition-opacity"
                        style={{
                          backgroundColor: `var(--type-${pokemon.types?.[0]?.type?.name || "normal"})`,
                        }}
                      />

                      {/* Card */}
                      <div className="relative z-10 w-28 h-28 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-[1.03] transition-all">
                        {evo.image ? (
                          <img
                            src={evo.image}
                            alt={evo.name}
                            loading="lazy"
                            decoding="async"
                            className="w-20 h-20 object-contain"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No image
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <span className="text-sm font-semibold capitalize group-hover:text-primary transition-colors">
                        {evo.name}
                      </span>
                    </Link>

                    {/* Centered Arrow */}
                    {idx < evolutions.length - 1 && (
                      <div className="flex items-center h-28">
                        <span className="text-3xl text-muted-foreground/40 select-none">
                          →
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
