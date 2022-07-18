import React from 'react';
import { createMemoryHistory } from 'history';
import { MockedProvider } from '@apollo/client/testing';
import routes from 'routes';
import { GET_SET } from 'Common';
import { render } from 'setupTests';
import Flashcards from './Flashcards';

const mocks = [
    {
        request: {
            query: GET_SET,
            variables: {
                id: '1',
            },
        },
        result: {
            data: {
                set: {
                    _id: '1',
                    name: 'Colors',
                    created: '2020-10-14',
                    author: { name: 'Author One', _id: '111' },
                    cards: [
                        {
                            id: '1',
                            term: 'green',
                            description: 'зеленый',
                        },
                        {
                            id: '2',
                            term: 'yellow',
                            description: 'желтый',
                        },
                        {
                            id: '3',
                            term: 'rose',
                            description: 'розовый',
                        },
                    ],
                },
            },
        },
    },
];

describe('Flashcards', () => {
    it('should render Flashcards', () => {
        const history = createMemoryHistory();
        history.push({ hash: '', pathname: routes.SET.replace(':id', '1'), search: '' });

        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Flashcards />
            </MockedProvider>,
            { history }
        );
    });
});
