import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { screen, render } from 'setupTests';
import { GET_USER } from '../Api';
import Layout from './Layout';

const mocks = [
    {
        request: {
            query: GET_USER,
        },
        result: {
            data: {
                user: {
                    _id: '1',
                    name: 'Neil Gaiman',
                },
            },
        },
    },
];

describe('Layout', () => {
    it('should render layout', () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Layout>Content</Layout>
            </MockedProvider>
        );
        expect(screen.getByText(/Content/)).toBeInTheDocument();
    });
});
