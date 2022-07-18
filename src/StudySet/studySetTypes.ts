type TCard = {
    _id: string;
    term: string;
    description: string;
};
type TStudySet = {
    _id: string;
    name: string;
    created: string;
    author: { name: string; _id: string };
    cards: Array<TCard>;
    description: string;
    cardsAmount: number;
};

export type { TStudySet, TCard };
