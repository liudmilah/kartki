import React from 'react';
import { createMemoryHistory } from 'history';
import { MockedProvider } from '@apollo/client/testing';
import { GET_SET } from 'Common';
import routes from 'routes';
import { render } from 'setupTests';
import EditStudySet from './EditStudySet';

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
                    name: 'Study set name 1',
                    created: '2021-10-14',
                    author: { name: 'Author One', _id: '111' },
                    cards: [
                        {
                            id: '1',
                            term: 'test term 1',
                            description: 'test description 1',
                        },
                        {
                            id: '2',
                            term: 'test term 2',
                            description: 'test description 2',
                        },
                        {
                            id: '3',
                            term: 'test term 3',
                            description: 'test description 3',
                        },
                    ],
                },
            },
        },
    },
];

describe('EditStudySet', () => {
    it('should render EditStudySet', () => {
        const history = createMemoryHistory();
        history.push({ hash: '', pathname: routes.SET.replace(':id', '1'), search: '' });

        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <EditStudySet />
            </MockedProvider>,
            { history }
        );
    });
});
