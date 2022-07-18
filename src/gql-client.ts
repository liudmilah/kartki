import { ApolloClient, from } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from '@apollo/client/link/error';
import { authToken } from 'Auth';
import { cache } from './gql-cache';

const httpLink = createHttpLink({
    uri: `/api/graphql`,
});

const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
        for (const err of graphQLErrors) {
            if (err.extensions.code === 'UNAUTHENTICATED' && authToken.getToken()) {
                authToken.deleteToken();
                window.location.href = '/';
            }
        }
    }
});

const authLink = setContext((_: any, { headers }: { headers: Record<string, string> }) => {
    const token = authToken.getToken();
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const client = new ApolloClient({
    cache,
    link: from([errorLink, authLink as any, httpLink]),
});

export default client;
