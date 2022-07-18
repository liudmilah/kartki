import { gql, useQuery } from '@apollo/client';

const GET_SETS = gql`
    query GetStudySets {
        sets {
            _id
            name
            author {
                name
                _id
            }
            created
            cardsAmount
        }
    }
`;

const useGetSets = () => useQuery(GET_SETS);

export { useGetSets, GET_SETS };
