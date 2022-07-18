import React from 'react';
import { render } from 'setupTests';
import DeleteModal from './DeleteModal';

describe('DeleteModal', () => {
    it('should render DeleteModal', () => {
        const onClose = jest.fn();
        const onConfirm = jest.fn();
        render(<DeleteModal name={'Study set name'} onClose={onClose} onConfirm={onConfirm} isOpen={true} />);
    });
});
