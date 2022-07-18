import { gql, useLazyQuery } from '@apollo/client';

const LOGOUT = gql`
    query Logout {
        logout
    }
`;

const useLogout = () => useLazyQuery(LOGOUT);

export { useLogout, LOGOUT };
