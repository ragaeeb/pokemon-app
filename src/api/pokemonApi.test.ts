import { describe, it } from 'vitest';
import { fetchRandomPokemons } from './pokemonApi';

describe('pokemonApi', () => {
    it('should', async () => {
        const result = await fetchRandomPokemons();
        console.log('result', JSON.stringify(result, null, 2));
    });
});
