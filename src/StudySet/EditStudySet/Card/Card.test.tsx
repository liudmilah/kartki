import React from 'react';
import { render } from 'setupTests';
import Card from './Card';

const cardValid = {
    _id: '1',
    term: 'green',
    description: 'зелёный',
};

describe('Card', () => {
    it('should render Card', () => {
        const onDelete = jest.fn();
        const onChange = jest.fn();
        render(
            <Card number={1} amount={1} errors={{}} card={cardValid} onDeleteCard={onDelete} onChangeCard={onChange} />
        );
    });
});
