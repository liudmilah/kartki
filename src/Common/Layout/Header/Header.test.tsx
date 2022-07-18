import React from 'react';
import { screen, render } from 'setupTests';
import Header from './Header';

const items = [
    {
        label: 'item1',
        url: '/',
        isActive: false,
    },
    {
        label: 'item2',
        url: '/',
        isActive: false,
    },
];

describe('Header', () => {
    it('should render Header', () => {
        render(<Header menuItems={items} />);
        expect(screen.getAllByText(/item/)).toHaveLength(2);
    });
});
