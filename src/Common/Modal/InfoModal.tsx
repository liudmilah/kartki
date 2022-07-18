import React from 'react';
import Modal from './Modal';

type InfoModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    body: React.ReactNode;
};

function InfoModal({ isOpen, onClose, title, body }: InfoModalProps) {
    return <Modal isOpen={isOpen} onClose={onClose} title={title || ''} body={body} />;
}

export default InfoModal;
