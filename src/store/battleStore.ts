import { proxy } from 'valtio';
import { Pokemon } from '../types';
import { fetchMove, fetchRandomPokemons } from '../api/pokemonApi';
import { getRandomInt } from '../utils/random';
import { mapInfoResponseToPokemon } from '../utils/mapping';

type BattleEvent = {
    pokemonId: string;
    moveId?: string;
    id: number;
};

type Log = {
    playerMoveName: string;
    opponentMoveName: string;
    winnerId?: string;
};

export type BattleStore = {
    player: Pokemon | null;
    opponent: Pokemon | null;
    isLoading: boolean;
    events: BattleEvent[];
    logs: Log[];
};

export const store = proxy<BattleStore>({
    player: null,
    opponent: null,
    isLoading: false,
    events: [],
    get logs() {
        const result: Log[] = [];

        const player = this.player as Pokemon;
        const opponent = this.opponent as Pokemon;

        for (let i = 0; i < this.events.length; i += 2) {
            const playerMoveId = this.events[i].moveId as string;
            const opponentMoveId = this.events[i + 1].moveId as string;

            if (playerMoveId && opponentMoveId) {
                const playerMove = player.moves[playerMoveId];
                const opponentMove = opponent.moves[opponentMoveId];
                let winnerId;

                if (Number(playerMove.power) > Number(opponentMove.power)) {
                    winnerId = player.id;
                } else if (Number(playerMove.power) < Number(opponentMove.power)) {
                    winnerId = opponent.id;
                }

                result.push({
                    playerMoveName: playerMove.name,
                    opponentMoveName: opponentMove.name,
                    winnerId,
                });
            }
        }

        return result;
    },
});

export const loadPokemons = () => {
    if (store.isLoading) {
        return;
    }

    store.isLoading = true;

    fetchRandomPokemons().then((values) => {
        const [player, opponent] = values.map(mapInfoResponseToPokemon);

        store.isLoading = false;
        let idCounter = store.events.length;

        store.player = player;
        store.opponent = opponent;
        store.events = [player, opponent].map((pokemon) => {
            return { pokemonId: pokemon.id, id: ++idCounter };
        });
    });
};

export const startBattle = async () => {
    const player = store.player as Pokemon;
    const opponent = store.opponent as Pokemon;

    const playerMoves = Object.keys(player.moves);
    const opponentMoves = Object.keys(opponent.moves);

    const move1Index = getRandomInt(playerMoves.length - 1);
    const move2Index = getRandomInt(opponentMoves.length - 1);

    const move1 = playerMoves[move1Index];
    const move2 = opponentMoves[move2Index];

    const [move1Data, move2Data] = await Promise.all([move1, move2].map(fetchMove));

    player.moves[move1].power = move1Data.power || 0;
    opponent.moves[move2].power = move2Data.power || 0;

    let idCounter = store.logs.length;
    store.events.push(
        { pokemonId: player.id, moveId: move1, id: ++idCounter },
        { pokemonId: opponent.id, moveId: move2, id: ++idCounter },
    );
};

export default store;
