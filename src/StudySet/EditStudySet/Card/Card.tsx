import React, { ChangeEvent } from 'react';
import cx from 'classnames';
import { DeleteIcon } from 'Common';
import './index.css';
import { TCard } from '../../studySetTypes';

type Props = {
    card: TCard;
    number: number;
    amount: number;
    errors: Record<string, boolean>;
    onChangeCard: (field: string, value: string) => void;
    onDeleteCard: () => void;
};

function Card({ card, number, amount, errors, onChangeCard, onDeleteCard }: Props) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChangeCard(e.currentTarget.name, e.currentTarget.value);
    };

    return (
        <div className="card">
            <div className="card__number">
                <span>{number}</span>
            </div>

            <div className="card__term">
                <input
                    type="text"
                    name="term"
                    value={card.term}
                    onChange={handleChange}
                    className={cx('input card__input', { _error: errors[card._id] })}
                />
            </div>

            <div className="card__description">
                <input
                    type="text"
                    name="description"
                    value={card.description}
                    onChange={handleChange}
                    className={cx('input card__input', { _error: errors[card._id] })}
                />
            </div>

            <div className="card__btn-delete">
                <div className="card__number_mobile">
                    <span>{`${number}/${amount}`}</span>
                </div>
                <button onClick={onDeleteCard} className="btn">
                    <DeleteIcon />
                </button>
            </div>
        </div>
    );
}

export default Card;
