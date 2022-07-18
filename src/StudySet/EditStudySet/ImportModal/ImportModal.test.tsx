import React from 'react';
import { render } from 'setupTests';
import ImportModal from './ImportModal';

describe('ImportModal', () => {
    it('should render ImportModal', () => {
        const onSave = jest.fn();
        render(<ImportModal onSaveImport={onSave} onClose={() => undefined} isOpen={true} />);
    });
});
