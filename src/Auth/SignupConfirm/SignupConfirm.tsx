import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Loading, useSignupConfirm } from 'Common';
import SignupTokenInvalid from './SignupTokenInvalid';
import SignupTokenConfirmed from './SignupTokenConfirmed';
import './index.css';

function SignupConfirm() {
    const { t } = useTranslation();
    const { search } = useLocation();
    const token = new URLSearchParams(search).get('token');

    const [signupConfirm, { loading, error, data }] = useSignupConfirm();

    useEffect(() => {
        signupConfirm({ variables: { signupConfirmData: { token } } });
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="signup-confirm">
            <div className="signup-confirm__container">
                <div className="signup-confirm__content">
                    <div className="signup-confirm__title">{t('signupConfirmTitle')}</div>
                    <div className="signup-confirm__text">
                        <SignupTokenInvalid visible={!!error} />
                        <SignupTokenConfirmed visible={!!data} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupConfirm;
