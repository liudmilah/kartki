import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_SET } from 'Common';
import { render } from 'setupTests';
import CreateStudySet from './CreateStudySet';

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
                    ],
                },
            },
        },
    },
];

describe('CreateStudySet', () => {
    it('should render CreateStudySet', () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <CreateStudySet />
            </MockedProvider>
        );
    });
});
