import React from 'react';
import { useTranslation } from 'react-i18next';
import '../index.css';

type Props = {
    studied: number;
    all: number;
    onClickContinueStudying: () => void;
    onClickComplete: () => void;
    onClickRestart: () => void;
};

function ContinueStudying({ studied, all, onClickContinueStudying, onClickComplete, onClickRestart }: Props) {
    const { t } = useTranslation();

    return (
        <div className="flashcards">
            <div className="flashcards__result">
                <img className="flashcards__result-thumb" alt="continue studying" src="/images/thumb.jpg" />
                <span className="flashcards__result-text">{t('cardsSkipped', { studied, all })}</span>
                <div className="flashcards__result-btns">
                    <button className="btn flashcards__result-btn" onClick={onClickContinueStudying}>
                        {t('cardsBtnContinueStudying')}
                    </button>
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

export default ContinueStudying;
