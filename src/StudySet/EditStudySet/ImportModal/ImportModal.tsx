import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, generateId } from 'Common';
import { TCard } from 'StudySet/studySetTypes';
import './index.css';

type Props = {
    onSaveImport: (cardsArr: Array<TCard>) => void;
    isOpen: boolean;
    onClose: () => void;
};

function ImportModal({ onSaveImport, isOpen, onClose }: Props) {
    const [imported, setImported] = useState('');
    const textareaRef = React.createRef<HTMLTextAreaElement>();
    const { t } = useTranslation();

    const handleClickImportButton = () => {
        let cards: Array<TCard> = [];

        imported.split('\n').forEach((str: string): void => {
            const [term, description] = str.split('\t');
            if (term) {
                cards = cards.concat([{ term: term, description: description || '', _id: generateId() }]);
            }
        });

        onSaveImport(cards);
        setImported('');
    };

    const handleChangeImportTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setImported(e.currentTarget.value);
    };

    const handleKeyDownImportTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== 'Tab' || !textareaRef.current) {
            return;
        }

        e.preventDefault();
        const { value, selectionStart, selectionEnd } = textareaRef.current;

        const newValue = value.substring(0, selectionStart) + '\t' + value.substring(selectionEnd);
        const newStartEnd = selectionEnd + 1 - (selectionEnd - selectionStart);

        setImported(newValue);

        textareaRef.current.value = newValue;
        textareaRef.current.selectionStart = newStartEnd;
        textareaRef.current.selectionEnd = newStartEnd;
    };

    const handleClose = () => {
        onClose();
        setImported('');
    };

    const placeholder = `${t('studySetImportWord')}1    ${t('studySetImportDefinition')}1
${t('studySetImportWord')}2    ${t('studySetImportDefinition')}2
${t('studySetImportWord')}3    ${t('studySetImportDefinition')}3`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={t('studySetImportTitle')}
            body={
                <>
                    <span className="import-note">{t('studySetImportNote')}</span>
                    <textarea
                        className="import-textarea"
                        onKeyDown={handleKeyDownImportTextarea}
                        onChange={handleChangeImportTextarea}
                        value={imported}
                        ref={textareaRef}
                        placeholder={placeholder}
                    />
                </>
            }
            btnYes={{
                title: t('studySetImportButton'),
                onClick: handleClickImportButton,
                disabled: imported.length === 0,
            }}
            btnNo={{ title: t('commonButtonCancel'), onClick: handleClose }}
        />
    );
}

export default ImportModal;
