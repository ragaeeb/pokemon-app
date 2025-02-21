import React, { useEffect, useMemo } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { useSnapshot } from 'valtio';
import { store, loadPokemons, startBattle } from '../store/battleStore';

const Chat: React.FC = () => {
    const result = useSnapshot(store);
    const { player, opponent, events, logs } = result;

    useEffect(() => {
        loadPokemons();
    }, []);

    const formattedLogs = useMemo(() => {
        return logs.map(({ playerMoveName, opponentMoveName, winnerId }) => {
            if (!winnerId) {
                return `${player?.name}'s ${playerMoveName} results in a draw with ${opponent?.name}'s ${opponentMoveName}`;
            }

            if (player?.id === winnerId) {
                return `${player?.name} lands a decisive blow with ${playerMoveName}, knocking out ${opponent?.name}`;
            }

            return `${opponent?.name} lands a decisive blow with ${opponentMoveName}, knocking out ${player?.name}`;
        });
    }, [logs, player, opponent]);

    return (
        <div className="w-full px-10 py-10">
            {events.slice(-2).map((event) => {
                const isFirstPlayer = event.pokemonId === player?.id;
                const pokemon = isFirstPlayer ? player : opponent;
                const moveInfo = event.moveId && pokemon?.moves[event.moveId];

                return (
                    <MessageBubble
                        key={event.id}
                        avatar={isFirstPlayer ? pokemon?.avatar.front : pokemon?.avatar.back || pokemon?.avatar.front}
                        message={pokemon?.name as string}
                        avatarOnRight={isFirstPlayer}
                        badgeText={moveInfo && `${moveInfo.name}: ${moveInfo.power}`}
                    />
                );
            })}

            <div className="mt-10">
                <ChatInput onStartBattleClicked={startBattle} logs={formattedLogs} />
            </div>
        </div>
    );
};

export default Chat;
