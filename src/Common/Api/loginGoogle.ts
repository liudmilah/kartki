import useApi from './useApi';

const useLoginGoogle = () => useApi('GET', '/auth/google');
export default useLoginGoogle;
