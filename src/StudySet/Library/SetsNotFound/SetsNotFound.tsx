import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from 'routes';
import '../index.css';

function SetsNotFound() {
    const { t } = useTranslation();
    return (
        <div className="sets__not-found-wrap">
            <span className="sets__not-found-text">{t('setsNotFound')}</span>
            <Link to={routes.CREATE} className="btn btn-secondary sets__not-found-btn">
                {t('setsCreate')}
            </Link>
        </div>
    );
}

export default SetsNotFound;
