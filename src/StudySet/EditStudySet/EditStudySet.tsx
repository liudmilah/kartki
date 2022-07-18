import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetSet, Loading } from 'Common';
import { TStudySet } from 'StudySet/studySetTypes';
import { EditStudySetForm } from './EditStudySetForm';

function EditStudySet() {
    const { id } = useParams();
    const { data, loading, error } = useGetSet(id);
    const studySet: TStudySet | null = data ? data.set : null;

    if (error) {
        return <div className="error">todo Error!</div>;
    }

    if (!studySet) {
        return <div className="not-found">todo Not found</div>;
    }

    return (
        <>
            {loading && <Loading />}
            <EditStudySetForm studySet={studySet} />
        </>
    );
}

export default EditStudySet;
