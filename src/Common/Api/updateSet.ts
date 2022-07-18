import { gql, useMutation } from '@apollo/client';

const UPDATE_SET = gql`
    mutation UpdateStudySet($updateSetData: UpdateSetInput!) {
        updateSet(updateSetData: $updateSetData) {
            _id
            name
            description
            author {
                name
                _id
            }
            cards {
                _id
                term
                description
            }
        }
    }
`;

const useUpdateSet = () => useMutation(UPDATE_SET);

export { useUpdateSet, UPDATE_SET };
