import React from 'react';
import { render, screen } from 'setupTests';
import Logo from './Logo';

describe('Logo', () => {
    it('should render Logo with default props', () => {
        render(<Logo appTitle="APP_TITLE" imgSrc="/logo.png" />);
        expect(screen.getByRole('img')).toHaveAttribute('height', '30');
        expect(screen.getByRole('img')).toHaveAttribute('width', '30');
        expect(screen.getByRole('img')).toHaveAttribute('src', '/logo.png');
        expect(screen.getByText(/APP_TITLE/)).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', '/');
    });
});
