import React from 'react';
import { render } from 'setupTests';
import LanguageSwitcher from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
    it('should render LanguageSwitcher', () => {
        render(
            <LanguageSwitcher
                languages={[
                    { label: 'English', code: 'en' },
                    { label: 'Russian', code: 'ru' },
                ]}
                wrapperStyle={{ color: 'red' }}
            />
        );
    });
});
