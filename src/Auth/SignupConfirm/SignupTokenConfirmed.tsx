import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from 'routes';
import './index.css';

function SignupTokenConfirmed({ visible }: { visible: boolean }) {
    const { t } = useTranslation();

    if (!visible) {
        return null;
    }

    return (
        <>
            {t('signupTokenConfirmed')}
            <Link to={routes.LOGIN} className="text-secondary">
                {t('signupGoToLogin')}
            </Link>
        </>
    );
}

export default SignupTokenConfirmed;
