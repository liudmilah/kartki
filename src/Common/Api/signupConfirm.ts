import { gql, useMutation } from '@apollo/client';

const SIGNUP_CONFIRM = gql`
    mutation SignupConfirm($signupConfirmData: SignupConfirmInput!) {
        signupConfirm(signupConfirmData: $signupConfirmData)
    }
`;

const useSignupConfirm = () => useMutation(SIGNUP_CONFIRM);

export { useSignupConfirm, SIGNUP_CONFIRM };
