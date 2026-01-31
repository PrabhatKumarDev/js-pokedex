const BASE="https://pokeapi.co/api/v2"

export async function getPokemonList(limit=20,offset=0){
    const res=await fetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);
    if(!res.ok){
        throw new Error('Failed to fetch pokemon list');
    }
    return res.json();
}

export async function getPokemonDetails(nameOrId){
    const res=await fetch(`${BASE}/pokemon/${nameOrId}`);
    if(!res.ok){
        throw new Error('Pokemon not found');
    }
    return res.json();
}

export async function getPokemonSpecies(nameOrId){
    const res=await fetch(`${BASE}/pokemon-species/${nameOrId}`);
    if(!res.ok){
        throw new Error('Pokemon species not found');
    }
    return res.json();
}

export async function getEvolutionChain(chainUrl){
    const res=await fetch(chainUrl);
    if(!res.ok){
        throw new Error('Failed to fetch evolution chain');
    }
    return res.json();
}