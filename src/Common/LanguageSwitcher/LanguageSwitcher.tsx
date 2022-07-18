import React from 'react';
import { i18n } from 'Common';
import './index.css';

type Language = {
    code: string;
    label: string;
};

type Props = {
    languages: Array<Language>;
    wrapperStyle?: object;
};

function LanguageSwitcher({ languages, wrapperStyle }: Props) {
    const changeLanguage = (lang: string): void => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="language">
            <div className="language__body" style={wrapperStyle}>
                {languages.map((lang) => (
                    <button className="language__button" key={lang.code} onClick={() => changeLanguage(lang.code)}>
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LanguageSwitcher;
