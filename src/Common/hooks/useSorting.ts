import { useEffect, useState } from 'react';

export type TDirection = 'desc' | 'asc';
type TUseSortingResult<T> = {
    sortedData: Array<T>;
    handleSort: (newOrderBy: keyof T, newDirection?: TDirection) => void;
    direction: TDirection;
    orderBy: keyof T;
};

function getComparator<T>(orderBy: keyof T, direction: TDirection) {
    const compare = (a: T, b: T, orderBy: keyof T) => (a[orderBy] > b[orderBy] && 1) || -1;
    return direction === 'desc' ? (a: T, b: T) => -compare(a, b, orderBy) : (a: T, b: T) => compare(a, b, orderBy);
}

function sort<T>(data: Array<T>, orderBy: keyof T, direction: TDirection) {
    return data.slice().sort(getComparator(orderBy, direction));
}

function useSorting<T>(data: Array<T>, defaultOrderBy: keyof T, defaultDirection: TDirection): TUseSortingResult<T> {
    const [sortedData, setSortedData] = useState<Array<T>>(sort(data, defaultOrderBy, defaultDirection));
    const [direction, setDirection] = useState<TDirection>(defaultDirection);
    const [orderBy, setOrderBy] = useState<keyof T>(defaultOrderBy);

    useEffect(() => {
        setSortedData(sort(data, orderBy, direction));
    }, [data]);

    const handleSort = (newOrderBy: keyof T, newDirection?: TDirection) => {
        const isAsc = orderBy === newOrderBy && direction === 'asc';
        const newDir = newDirection || (isAsc ? 'desc' : 'asc');
        setDirection(newDir);
        setOrderBy(newOrderBy);
        setSortedData(sort(sortedData, newOrderBy, newDir));
    };

    return {
        sortedData,
        handleSort,
        direction,
        orderBy,
    };
}

export default useSorting;
