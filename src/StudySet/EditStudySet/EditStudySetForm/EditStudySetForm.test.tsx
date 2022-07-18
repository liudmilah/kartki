import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_SET } from 'Common';
import { render } from 'setupTests';
import EditStudySetForm from './EditStudySetForm';

const mocks = [
    {
        request: {
            query: GET_SET,
            variables: {
                id: '12345',
            },
        },
        result: {
            data: {
                set: {
                    id: '12345',
                    name: '',
                    created: '2022-01-01',
                    author: { name: 'Author One', _id: '111' },
                    cards: [],
                },
            },
        },
    },
];

describe('EditStudySetForm', () => {
    it('should render EditStudySetForm', () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <EditStudySetForm />
            </MockedProvider>
        );
    });
});
