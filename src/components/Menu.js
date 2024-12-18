import React, { useEffect, useRef, useState } from "react";
import '../assets/css/Menu.css';
import { useLocation, useNavigate } from "react-router-dom";
import ModalGroupDetail from "./ModalGroupDetail";
import OptionGroup from "./OptionGroup";

const Menu = ({ user, fetchUserData }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedItem, setSelectedItem] = useState('');
    const [isGroupOpen, setIsGroupOpen] = useState(true);
    const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
    const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, group: null });
    const contextMenuRef = useRef(null);

    const menuItems = [
        { name: "Home", icon: "fas fa-home", path: "/my-home" },
        { name: "My Task", icon: "fas fa-tasks", path: "/my-task/board" },
        { name: "Notification", icon: "fas fa-inbox", path: "/my-notification" },
        { name: "Group", icon: "fas fa-plus", isGroup: true }
    ];

    const handleItemClick = (item) => {
        if (!item.isGroup) {
            setSelectedItem(item.name);
            navigate(item.path);
        }
    };

    const handleItemGroupClick = (item) => {
        setSelectedItem(item.name);
        navigate(`/group/${item.id}/board`);
    };

    const handleOpenList = () => {
        setIsGroupOpen(!isGroupOpen);
    }

    const handleContextMenu = (e, group) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            group,
        });
    };

    const handleOutsideClick = (e) => {
        if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
            setContextMenu({ ...contextMenu, visible: false });
        }
    };


    useEffect(() => {
        const currentPath = location.pathname;
        const groupMatch = currentPath.match(/^\/group\/(\d+)/);

        if (groupMatch) {
            const groupId = groupMatch[1];
            const activeItem = user?.roles.find(item => {
                return item.group.id === parseInt(groupId);
            });
            if (activeItem) {
                setSelectedItem(activeItem.group.name);
            }
        } else {
            const activeItem = menuItems.find(item => currentPath.includes(item.path));
            if (activeItem) {
                setSelectedItem(activeItem.name);
            }
        }
    }, [location, user]);

    useEffect(() => {
        if (contextMenu.visible) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [contextMenu.visible]);

    return (
        <nav className="container-menu">
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className={`${selectedItem === item.name ? 'selected' : ''} ${item.isGroup ? 'item-group' : 'menu-item'}`}
                    onClick={!item.isGroup ? () => handleItemClick(item) : undefined}>
                    <button className="button-item" onClick={item.isGroup ? () => handleItemClick(item) : undefined}>
                        <i className={`${item.icon} menu-icon`} onClick={item.isGroup ? () => setIsAddGroupOpen(true) : undefined}></i>
                        {!item.isGroup && (<span>{item.name}</span>)}
                    </button>
                    {item.isGroup && (<span>{item.name}</span>)}
                    {item.isGroup && (
                        <button className="button-dropdown" onClick={handleOpenList}>
                            <i className={`${isGroupOpen ? 'fas fa-caret-down' : 'fa fa-caret-left'}`} ></i>
                        </button>
                    )}
                </div>
            ))}
            {isGroupOpen && user && user.roles && user.roles.map((item, index) => !item.group.isClosed && (
                <div key={index} className={`group-item ${selectedItem === item.group.name ? 'selected' : ''}`}
                    onClick={() => handleItemGroupClick(item.group)}
                    onContextMenu={(e) => handleContextMenu(e, item.group)} >
                    <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item.group.picture}?alt=media`} alt="Avatar-Group" />
                    <span>{item.group.name}</span>
                </div>
            ))}
            {isAddGroupOpen && (<ModalGroupDetail setClose={setIsAddGroupOpen} fetchUserData={fetchUserData} />)}
            {contextMenu.visible && (
                <OptionGroup contextMenuRef={contextMenuRef} user={user} fetchUserData={fetchUserData} contextMenu={contextMenu} setContextMenu={setContextMenu} setIsEditGroupOpen={setIsEditGroupOpen} setSelectedGroup={setSelectedGroup} />
            )}
            {isEditGroupOpen && (<ModalGroupDetail setClose={setIsEditGroupOpen} fetchUserData={fetchUserData} group={selectedGroup} />)}
        </nav>
    );
};

export default Menu;
