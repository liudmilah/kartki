import React from 'react';
import { render } from 'setupTests';
import { TCard } from 'StudySet/studySetTypes';
import ExportModal from './ExportModal';

const cards: Array<TCard> = [
    {
        _id: '1',
        term: 'red',
        description: 'красный',
    },
    {
        _id: '2',
        term: 'blue',
        description: 'синий',
    },
];

describe('ExportModal', () => {
    it('should render ExportModal', () => {
        render(<ExportModal cards={cards} onClose={() => undefined} isOpen={true} />);
    });
});
