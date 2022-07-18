import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertError } from 'Common';
import '../index.css';

function FlashcardsError() {
    const { t } = useTranslation();

    return (
        <div className="flashcards">
            <div className="flashcards__error">
                <AlertError visible={true} message={[t('commonApiErrorNeedReload')]} />
            </div>
        </div>
    );
}

export default FlashcardsError;
