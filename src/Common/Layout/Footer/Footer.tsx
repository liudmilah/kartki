import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from 'Common';
import './index.css';

function Footer() {
    const { t } = useTranslation();

    const languages = [
        { label: t('languageEn'), code: 'en' },
        { label: t('languageRu'), code: 'ru' },
    ];

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__row">
                    <span className="footer__text">
                        <span className="footer__appname">&copy;{t('appName')}</span>
                        <span className="footer__year">{new Date().getFullYear()}</span>
                    </span>
                    <LanguageSwitcher languages={languages} />
                </div>
            </div>
        </footer>
    );
}

export default Footer;
