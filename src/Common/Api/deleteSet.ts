import { gql, useMutation } from '@apollo/client';

const DELETE_SET = gql`
    mutation DeleteStudySet($id: ID!) {
        deleteSet(id: $id) {
            _id
        }
    }
`;

const useDeleteSet = () => useMutation(DELETE_SET);

export { useDeleteSet, DELETE_SET };
