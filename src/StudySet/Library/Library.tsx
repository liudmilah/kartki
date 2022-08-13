import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import routes from 'routes';
import { useGetSets, useSorting } from 'Common';
import { TStudySet } from 'StudySet/studySetTypes';
import { SetsNotFound } from './SetsNotFound';
import { LibraryError } from './LibraryError';
import { LibraryLoading } from './LibraryLoading';
import { LibrarySelect } from './LibrarySelect';
import './index.css';

const emptySet: Array<TStudySet> = [];

function Library() {
    const { data, loading, error } = useGetSets();
    const sets: Array<TStudySet> = data ? data.sets : emptySet;
    const { direction, orderBy, handleSort, sortedData } = useSorting(sets, 'created', 'desc');
    const { t } = useTranslation();

    if (error) {
        return <LibraryError />;
    }
    if (loading) {
        return <LibraryLoading />;
    }
    if (sortedData.length === 0) {
        return <SetsNotFound />;
    }

    return (
        <div className="sets">
            <div className="title sets__title">{t('setsTitle')}</div>

            <LibrarySelect
                visible={sortedData.length > 1}
                onChange={handleSort}
                direction={direction}
                orderBy={orderBy}
            />

            {sortedData.map((studySet: TStudySet, index: number) => (
                <div className="sets__item" key={studySet._id}>
                    <div>
                        <Link className="sets__item-name" to={routes.SET.replace(':id', studySet._id)}>
                            {`${index + 1}. ${studySet.name}`}
                        </Link>
                        <span className="sets__item-description">
                            {t('setsDescription', {
                                at: dayjs(+studySet.created).format('DD/MM/YYYY HH:mm'),
                                by: studySet.author.name,
                            })}
                        </span>
                    </div>
                    <div>
                        <span className="sets__cards-amount">{t('setsCardsAmount', { n: studySet.cardsAmount })}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Library;
