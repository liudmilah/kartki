import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertError } from 'Common';
import '../index.css';

function StudySetApiError() {
    const { t } = useTranslation();

    return (
        <div className="set">
            <div className="set__error">
                <AlertError visible={true} message={[t('commonApiErrorNeedReload')]} />
            </div>
        </div>
    );
}

export default StudySetApiError;
