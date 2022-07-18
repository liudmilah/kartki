import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertError, Loading, useLogin, validateEmail } from 'Common';
import EmailSentNotification from './EmailSentNotification';
import ResetPasswordForm from './ResetPasswordForm';
import './index.css';

function ResetPassword() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [login, { data, loading, error: apiError }] = useLogin(); // todo other request

    useEffect(() => {
        if (apiError) {
            setError(t('commonGeneralApiError'));
        }
    }, [apiError]);

    const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) {
            setError('');
        }
        setEmail(e.target.value);
    };

    const handleSubmit = () => {
        if (!validateEmail(email)) {
            setError(t('resetPasswordInvalidEmail'));
            return;
        }

        if (error) {
            setError('');
        }

        login({
            variables: {
                loginData: { email, password: 'todo' },
            },
        });
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="reset-password">
            <div className="reset-password__container">
                <div className="reset-password__content">
                    <div className="reset-password__title">{t('resetPasswordTitle')}</div>

                    <AlertError visible={!data && !!error} message={[error]} />

                    <EmailSentNotification visible={!!data} email={email} />

                    <ResetPasswordForm
                        visible={!data}
                        email={email}
                        handleChangeEmail={handleChangeEmail}
                        handleSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
