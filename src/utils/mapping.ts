import { PokemonInfoResponse } from '../api/types';
import { Pokemon } from '../types';

export const mapInfoResponseToPokemon = ({ id, name, moves, sprites }: PokemonInfoResponse): Pokemon => {
    return {
        id: id.toString(),
        avatar: {
            front:
                sprites.front_default ||
                sprites.front_female ||
                sprites.front_shiny ||
                sprites.front_shiny_female ||
                undefined,
            back:
                sprites.back_default ||
                sprites.back_female ||
                sprites.back_shiny ||
                sprites.back_shiny_female ||
                undefined,
        },
        name,
        moves: moves.reduce((acc, { move }) => ({ ...acc, [move.url]: { name: move.name, power: null } }), {}),
    };
};
