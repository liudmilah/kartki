import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from 'routes';
import './index.css';

function SignupTokenInvalid({ visible }: { visible: boolean }) {
    const { t } = useTranslation();

    if (!visible) {
        return null;
    }

    return (
        <>
            {t('signupInvalidToken')}
            <Link to={routes.SIGNUP_REQUEST}>{t('signupGoToSignup')}</Link>
        </>
    );
}

export default SignupTokenInvalid;
