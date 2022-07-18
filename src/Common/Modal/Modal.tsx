import React from 'react';
import ReactModal from 'react-modal';
import './index.css';

type ButtonProps = {
    title: string;
    disabled?: boolean;
    onClick: () => void;
};

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    body: React.ReactNode;
    btnYes?: ButtonProps;
    btnNo?: ButtonProps;
};

function Modal({ title, body, isOpen, onClose, btnNo, btnYes }: ModalProps) {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel={title}
            className="popup__body"
            overlayClassName="popup"
        >
            <div className="popup__body">
                <div className="popup__content">
                    <span className="popup__close close-popup" onClick={onClose} />

                    <div className="popup__title">{title}</div>

                    {typeof body === 'string' ? (
                        <div className="popup__text" dangerouslySetInnerHTML={{ __html: body }} />
                    ) : (
                        <div className="popup__text">{body}</div>
                    )}

                    <div className="popup__footer">
                        {btnNo && (
                            <button className="btn btn-cancel popup__btn-no" onClick={btnNo.onClick}>
                                {btnNo.title}
                            </button>
                        )}

                        {btnYes && (
                            <button className="btn popup__btn-yes" onClick={btnYes.onClick} disabled={btnYes.disabled}>
                                {btnYes.title}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}

export default Modal;
