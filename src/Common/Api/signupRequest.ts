import { gql, useMutation } from '@apollo/client';

const SIGNUP_REQUEST = gql`
    mutation SignupRequest($signupRequestData: SignupRequestInput!) {
        signupRequest(signupRequestData: $signupRequestData)
    }
`;

const useSignupRequest = () => useMutation(SIGNUP_REQUEST);

export { useSignupRequest, SIGNUP_REQUEST };
