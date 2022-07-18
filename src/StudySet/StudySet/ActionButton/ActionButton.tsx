import React from 'react';
import '../index.css';

type Props = {
    icon: React.ReactNode;
    onClick: () => void;
    label: string;
    visible: boolean;
};

function ActionButton({ icon, onClick, label, visible }: Props) {
    if (!visible) {
        return null;
    }

    return (
        <div className="tooltip">
            <button className="btn set__button" onClick={onClick}>
                {icon}
            </button>
            <span className="tooltiptext">{label}</span>
        </div>
    );
}

export default ActionButton;
