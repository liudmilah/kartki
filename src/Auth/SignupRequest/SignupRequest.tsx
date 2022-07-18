import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertError, useSignupRequest, Loading, validateEmail, validatePassword, validateString } from 'Common';
import './index.css';
import EmailSentNotification from './EmailSentNotification';
import SignupForm from './SignupForm';

const USERNAME_MAX = 100;
const USERNAME_MIN = 2;

type FormData = {
    email: string;
    name: string;
    password: string;
};
type Errors = {
    [key: string]: string;
};
const initFormData: FormData = {
    email: '',
    name: '',
    password: '',
};
const initErrors: Errors = {
    email: '',
    name: '',
    password: '',
};

function SignupRequest() {
    const { t } = useTranslation();
    const [error, setError] = useState('');
    const [errors, setErrors] = useState(initErrors);
    const [formData, setFormData] = useState(initFormData);

    const [signup, { data, loading, error: apiError }] = useSignupRequest();

    useEffect(() => {
        if (apiError) {
            setError(t('commonGeneralApiError'));
        }
    }, [apiError]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target;

        if (errors[input.name]) {
            setErrors({ ...errors, [input.name]: '' });
        }

        setFormData({ ...formData, [input.name]: input.value });
    };

    const handleSubmit = () => {
        const email = formData.email.trim();
        const name = formData.name.trim();
        const password = formData.password;
        const newErrors = { ...errors };

        if (!validateEmail(email)) {
            newErrors.email = t('signupInvalidEmail');
        }

        if (!validatePassword(password)) {
            newErrors.password = t('signupInvalidPassword');
        }

        if (!validateString(name, USERNAME_MIN, USERNAME_MAX)) {
            newErrors.name = t('signupInvalidUsername');
        }

        const hasErrors = Object.values(newErrors).filter((e) => !!e).length > 0;
        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        setError('');
        setErrors(initErrors);

        signup({
            variables: { signupRequestData: { name, email, password } },
        });
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="signup">
            <div className="signup__container">
                <div className="signup__content">
                    <div className="signup__title">{t('signupTitle')}</div>

                    <EmailSentNotification email={formData.email} visible={!!data} />

                    <AlertError visible={!data && !!error} message={[error]} />

                    <SignupForm
                        visible={!data}
                        email={formData.email}
                        password={formData.password}
                        name={formData.name}
                        errors={errors}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}

export default SignupRequest;
