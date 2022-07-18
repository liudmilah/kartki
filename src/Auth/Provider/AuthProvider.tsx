import React, { ReactNode, useState } from 'react';
import { useGetUser } from 'Common';
import { AuthContext, ContextValue, AuthUser } from './AuthContext';
import authToken from './authToken';

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [getUser, { data, error }] = useGetUser();
    const [currentUser, setCurrentUser] = useState<AuthUser>(null);
    const [token, setToken] = useState(authToken.getToken());
    const [loading, setLoading] = useState(true);

    const isLoggedIn = () => !!token;

    const logout = () => {
        if (isLoggedIn()) {
            setCurrentUser(null);
            authToken.deleteToken();
            setToken('');
            window.location.href = '/';
        }
    };

    const login = (accessToken: string) => {
        authToken.setToken(accessToken);
        setToken(accessToken);
        getUser();
    };

    React.useEffect(() => {
        getUser();
    }, []);

    React.useEffect(() => {
        if (data) {
            setLoading(false);
            setCurrentUser(data.user);
        }
    }, [data]);

    React.useEffect(() => {
        const listener = (e: StorageEvent) => {
            if (e.key === 'authToken') {
                setToken(e.newValue || '');
            }
        };
        window.addEventListener('storage', listener);
        return () => window.removeEventListener('storage', listener);
    }, []);

    React.useEffect(() => {
        if (error) {
            setLoading(false);
            logout();
        }
    }, [error]);

    const contextValue: ContextValue = {
        logout,
        login,
        user: currentUser,
        loggedIn: isLoggedIn(),
        loading,
        token,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
