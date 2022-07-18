import * as React from 'react';

export type User = {
    name: string;
    _id: string;
};

export type AuthUser = User | null;

export type ContextValue = {
    user: AuthUser;
    loggedIn: boolean;
    loading: boolean;
    token?: string;
    logout: () => void;
    login: (accessToken: string) => void;
};

const contextValue = {
    user: null,
    logout: () => null,
    login: () => null,
    loggedIn: false,
    token: undefined,
    loading: true,
};

const AuthContext = React.createContext<ContextValue>(contextValue);

export { AuthContext };
