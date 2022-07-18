import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertError } from 'Common';
import '../index.css';

function LibraryError() {
    const { t } = useTranslation();

    return (
        <div className="sets">
            <AlertError visible={true} message={[t('commonApiErrorNeedReload')]} />
        </div>
    );
}

export default LibraryError;
