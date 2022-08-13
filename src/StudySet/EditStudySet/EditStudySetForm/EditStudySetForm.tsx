import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { TStudySet, TCard } from 'StudySet/studySetTypes';
import { DownloadIcon, generateId, validateString, AlertError } from 'Common';
import routes from 'routes';
import { ImportModal } from '../ImportModal';
import { Card } from '../Card';
import { useEditRequest } from './useEditRequest';
import './index.css';

const SET_NAME_MAX = 255;
const SET_DESCR_MAX = 500;
const CARD_NAME_MAX = 100;
const CARD_DESCR_MAX = 255;

type Props = {
    studySet?: TStudySet;
};
type FormData = {
    _id: string;
    name: string;
    description: string;
    cards: Array<TCard>;
};
type Errors = {
    name: boolean;
    description: boolean;
    cards: Record<string, boolean>;
};

const generateCard = (): TCard => {
    return {
        _id: generateId(),
        term: '',
        description: '',
    };
};
const getInitFormData = (studySet?: TStudySet): FormData => ({
    _id: studySet ? studySet._id : '',
    name: studySet ? studySet.name : '',
    description: studySet ? studySet.description : '',
    cards: studySet ? studySet.cards : [generateCard(), generateCard()],
});
const initErrors = {
    name: false,
    description: false,
    cards: {},
};

function EditStudySetForm({ studySet }: Props) {
    const [showImportModal, setShowImportModal] = useState(false);
    const [formData, setFormData] = useState<FormData>(getInitFormData(studySet));
    const [errors, setErrors] = useState<Errors>(initErrors);
    const [apiError, setApiError] = useState('');
    const { send, error, resultingSet, reset, loading } = useEditRequest();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (error) {
            setApiError(t('commonGeneralApiError'));
            reset();
        }
    }, [error]);

    useEffect(() => {
        if (resultingSet) {
            navigate(routes.SET.replace(':id', resultingSet._id));
            reset();
        }
    }, [resultingSet]);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        setFormData({ ...formData, [input.name]: input.value });
        setErrors({ ...errors, [input.name]: false });
        setApiError('');
    };

    const handleClickAddCard = () => {
        setFormData({ ...formData, cards: formData.cards.concat([generateCard()]) });
    };

    const openImportModal = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setShowImportModal(true);
    };

    const closeImportModal = () => {
        setShowImportModal(false);
    };

    const handleDeleteCard = (cardId: string) => () => {
        setFormData({ ...formData, cards: formData.cards.filter((c) => c._id !== cardId) });
        setErrors({ ...initErrors });
        setApiError('');
    };

    const handleSaveImport = (cardsArr: Array<TCard>) => {
        try {
            const newData = { ...formData, cards: cardsArr };
            closeImportModal();
            setFormData(newData);
            validate(newData);
        } catch (e) {
            console.error('Invalid form data.');
        }
    };

    const hasErrors = (data = formData, err = errors) => {
        return err.name || err.description || Object.keys(err.cards).length > 0 || data.cards.length === 0;
    };

    const validate = (newFormData = formData) => {
        const newErrors = { ...initErrors };

        if (!validateString(newFormData.name, 1, SET_NAME_MAX)) {
            newErrors.name = true;
        }
        if (!validateString(newFormData.description, 0, SET_DESCR_MAX)) {
            newErrors.description = true;
        }
        newFormData.cards.forEach((c: TCard) => {
            if (!validateString(c.term, 1, CARD_NAME_MAX) || !validateString(c.description, 1, CARD_DESCR_MAX)) {
                newErrors.cards = { ...newErrors.cards, [c._id]: true };
            }
        });

        if (hasErrors(newFormData, newErrors)) {
            setErrors(newErrors);
            throw new Error('Data is invalid.');
        }
    };

    const handleClickSaveButton = () => {
        try {
            validate();
            send(formData);
        } catch (e) {
            console.error('Invalid form data.');
        }
    };

    const handleChangeCard = (cardId: string) => (field: string, value: string) => {
        const cards = [...formData.cards];
        const index = formData.cards.findIndex((c) => c._id === cardId);
        cards[index] = { ...formData.cards[index], [field]: value };
        setFormData({ ...formData, cards });
        setErrors({ ...initErrors });
        setApiError('');
    };

    return (
        <div className="edit">
            <div className="edit__top edit-top">
                <div className="edit-top__name">
                    <label htmlFor="name">{t('studySetName')}</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChangeInput}
                        className={cx({ input: true, _error: errors.name })}
                    />
                </div>

                <div className="edit-top__description">
                    <label htmlFor="description">{t('studySetDescription')}</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChangeInput}
                        className={cx({ input: true, _error: errors.description })}
                    />
                </div>

                <a className="edit-top__import" href="#" onClick={openImportModal}>
                    <DownloadIcon /> {t('studySetImportFromList')}
                </a>
            </div>

            <div className="edit__body edit-body">
                <AlertError visible={!!apiError} message={[apiError]} />

                {formData.cards.map((card: TCard, idx) => (
                    <Card
                        key={card._id}
                        number={idx + 1}
                        amount={formData.cards.length}
                        card={card}
                        errors={errors.cards}
                        onChangeCard={handleChangeCard(card._id)}
                        onDeleteCard={handleDeleteCard(card._id)}
                    />
                ))}

                <div className="edit-body__add">
                    <button className="btn" onClick={handleClickAddCard}>
                        {t('studySetAddCard')}
                    </button>
                </div>
            </div>

            <div className="edit__bottom">
                <button onClick={handleClickSaveButton} className="btn" disabled={loading || hasErrors()}>
                    {t('studySetSave')}
                </button>
            </div>

            <ImportModal isOpen={showImportModal} onSaveImport={handleSaveImport} onClose={closeImportModal} />
        </div>
    );
}

export default EditStudySetForm;
