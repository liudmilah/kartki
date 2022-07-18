import { gql, useMutation } from '@apollo/client';

const ADD_SET = gql`
    mutation AddStudySet($newSetData: NewSetInput!) {
        addSet(newSetData: $newSetData) {
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

const useAddSet = () => useMutation(ADD_SET);

export { useAddSet, ADD_SET };
