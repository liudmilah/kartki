import { gql, useLazyQuery } from '@apollo/client';

const GET_USER = gql`
    query GetUser {
        user {
            _id
            name
        }
    }
`;

const useGetUser = () => useLazyQuery(GET_USER, { notifyOnNetworkStatusChange: true });

export { useGetUser, GET_USER };
