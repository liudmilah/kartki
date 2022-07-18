import '@testing-library/jest-dom';
import React from 'react';
import { Router } from 'react-router-dom';
import { render as rtlRender, RenderResult } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { use } from 'i18next';
import { initReactI18next } from 'react-i18next';

use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['translations'],
    defaultNS: 'translations',
    debug: false,
    interpolation: {
        escapeValue: false,
    },
    resources: { en: { translations: {} } },
});

function render(component: JSX.Element, { history = createMemoryHistory(), ...renderOptions } = {}): RenderResult {
    const Wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => {
        return (
            <Router location={history.location} navigator={history}>
                {children}
            </Router>
        );
    };

    return rtlRender(component, { wrapper: Wrapper, ...renderOptions });
}

export { screen, fireEvent, waitFor } from '@testing-library/react';
export { render };
