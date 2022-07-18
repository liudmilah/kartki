import React from 'react';
import '../index.css';

type Props = {
    number: number;
    term: string;
    description: string;
};

function Card({ number, term, description }: Props) {
    return (
        <div className="set__card">
            <div className="set__card-number">
                <span>{number}</span>
            </div>

            <div className="set__card-term">
                <span>{term}</span>
            </div>
            <div className="set__card-description">{description}</div>
        </div>
    );
}

export default Card;
