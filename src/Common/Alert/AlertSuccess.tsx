import React from 'react';
import './index.css';

type Props = {
    visible: boolean;
    message: Array<string>;
    style?: object;
};
function AlertSuccess({ message, visible, style }: Props) {
    if (!visible) {
        return null;
    }

    return message.filter((m) => !!m).length > 0 ? (
        <div className="alert alert-success" style={style}>
            {message.map((m) => (
                <div className="alert-content" key={m}>
                    {m}
                </div>
            ))}
        </div>
    ) : null;
}
export default AlertSuccess;
