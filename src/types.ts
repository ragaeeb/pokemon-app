type Avatar = {
    front?: string;
    back?: string;
};

type Move = { name: string; power: number | null };

export type Pokemon = {
    id: string;
    name: string;
    avatar: Avatar;
    moves: Record<string, Move>;
};
