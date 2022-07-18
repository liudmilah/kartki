import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Modal, copyToClipboard } from 'Common';
import { TCard } from 'StudySet/studySetTypes';
import './index.css';

type Props = {
    cards: Array<TCard>;
    isOpen: boolean;
    onClose: () => void;
};

function ExportModal({ cards, isOpen, onClose }: Props) {
    const [copied, setCopied] = useState(false);
    const text: string = cards.map((c) => `${c.term}\t${c.description}`).join('\n');
    const { t } = useTranslation();

    const handleClickExportButton = () => {
        copyToClipboard(text);
        setCopied(true);
    };

    const body = <textarea className={cx('export-textarea', { copied })} readOnly value={text} />;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('studySetExportTitle')}
            body={body}
            btnYes={{
                title: copied ? t('studySetExportCopied') : t('studySetExportCopy'),
                disabled: copied,
                onClick: handleClickExportButton,
            }}
            btnNo={{ title: t('commonButtonClose'), onClick: onClose }}
        />
    );
}

export default ExportModal;
