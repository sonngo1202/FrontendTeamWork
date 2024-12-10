import { useEffect, useState } from 'react';
import '../assets/css/Notification.css';
import { useOutletContext } from 'react-router-dom';
import { getByIsNotDeleted, getByIsDeleted, maskNotifiAsRead } from '../services/notificationService';
import Cookies from 'js-cookie';
import TaskDetail from './TaskDetail';

const Notification = () => {
    const { user } = useOutletContext();
    const [selectedAction, setSelectedAction] = useState(true);
    const [listNotification, setNotification] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemHover, setItemHover] = useState(null)

    const fetchData = async () => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            try {
                if (selectedAction) {
                    const data = await getByIsNotDeleted(user?.id, accessToken);
                    setNotification(data);
                    console.log(data);
                } else {
                    const data = await getByIsDeleted(user?.id, accessToken);
                    setNotification(data);
                    console.log(data);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
    };

    const readNotifi = async (id) => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            try {
                const data = await maskNotifiAsRead(id, user?.id, accessToken);
                console.log(data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, [selectedAction]);

    const formatTimeDifference = (inputDate) => {
        const now = new Date();
        const input = new Date(inputDate);

        const difference = now.getTime() - input.getTime();

        if (difference > 24 * 60 * 60 * 1000) {
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            console.log(difference);
            return input.toLocaleDateString('en-US', options);
        } else if (difference > 60 * 60 * 1000) {
            const hours = Math.floor(difference / (60 * 60 * 1000));
            return `${hours}h ago`;
        } else if (difference > 60 * 1000) {
            const minutes = Math.floor(difference / (60 * 1000));
            return `${minutes}m ago`;
        } else {
            const seconds = Math.floor(difference / 1000);
            console.log(seconds);
            console.log(difference);
            return `${seconds}s ago`;
        }
    }

    const handleOpenActivity = () => {
        setSelectedAction(true);
    }

    const handleOpenArchive = () => {
        setSelectedAction(false);
    }

    const handleOpenNotification = (item) => {
        setSelectedItem(item);
        if (!item?.isRead) {
            readNotifi(item?.notification.id)
                .then(() => {
                    fetchData();
                })
                .catch((error) => {
                    console.error("Failed to mark notification as read:", error);
                });
        }
    }

    const handleMouseEnter = (item) => {
        setItemHover(item);
    };

    const handleMouseLeave = () => {
        setItemHover(null);
    };

    const handleCloseTask = () => {
        setSelectedItem(null);
    }

    return (
        <div className="container-notification">
            <div className='notification-header'>
                <span>Notification</span>
                <div className="notification-select">
                    <span className={`${selectedAction ? 'selected' : ''}`} onClick={handleOpenActivity}>Activity</span>
                    <span className={`${selectedAction ? '' : 'selected'}`} onClick={handleOpenArchive}>Archive</span>
                </div>
            </div>
            {listNotification.length > 0 ?
                <div className={`notification-content ${selectedItem ? 'open-detail' : ''}`}>
                    {listNotification.sort((a, b) => new Date(b?.notification.createdAt) - new Date(a?.notification.createdAt)).map((item) =>
                        <div key={item?.id} className={`notification-item ${selectedItem?.id == item?.id ? 'selected' : ''}`}
                            onClick={() => handleOpenNotification(item)}
                            onMouseEnter={() => handleMouseEnter(item?.id)}
                            onMouseLeave={handleMouseLeave}>
                            <div className='notification-item-container'>
                                <div className='notification-item-group'>
                                    <img
                                        src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item?.notification.task.workGroup.group.picture}?alt=media`}
                                        alt="Avatar-Group"
                                    />
                                    <span>{item?.notification.task.workGroup.group.name}</span>
                                </div>
                                <div className='notification-item-task'>
                                    <div className='notification-item-task-left'>
                                        <span className={`notification-item-task-status ${item?.notification.task.status.id === 1 ? 'status-in-progress' :
                                            item?.notification.task.status.id === 2 ? 'status-not-started' : 'status-completed'
                                            }`}>●</span>
                                        <span className="notification-item-task-name">{item?.notification.task.name}</span>
                                    </div>
                                    {!item?.isRead && itemHover !== item?.id && (<div className='notification-item-task-right'>
                                        <span>●</span>
                                    </div>)}
                                    {itemHover === item?.id && (<div className='notification-item-task-right'>
                                        <i className='fas fa-archive'></i>
                                    </div>)}
                                </div>
                                <div className='notification-item-footer'>
                                    <div className='notification-item-creator'>
                                        <img
                                            src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item?.notification.creator.picture}?alt=media`}
                                            alt="Avatar-Group"
                                        />
                                        <span className='creator-name'><b>{item?.notification.creator.fullName}</b> {item?.notification.content}</span>
                                    </div>
                                    <span className='space'>●</span>
                                    <div className='notification-item-deadline'>
                                        <span>{formatTimeDifference(item?.notification.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div> :
                <div className='notification-content-empty'>
                    <span>Bạn không có thông báo lưu trữ nào hiện tại.</span>
                </div>}
            {selectedItem && <TaskDetail user={user} id={selectedItem?.notification.task.id} idWG={selectedItem?.notification.task.workGroup.id} idG={selectedItem?.notification.task.workGroup.group.id} onClose={handleCloseTask} />}
        </div>
    );
}
export default Notification;