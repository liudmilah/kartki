import React from 'react';
import { useTranslation } from 'react-i18next';
import '../index.css';

type Props = {
    onClickComplete: () => void;
    onClickRestart: () => void;
};
function CompleteStudying({ onClickComplete, onClickRestart }: Props) {
    const { t } = useTranslation();

    return (
        <div className="flashcards">
            <div className="flashcards__result">
                <img className="flashcards__result-cone" alt="complete studying" src="/images/cone.png" />
                <span className="flashcards__result-text">{t('cardsStudied')}</span>
                <div className="flashcards__result-btns">
                    <button className="btn flashcards__result-btn" onClick={onClickComplete}>
                        {t('cardsBtnStop')}
                    </button>
                    <button className="btn flashcards__result-btn" onClick={onClickRestart}>
                        {t('cardsBtnRestart')}
                    </button>
                </div>
            </div>
        </div>
    );
}
export default CompleteStudying;
