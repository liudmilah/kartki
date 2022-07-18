const validatePassword = (password: string, max = 64, min = 8): boolean => {
    if (password.trim().length === 0) {
        return false;
    }

    return password.length >= min && password.length <= max;
};

export default validatePassword;
