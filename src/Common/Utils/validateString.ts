const validateString = (str: string, min: number, max: number): boolean => {
    return str.length >= min && str.length <= max;
};

export default validateString;
