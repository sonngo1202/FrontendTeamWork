import { useState } from 'react';
import '../assets/css/OptionGroup.css';
import ReactDOM from 'react-dom';
import { deleteG } from '../services/groupService';
import Cookies from 'js-cookie';

const isManagerOfGroup = (user, group) => {
    if (!user || !user.roles || !group) {
        return false;
    }

    return user.roles.some(userGroup =>
        userGroup.group.id === group.id && userGroup.role === 'MANAGER'
    );
};

const OptionGroup = ({ contextMenuRef, user, fetchUserData, contextMenu, setContextMenu, setIsEditGroupOpen, setSelectedGroup}) => {
    const allOptions = [
        { name: 'Open in new tab', icon: 'fas fa-external-link-alt', onClick: () => handleOpenInNewTab() },
        { name: 'Copy link', icon: 'fas fa-link', onClick: () => handleCopyLink() },
        { name: 'Edit group', icon: 'fas fa-pen', onClick: () => handleEdit() },
        { name: 'Archive group', icon: 'fas fa-archive', onClick: () => handleDelete() },
    ];

    const isManager = isManagerOfGroup(user, contextMenu.group);

    const filteredOptions = isManager
        ? allOptions
        : allOptions.filter(option => option.name !== 'Edit group' && option.name !== 'Archive group');

    const handleOpenInNewTab = () => {
        window.open(`/group/${contextMenu?.group.id}/board`, '_blank');
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleCopyLink = () => {
        const linkToCopy = `http://localhost:3000/group/${contextMenu?.group.id}/board`;

        navigator.clipboard.writeText(linkToCopy)
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleEdit = () => {
        setIsEditGroupOpen(true);
        setSelectedGroup(contextMenu?.group);
        setContextMenu({ ...contextMenu, visible: false });
    }

    const deleteGroup = async (accessToken) => {
        if (accessToken) {
            try {
                const data = await deleteG(contextMenu?.group.id, accessToken);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
    }

    const handleDelete = () => {
        const accessToken = Cookies.get('accessToken');

        deleteGroup(accessToken)
            .then(() => {
                return fetchUserData(accessToken);
            })
            .catch((error) => {
                console.error("Failed to update user:", error);
            });
        setContextMenu({ ...contextMenu, visible: false });
    }

    return ReactDOM.createPortal(
        <div ref={contextMenuRef} className='container-option-group' style={{ top: contextMenu.y, left: contextMenu.x }}>
            {filteredOptions.map((item, index) => (
                <div key={index} className='option-group-item' onClick={item.onClick}>
                    <i className={item.icon}></i>
                    <span>{item.name}</span>
                </div>
            ))}
        </div>,
        document.body
    );
};

export default OptionGroup;
