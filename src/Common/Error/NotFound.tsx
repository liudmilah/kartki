import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import './index.css';

function NotFound() {
    const { t } = useTranslation();
    return (
        <div className="not-found">
            <div className="not-found__container">
                <div className="not-found__content">
                    <div className="not-found__text">{t('notFoundError')}</div>
                    <Link to="/" className="not-found__link">
                        {t('notFoundReturnToMain')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
