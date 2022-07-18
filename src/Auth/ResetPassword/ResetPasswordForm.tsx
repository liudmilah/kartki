import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import './index.css';

type ResetPasswordFormProps = {
    email: string;
    visible: boolean;
    handleSubmit: () => void;
    handleChangeEmail: (event: ChangeEvent<HTMLInputElement>) => void;
};

function ResetPasswordForm({ email, handleChangeEmail, visible, handleSubmit }: ResetPasswordFormProps) {
    const { t } = useTranslation();

    if (!visible) {
        return null;
    }

    return (
        <>
            <div className="reset-password__text">{t('resetPasswordInstruction')}</div>

            <input
                type="text"
                placeholder={t('resetPasswordEnterEmail')}
                className="input reset-password__input"
                value={email}
                onChange={handleChangeEmail}
            />

            <button className="btn btn-secondary reset-password__button" onClick={handleSubmit}>
                {t('resetPasswordSubmit')}
            </button>
        </>
    );
}

export default ResetPasswordForm;
