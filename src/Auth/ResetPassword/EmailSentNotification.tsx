import React from 'react';
import { useTranslation } from 'react-i18next';
import './index.css';

type EmailSentNotificationProps = {
    email: string;
    visible: boolean;
};

function EmailSentNotification({ email, visible }: EmailSentNotificationProps) {
    const { t } = useTranslation();

    if (!visible) {
        return null;
    }

    return <div className="reset-password__text">{t('resetPasswordSentEmail', { email })}</div>;
}

export default EmailSentNotification;
