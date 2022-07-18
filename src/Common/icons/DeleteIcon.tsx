import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function DeleteIcon(): JSX.Element {
    return <FontAwesomeIcon icon={faTrash} />;
}

export default DeleteIcon;
