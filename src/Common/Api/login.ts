import { gql, useMutation } from '@apollo/client';

const LOGIN_REQUEST = gql`
    mutation Login($loginData: LoginInput!) {
        login(loginData: $loginData) {
            accessToken
            refreshToken
        }
    }
`;

const useLogin = () => useMutation(LOGIN_REQUEST);

export { useLogin, LOGIN_REQUEST };
