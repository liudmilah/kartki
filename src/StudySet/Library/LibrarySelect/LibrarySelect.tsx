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

    const options = [
        { value: 'name-asc', label: t('setsSetNameSortAsc') },
        { value: 'name-desc', label: t('setsSetNameSortDesc') },
        { value: 'author-asc', label: t('setsSetAuthorSortAsc') },
        { value: 'author-desc', label: t('setsSetAuthorSortDesc') },
        { value: 'created-asc', label: t('setsSetCreatedSortAsc') },
        { value: 'created-desc', label: t('setsSetCreatedSortDesc') },
    ];

    if (!visible) {
        return null;
    }

    return (
        <select className="input sets__select" name="sortBy" onChange={handleChange} value={`${orderBy}-${direction}`}>
            {options.map((o) => (
                <option key={o.value} value={o.value} dangerouslySetInnerHTML={{ __html: o.label }} />
            ))}
        </select>
    );
}

export default LibrarySelect;
