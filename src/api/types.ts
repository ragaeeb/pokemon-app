export type PokemonListResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
        name: string;
        url: string;
    }[];
};

export type PagingParams = {
    limit?: number;
    offset?: number;
};

export type MoveResponse = {
    power: number;
    id: number;
    name: string;
    url: string;
};

export type Sprites = {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
};

export type PokemonInfoResponse = {
    sprites: Sprites;
    id: number;
    name: string;
    moves: {
        move: {
            name: string;
            url: string;
        };
    }[];
};
