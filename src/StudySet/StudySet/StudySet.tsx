import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeleteSet, useGetSet, PlayIcon, DeleteIcon, UploadIcon, EditIcon, Loading } from 'Common';
import routes from 'routes';
import { useAuth } from 'Auth';
import { TStudySet, TCard } from 'StudySet/studySetTypes';
import { DeleteModal } from './DeleteModal';
import { ExportModal } from './ExportModal';
import { StudySetApiError } from './StudySetApiError';
import { SetNotFound } from './SetNotFound';
import { ActionButton } from './ActionButton';
import { Card } from './Card';
import './index.css';

function StudySet() {
    const { id } = useParams();
    const { user } = useAuth();
    const { data, loading, error } = useGetSet(id);
    const studySet: TStudySet | null = data ? data.set : null;
    const [deleteStudySet, { data: delData }] = useDeleteSet();
    const [showExportModal, setShowExportModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (delData) {
            navigate(routes.SETS);
        }
    }, [delData]);

    const closeExportModal = () => {
        setShowExportModal(false);
    };

    const openExportModal = () => {
        setShowExportModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        setShowDeleteModal(false);
        deleteStudySet({
            variables: {
                id: studySet && studySet._id,
            },
        });
    };

    const goToEditPage = () => {
        if (studySet) {
            navigate(routes.EDIT.replace(':id', studySet._id));
        }
    };

    const goToFlashcardsPage = () => {
        if (studySet) {
            navigate(routes.FLASHCARDS.replace(':id', studySet._id));
        }
    };

    const isAuthor = Boolean(user && studySet && studySet.author._id === user._id);

    if (loading) {
        return <Loading />;
    }
    if (error) {
        return <StudySetApiError />;
    }
    if (!studySet) {
        return <SetNotFound />;
    }

    return (
        <div className="set">
            <div className="title">{studySet.name}</div>

            <span className="set__description">{studySet.description}</span>

            <div className="set__buttons">
                <ActionButton
                    visible={isAuthor}
                    icon={<EditIcon />}
                    onClick={goToEditPage}
                    label={t('studySetBtnEdit')}
                />
                <ActionButton
                    visible={isAuthor}
                    icon={<DeleteIcon />}
                    onClick={openDeleteModal}
                    label={t('studySetBtnDelete')}
                />
                <ActionButton visible icon={<UploadIcon />} onClick={openExportModal} label={t('studySetBtnExport')} />
                <ActionButton
                    visible
                    icon={<PlayIcon />}
                    onClick={goToFlashcardsPage}
                    label={t('studySetBtnFlashcards')}
                />
            </div>

            {studySet.cards.map((card: TCard, idx: number) => (
                <Card number={idx + 1} description={card.description} term={card.term} key={card._id} />
            ))}

            <ExportModal cards={studySet.cards} isOpen={showExportModal} onClose={closeExportModal} />

            <DeleteModal
                name={studySet.name}
                isOpen={showDeleteModal}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
            />
        </div>
    );
}

export default StudySet;
