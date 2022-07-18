import React from 'react';
import './index.css';

type Props = {
    visible?: boolean;
};

function Loading({ visible = true }: Props) {
    if (!visible) {
        return null;
    }

    return (
        <div className="loading">
            <img alt="Loading" src="/images/loading.gif" />
        </div>
    );
}

export default Loading;
