import useApi from './useApi';

const useLoginFacebook = () => useApi('GET', '/auth/facebook');
export default useLoginFacebook;
