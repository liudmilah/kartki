import React from 'react';
import './index.css';

type IconButtonProps = {
    imageSrc: string;
    text: string;
    classNames?: string;
    url: string;
};

function LinkIconButton({ imageSrc, text, classNames, url }: IconButtonProps) {
    return (
        <a className={`icon-button ${classNames}`} href={url}>
            <img src={imageSrc} />
            <span>{text}</span>
        </a>
    );
}

export default LinkIconButton;
