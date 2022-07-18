import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
    imgSrc: string;
    appTitle: string;
    wrapperStyle?: object;
    titleStyle?: object;
    imgWidth?: number;
    imgHeight?: number;
    homeUrl?: string;
};

function Logo({
    imgSrc,
    appTitle,
    wrapperStyle = {},
    titleStyle = {},
    imgWidth = 30,
    imgHeight = 30,
    homeUrl = '/',
}: Props) {
    return (
        <div className="logo">
            <button className="logo__button" style={wrapperStyle}>
                <div className="logo__img">
                    <img src={imgSrc} height={imgHeight} width={imgWidth} alt="logo" />
                </div>

                <Link className="logo__link" to={homeUrl} style={titleStyle}>
                    {appTitle}
                </Link>
            </button>
        </div>
    );
}

export default Logo;
