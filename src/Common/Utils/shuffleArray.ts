function shuffleArray<T>(array: Array<T>): Array<T> {
    let currentIndex = array.length;
    let randomIndex;
    const result: Array<T> = [...array];

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
    }

    return result;
}
export { shuffleArray };
