import React, { ChangeEvent } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { LinkIconButton } from 'Common';
import './index.css';

type SignupFormProps = {
    email: string;
    name: string;
    password: string;
    visible: boolean;
    handleSubmit: () => void;
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    errors: { [key: string]: string };
};

function SignupForm({ email, name, password, visible, handleChange, errors, handleSubmit }: SignupFormProps) {
    const { t } = useTranslation();

    if (!visible) {
        return null;
    }

    const canSubmit = Object.values(errors).filter((e) => !!e).length === 0;

    return (
        <>
            <input
                type="text"
                name="name"
                placeholder={t('signupUsername')}
                className={cx({ input: true, signup__input: true, _error: !!errors.name })}
                value={name}
                onChange={handleChange}
                autoComplete="name"
            />
            <input
                type="text"
                name="email"
                placeholder={t('signupEnterEmail')}
                className={cx({ input: true, signup__input: true, _error: !!errors.email })}
                value={email}
                onChange={handleChange}
                autoComplete="email"
            />
            <input
                type="password"
                name="password"
                placeholder={t('signupEnterPassword')}
                className={cx({
                    input: true,
                    signup__input: true,
                    _error: !!errors.password,
                })}
                value={password}
                onChange={handleChange}
                autoComplete="current-password"
            />
            <button
                className="btn btn-secondary signup__button signup__button-submit"
                onClick={handleSubmit}
                disabled={!canSubmit}
            >
                {t('signupSubmit')}
            </button>
            <div className="signup__divider">
                <span>{t('signupOr')}</span>
            </div>
            <LinkIconButton
                imageSrc="/images/google.svg"
                text={t('signupWithGoogle')}
                classNames="btn signup__button signup__button-social"
                url="/api/auth/google"
            />
            <LinkIconButton
                imageSrc="/images/fb.svg"
                text={t('signupWithFacebook')}
                classNames="btn signup__button signup__button-social"
                url="/api/auth/facebook"
            />
        </>
    );
}

export default SignupForm;
