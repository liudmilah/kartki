import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertError } from 'Common';
import '../index.css';

function SetNotFound() {
    const { t } = useTranslation();

    return (
        <div className="flashcards">
            <div className="flashcards__error">
                <AlertError visible={true} message={[t('cardsNotFound')]} />
            </div>
        </div>
    );
}

export default SetNotFound;
