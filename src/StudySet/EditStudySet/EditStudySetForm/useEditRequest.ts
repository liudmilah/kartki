import { useAddSet, useUpdateSet } from 'Common';
import { TCard } from 'StudySet/studySetTypes';

type SetData = {
    _id?: string;
    name: string;
    cards: Array<TCard>;
    description: string;
};

const useEditRequest = () => {
    const [updateStudySet, { data: updateResult, error: updateError, loading: updateLoading, reset: updateReset }] =
        useUpdateSet();
    const [addStudySet, { data: addResult, error: addError, loading: addLoading, reset: addReset }] = useAddSet();

    const send = (data: SetData) => {
        const name = data.name.trim();
        const description = data.description.trim();
        const cards = data.cards.map((c) => ({
            term: c.term.trim(),
            description: c.description.trim(),
        }));

        if (data._id) {
            updateStudySet({
                variables: {
                    updateSetData: {
                        _id: data._id,
                        name,
                        description,
                        cards,
                    },
                },
            });
        } else {
            addStudySet({
                variables: {
                    newSetData: {
                        name,
                        description,
                        cards,
                    },
                },
            });
        }
    };

    const reset = () => {
        updateReset();
        addReset();
    };

    return {
        send,
        reset,
        resultingSet: updateResult ? updateResult.updateSet : addResult ? addResult.addSet : null,
        error: updateError || addError,
        loading: updateLoading || addLoading,
    };
};

export { useEditRequest };
