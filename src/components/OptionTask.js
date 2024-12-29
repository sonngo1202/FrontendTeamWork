import '../assets/css/OptionTask.css';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import { deleteT } from '../services/taskService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ModalConfirm from './ModalConfirm';

const isManagerOfGroup = (user, group) => {
    if (!user || !user.roles || !group) {
        return false;
    }

    return user.roles.some(userGroup =>
        userGroup.group.id === group.id && userGroup.role === 'MANAGER'
    );
};

const OptionTask = ({ contextMenuRef, user, group, workGroup, task, fetchDataGroup, contextMenu, setContextMenu, setIsEditTaskOpen, idTask, fetchDataTask }) => {
    const allOptions = [
        { name: 'Open in new tab', icon: 'fas fa-external-link-alt', onClick: () => handleOpenInNewTab() },
        { name: 'Copy link', icon: 'fas fa-link', onClick: () => handleCopyLinkTask() },
        { name: 'Edit task', icon: 'fas fa-pen', onClick: () => handleEdit() },
        { name: 'Delete task', icon: 'fas fa-archive', color: 'Red', onClick: () => handleDelete() },
    ];
    const navigate = useNavigate();

    const isManager = isManagerOfGroup(user, group);

    const filteredOptions = isManager
        ? allOptions
        : allOptions.filter(option => option.name !== 'Edit task' && option.name !== 'Delete task');

    const handleOpenInNewTab = () => {
        window.open(`/group/${group.id}/board/${workGroup}/tasks/${task.id}`, '_blank');
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleCopyLinkTask = () => {
        const linkToCopy = `http://localhost:3000/group/${group.id}/board/${workGroup}/tasks/${task.id}`;

        navigator.clipboard.writeText(linkToCopy)
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleEdit = () => {
        setIsEditTaskOpen(true);
        setContextMenu({ ...contextMenu, visible: false });
    }

    const deleteTask = async (accessToken) => {
        if (accessToken) {
            try {
                const data = await deleteT(task.id, group?.id, workGroup, accessToken);
            } catch (error) {
                console.error("Failed to delete task:", error);
            }
        }
    }

    const handleDelete = () => {
        const accessToken = Cookies.get('accessToken');
        deleteTask(accessToken)
            .then(() => {
                return fetchDataGroup();
            })
            .then(() => {
                if (fetchDataTask) {
                    return fetchDataTask()
                }
            })
            .catch((error) => {
                console.error("Failed to delete task:", error);
            });
        if (idTask && String(task?.id) === idTask) {
            navigate(`/group/${group.id}/board`);
        }
        setContextMenu({ ...contextMenu, visible: false });
    }

    return ReactDOM.createPortal(
        <div ref={contextMenuRef} className='container-option-task' style={{ top: contextMenu.y, left: contextMenu.x }}>
            {filteredOptions.map((item, index) => (
                <div key={index} className={`option-task-item ${item?.color ? 'color' : ''}`} onClick={item.onClick}>
                    <i className={item.icon}></i>
                    <span>{item.name}</span>
                </div>
            ))}
        </div>,
        document.body
    );
};

export default OptionTask;
