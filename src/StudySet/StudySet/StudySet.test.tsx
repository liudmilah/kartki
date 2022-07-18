import React from 'react';
import { createMemoryHistory } from 'history';
import { MockedProvider } from '@apollo/client/testing';
import routes from 'routes';
import { GET_SET } from 'Common';
import { render } from 'setupTests';
import StudySet from './StudySet';

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
                    id: '1',
                    name: 'Colors',
                    created: '2021-10-14',
                    author: { name: 'Author One', _id: '111' },
                    cards: [
                        {
                            id: '1',
                            term: 'red',
                            description: 'красный',
                        },
                        {
                            id: '2',
                            term: 'rose',
                            description: 'розовый',
                        },
                        {
                            id: '3',
                            term: 'white',
                            description: 'белый',
                        },
                    ],
                },
            },
        },
    },
];

describe('StudySet', () => {
    it('should render StudySet', () => {
        const history = createMemoryHistory();
        history.push({ hash: '', pathname: routes.SET.replace(':id', '1'), search: '' });
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <StudySet />
            </MockedProvider>,
            { history }
        );
    });
});
