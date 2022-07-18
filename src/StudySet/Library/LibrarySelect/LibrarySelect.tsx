import React from 'react';
import { useTranslation } from 'react-i18next';
import { TDirection } from 'Common';
import '../index.css';
import { TStudySet } from '../../studySetTypes';

type Props = {
    visible: boolean;
    onChange: (field: keyof TStudySet, order: TDirection) => void;
    orderBy: string;
    direction: string;
};

function LibrarySelect({ visible, onChange, orderBy, direction }: Props) {
    const { t } = useTranslation();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const arr: string[] = e.currentTarget.value.split('-');
        onChange(arr[0] as keyof TStudySet, arr[1] as TDirection);
    };

    if (!visible) {
        return null;
    }

    return (
        <select className="input sets__select" name="sortBy" onChange={handleChange} value={`${orderBy}-${direction}`}>
            <option value="name-asc">{t('setsSetNameSortAsc')}</option>
            <option value="name-desc">{t('setsSetNameSortDesc')}</option>
            <option value="author-asc">{t('setsSetAuthorSortAsc')}</option>
            <option value="author-desc">{t('setsSetAuthorSortDesc')}</option>
            <option value="created-asc">{t('setsSetCreatedSortAsc')}</option>
            <option value="created-desc">{t('setsSetCreatedSortDesc')}</option>
        </select>
    );
}

export default LibrarySelect;
