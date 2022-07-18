import { useState, useEffect } from 'react';
import { useAuth } from 'Auth';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function isJsonResponse(response: Response) {
    const type = response.headers.get('content-type');
    return type && type.includes('application/json');
}

function request(token: string, method: HttpMethod, url: string, data?: object) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json;charset=utf-8' };

    if (token) {
        headers.authorization = `Bearer ${token}`;
    }

    return fetch(`/api` + url, {
        method,
        body: data !== null ? JSON.stringify(data) : undefined,
        headers,
    })
        .then((response: Response) => {
            if (response.ok) {
                return response;
            }
            throw response;
        })
        .then((response: Response) => {
            return isJsonResponse(response) ? response.json() : response.text();
        });
}

const useApi = (method: HttpMethod, url: string, initPayload?: object, sendOnInit?: boolean) => {
    const [data, setData] = useState(initPayload);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<object | null>(null);
    const { token } = useAuth();

    const sendRequest = async (payload?: object) => {
        setLoading(true);
        setError(null);

        try {
            const result = await request(token || '', method, url, payload);
            setData(result);
        } catch (error) {
            setError(error as object);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sendOnInit) {
            sendRequest(initPayload);
        }
    }, []);

    return { data, loading, error, sendRequest };
};

export default useApi;
