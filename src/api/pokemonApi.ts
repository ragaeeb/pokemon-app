import { getRandomInt } from '../utils/random';
import { MoveResponse, PagingParams, PokemonInfoResponse, PokemonListResponse } from './types';

/**
 * Internal function to fetch Pokémon list data.
 * @param limit - Number of Pokémon to fetch.
 * @param offset - Starting index for fetching.
 * @returns A promise resolving to a Pokémon list response.
 */
const fetchPokemonList = async ({ limit = 100, offset = 0 }: PagingParams): Promise<PokemonListResponse> => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon data with offset=${offset} and limit=${limit}`);
    }

    return response.json();
};

const fetchJson = async (url: string) => {
    const response = await fetch(url);
    return response.json();
};

const fetchPokemonInfo = async (url: string): Promise<PokemonInfoResponse> => {
    return fetchJson(url);
};

/**
 * Fetches the total number of Pokémon from the API.
 * @returns The total count of Pokémon in the API.
 */
const getTotalPokemonCount = async (): Promise<number> => {
    const data = await fetchPokemonList({ limit: 1 }); // Fetch only metadata
    return data.count;
};

const fetchAPokemon = async (offset: number) => {
    const [pokemon] = (await fetchPokemonList({ limit: 1, offset })).results;
    return pokemon;
};

/**
 * Fetches N random Pokémon from a batch of 100 (or less if near the end).
 * Allows injecting pre-generated random values for testability.
 * @param n - The number of Pokémon to select.
 * @param randomValues - Pre-generated random values (for testing).
 * @returns A promise resolving to an array of N Pokémon details.
 */
export const fetchRandomPokemons = async (): Promise<PokemonInfoResponse[]> => {
    /**
     * Solutions I thought of:
     * 1. grab count, then grab the entire list with the limit=count, then grab 2 from there. waste of resources, memory. even though it's gzipped, there's no upper limit.
     * 2. grab count, then grab at batches of 100. too complex for such a solution.
     * 3. grab count, then make request directly to pokemon/{id} endpoint instead of pokemon list based on the count numeric id (assumption). we make an assumption about the API inputs, which is not the best. There's ones that are 10009, so it doesn't follow the numeric id structure
     * 4. grab count, pick any random offset, with limit=2, this will give you exactly the two random ones. The problem is you won't get proper ramndomization.
     * This is the lesser of all evils.
     */
    const totalCount = await getTotalPokemonCount();
    const [offset1, offset2] = [getRandomInt(totalCount - 1), getRandomInt(totalCount - 1)];

    const [pokemon1, pokemon2] = await Promise.all([fetchAPokemon(offset1), fetchAPokemon(offset2)]); // TODO: If offset2 === offset1, we can just do 1 API call
    return Promise.all([fetchPokemonInfo(pokemon1.url), fetchPokemonInfo(pokemon2.url)]);
};

export const fetchMove = async (url: string): Promise<MoveResponse> => {
    const result = await fetchJson(url);
    return { ...result, url };
};
