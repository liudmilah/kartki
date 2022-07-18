import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { StopIcon, RestartIcon, shuffleArray, useGetSet } from 'Common';
import routes from 'routes';
import { TStudySet, TCard } from 'StudySet/studySetTypes';
import { FlashcardsError } from './FlashcardsError';
import { CompleteStudying } from './CompleteStudying';
import { ContinueStudying } from './ContinueStudying';
import { SetNotFound } from './SetNotFound';
import { FlashcardsLoading } from './FlashcardsLoading';
import './index.css';

const delay = (fn: () => void) => {
    setTimeout(fn, 200);
};

function Flashcards(): JSX.Element | null {
    const { id } = useParams();
    const { data, loading, error } = useGetSet(id);
    const studySet: TStudySet | null = data ? data.set : null;

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [passedAmount, setPassedAmount] = useState(0);
    const [skippedCards, setSkippedCards] = useState<Array<TCard>>([]);
    const [flipped, setFlipped] = useState(false);
    const [cards, setCards] = useState<Array<TCard>>([]);

    useEffect(() => {
        setCards(shuffleArray(studySet ? studySet.cards : []));
    }, [studySet]);

    const flipCard = () => {
        setFlipped((flipped) => !flipped);
    };

    const stop = () => {
        if (studySet) {
            navigate(routes.SET.replace(':id', studySet._id));
        }
    };

    const resetState = () => {
        setPassedAmount(0);
        setSkippedCards([]);
        setCards(shuffleArray(studySet ? studySet.cards : []));
    };

    const skipCard = () => {
        setSkippedCards(skippedCards.concat([cards[passedAmount]]));
        setPassedAmount(passedAmount + 1);
    };

    const restart = () => {
        setFlipped(false);
        delay(resetState);
    };

    const dontRemember = () => {
        setFlipped(false);
        delay(skipCard);
    };

    const remember = () => {
        setFlipped(false);
        delay(() => setPassedAmount(passedAmount + 1));
    };

    const continueStudying = () => {
        setFlipped(false);
        setCards(skippedCards);
        setSkippedCards([]);
        setPassedAmount(0);
    };

    if (error) {
        return <FlashcardsError />;
    }
    if (loading) {
        return <FlashcardsLoading />;
    }
    if (!studySet || !cards.length) {
        return <SetNotFound />;
    }
    if (passedAmount === cards.length && skippedCards.length === 0) {
        return <CompleteStudying onClickComplete={stop} onClickRestart={restart} />;
    }
    if (passedAmount === cards.length && skippedCards.length > 0) {
        return (
            <ContinueStudying
                studied={passedAmount - skippedCards.length}
                all={cards.length}
                onClickContinueStudying={continueStudying}
                onClickComplete={stop}
                onClickRestart={restart}
            />
        );
    }

    return (
        <div className="flashcards">
            <div className="flashcards__content">
                <div className="flashcards__header">
                    <div className="flashcards__progress">{`${passedAmount} / ${cards.length}`}</div>
                    <div className="flashcards__progressbar">
                        <progress value={100 * (passedAmount / cards.length)} max="100" />
                    </div>
                    <div className="flashcards__actions">
                        <button className="btn btn-transparent flashcards__action-btn" onClick={stop}>
                            <StopIcon />
                        </button>
                        <button className="btn btn-transparent flashcards__action-btn" onClick={restart}>
                            <RestartIcon />
                        </button>
                    </div>
                </div>

                <div className="flashcards__flip-card">
                    <div className={cx('flashcards__flip-card-inner', { flipped })}>
                        <div className="flashcards__flip-card-front" onClick={flipCard}>
                            {cards[passedAmount].description}
                        </div>
                        <div className="flashcards__flip-card-back" onClick={flipCard}>
                            {cards[passedAmount].term}
                        </div>
                    </div>
                </div>

                <div className="flashcards__footer">
                    <button className="btn btn-transparent flashcards__remember-btn" onClick={dontRemember}>
                        <span className="flashcards__dont-remember-text">&#10008;</span>
                        {t('cardsBtnDontRemember')}
                        <span className="flashcards__remember-amount">{skippedCards.length}</span>
                    </button>
                    <button className="btn btn-transparent flashcards__remember-btn" onClick={remember}>
                        <span className="flashcards__remember-text">&#10004;</span>
                        {t('cardsBtnRemember')}
                        <span className="flashcards__remember-amount">{passedAmount - skippedCards.length}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Flashcards;
