import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'Common';

type Props = {
    name: string;
    isOpen: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

function DeleteModal({ name, isOpen, onConfirm, onClose }: Props) {
    const { t } = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('studySetDeleteTitle')}
            body={t('studySetDeleteConfirm', { name })}
            btnYes={{ title: t('commonButtonYes'), onClick: onConfirm }}
            btnNo={{ title: t('commonButtonNo'), onClick: onClose }}
        />
    );
}

export default DeleteModal;
