const key = 'authToken';

export default {
    getToken: () => window.sessionStorage.getItem(key) as string,
    setToken: (token: string) => window.sessionStorage.setItem(key, token),
    deleteToken: () => window.sessionStorage.removeItem(key),
};
