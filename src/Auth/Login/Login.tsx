import React, { ChangeEvent, useEffect, useState } from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from 'routes';
import { AlertError, LinkIconButton, Loading, useLogin, validateEmail, validatePassword } from 'Common';
import { useAuth } from 'Auth';
import './index.css';

type FormData = {
    email: string;
    password: string;
};
type Errors = {
    [key: string]: string;
};
const initFormData: FormData = {
    email: '',
    password: '',
};
const initErrors: Errors = {
    email: '',
    password: '',
};

function Login() {
    const { t } = useTranslation();
    const { login } = useAuth();
    const [apiLogin, { data, loading, error: apiError }] = useLogin();
    const [error, setError] = useState('');
    const [errors, setErrors] = useState(initErrors);
    const [formData, setFormData] = useState(initFormData);

    useEffect(() => {
        if (apiError) {
            if (apiError.message === 'Unauthorized') {
                setError(t('loginInvalidEmailOrPassword'));
            } else {
                setError(t('commonGeneralApiError'));
            }
        }
    }, [apiError]);

    useEffect(() => {
        if (data && data.login.accessToken) {
            login(data.login.accessToken);
        }
    }, [data]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target;

        if (errors[input.name]) {
            setErrors({ ...errors, [input.name]: '' });
        }

        setFormData({ ...formData, [input.name]: input.value });
    };

    const handleSubmit = () => {
        const email = formData.email.trim();
        const password = formData.password;
        const newErrors = { ...errors };

        if (!validateEmail(formData.email)) {
            newErrors.email = t('loginInvalidEmail');
        }

        if (!validatePassword(formData.password)) {
            newErrors.password = t('loginInvalidPassword');
        }

        const hasErrors = Object.values(newErrors).filter((e) => !!e).length > 0;
        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        setError('');
        setErrors(initErrors);

        apiLogin({
            variables: {
                loginData: { email, password },
            },
        });
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="login">
            <div className="login__container">
                <div className="login__content">
                    <div className="login__title">{t('loginTitle')}</div>
                    <AlertError visible={!!error} message={[error]} />
                    <input
                        type="text"
                        name="email"
                        placeholder={t('loginEnterEmail')}
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        className={cx({ input: true, login__input: true, _error: !!errors.email })}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder={t('loginEnterPassword')}
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        className={cx({
                            input: true,
                            login__input: true,
                            _error: !!errors.password,
                        })}
                    />
                    <button className="btn btn-secondary login__button login__button-submit" onClick={handleSubmit}>
                        {t('loginSubmit')}
                    </button>
                    <Link to={routes.PASSWORD_RESET} className="text-secondary login__reset-password-link">
                        {t('loginForgotPassword')}
                    </Link>
                    <div className="login__divider">
                        <span>{t('loginOr')}</span>
                    </div>
                    <LinkIconButton
                        imageSrc="/images/google.svg"
                        text={t('loginWithGoogle')}
                        classNames="btn login__button login__button-social"
                        url="/api/auth/google"
                    />
                    <LinkIconButton
                        imageSrc="/images/fb.svg"
                        text={t('loginWithFacebook')}
                        classNames="btn login__button login__button-social"
                        url="/api/auth/facebook"
                    />
                </div>
            </div>
        </div>
    );
}

export default Login;
