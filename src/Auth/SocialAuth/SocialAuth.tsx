import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loading } from 'Common';
import { useAuth } from 'Auth';

function SocialAuth() {
    const { search } = useLocation();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        login(new URLSearchParams(search).get('code') || '');
        navigate('/');
    }, []);

    return <Loading />;
}

export default SocialAuth;
