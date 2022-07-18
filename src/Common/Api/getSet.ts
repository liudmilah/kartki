import { gql, useQuery } from '@apollo/client';

const GET_SET = gql`
    query GetSet($id: ID!) {
        set(id: $id) {
            _id
            name
            author {
                name
                _id
            }
            created
            description
            cards {
                _id
                term
                description
            }
        }
    }
`;

const useGetSet = (id?: string) =>
    useQuery(GET_SET, {
        variables: { id },
    });

export { useGetSet, GET_SET };
