import React from 'react';
import './index.css';

type AlertErrorProps = {
    message: Array<string>;
    visible: boolean;
};

function AlertError({ message, visible }: AlertErrorProps) {
    if (!visible) {
        return null;
    }

    return message.filter((m) => !!m).length > 0 ? (
        <div className="alert alert-error">
            {message.map((m) => (
                <div className="alert-content" key={m}>
                    {m}
                </div>
            ))}
        </div>
    ) : null;
}
export default AlertError;
