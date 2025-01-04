import { useOutletContext } from 'react-router-dom';
import '../assets/css/BoardMyTask.css';
import { useState } from 'react';
import TaskDetail from './TaskDetail';

const BoardMyTask = () => {
    const { user, listTaskShow } = useOutletContext();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isOpenSubTask, setIsOpenSubTask] = useState(false);

    const workGroupItems = [
        { name: "Not Started" },
        { name: "In Progress" },
        { name: "Completed" }
    ];

    const getList = (list, statusName) => {
        return list.filter(item => item?.status.name == statusName);
    }

    document.addEventListener('mouseover', (event) => {
        const target = event.target;
        if (target && target.matches && target.matches('.board-my-task-item-wg-header')) {
            target.closest('.board-my-task-item-wg').style.border = '0.5px solid #6c6f72';
        }
    });

    document.addEventListener('mouseout', (event) => {
        const target = event.target;
        if (target && target.matches && target.matches('.board-my-task-item-wg-header')) {
            target.closest('.board-my-task-item-wg').style.border = '0.5px solid transparent';
        }
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const getColor = (item) => {
        if (item?.status.name === 'Completed') {
            if (item.isDelay) return "#D32F2F";
            return "#A2A0A2";
        }
        const today = new Date();
        const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const end = new Date(item?.endDate);
        const endWithoutTime = new Date(end.getFullYear(), end.getMonth(), end.getDate());

        const diff = (endWithoutTime - todayWithoutTime) / (1000 * 60 * 60 * 24);

        if (diff < 0) return "#D32F2F";
        return "#A2A0A2";
    };

    const handleOpenListSubTask = () => {
        setIsOpenSubTask(!isOpenSubTask);
    }

    const handleOpenSubTask = (item) => {
        setSelectedItem(item);
    }

    const handleOpenTask = (item, event) => {
        const target = event.target;
        if (target.closest('.board-my-task-item-subtask') || target.closest('.board-my-task-item-task-count')) {
            return;
        }
        setSelectedItem(item);
    }

    const handleCloseTask = () => {
        setSelectedItem(null);
    }

    console.log(listTaskShow)

    return (
        <div className='container-board-my-task'>
            {workGroupItems.map((item) =>
                <div key={item.name} className='board-my-task-item-wg'>
                    <div className='board-my-task-item-wg-header'>
                        <span className='board-my-task-title-name'>{item.name}</span>
                        <span className='board-my-task-title-count'>{getList(listTaskShow, item.name).length}</span>
                    </div>
                    <div className={`board-my-task-item-wg-content ${getList(listTaskShow, item.name).length > 0 ? 'list' : 'empty'}`}>
                        {getList(listTaskShow, item.name).map((itemTask) =>
                            <div key={itemTask.id} className={`board-my-task-item-task ${selectedItem?.id === itemTask.id ? 'selected' : ''}`} onClick={(event) => handleOpenTask(itemTask, event)}>
                                <div className='board-my-task-item-task-title'>
                                    <span className={`board-my-task-task-status ${itemTask.status.id === 1 ? 'status-in-progress' :
                                        itemTask.status.id === 2 ? 'status-not-started' : 'status-completed'
                                        }`}>●</span>
                                    <span className="board-my-task-task-name">{itemTask.name}</span>
                                </div>
                                <div className="board-my-task-item-task-level">
                                    <i className={`${itemTask.priorityLevel.id === 1 ? 'fas fa-fire' :
                                        itemTask.priorityLevel.id === 2 ? 'fas fa-bolt' : 'fas fa-leaf'}`}></i>
                                    <span className={`${itemTask.priorityLevel.id === 1 ? 'priority-hight' :
                                        itemTask.priorityLevel.id === 2 ? 'priority-medium' : 'priority-low'}`}>{itemTask.priorityLevel.name}</span>
                                </div>
                                <div className="board-my-task-item-task-footer">
                                    <div className="board-my-task-item-task-deadline">
                                        <span style={{ color: getColor(itemTask) }}>{formatDate(itemTask.endDate)}</span>
                                    </div>
                                    {itemTask?.listSubTask.length > 0 && (<button className={`board-my-task-item-task-count ${isOpenSubTask ? 'selected' : ''}`} onClick={handleOpenListSubTask}>
                                        <span>{itemTask.listSubTask.length}</span>
                                        <i className="fas fa-sitemap"></i>
                                        <i className={`dropdown-icon ${isOpenSubTask ? 'fas fa-caret-down' : 'fa fa-caret-right'}`}></i>
                                    </button>)}
                                </div>
                                {isOpenSubTask && itemTask.listSubTask.length > 0 && <div className="board-my-task-subtask">
                                    {itemTask.listSubTask.map((itemSubTask =>
                                        <div key={itemSubTask.id} className={`board-my-task-item-subtask ${selectedItem?.id === itemSubTask.id ? 'selected' : ''}`} onClick={() => handleOpenSubTask(itemSubTask)}>
                                            <div className="board-my-task-item-subtask-title">
                                                <span className={`board-my-task-subtask-status ${itemSubTask.status.id === 1 ? 'status-in-progress' :
                                                    itemSubTask.status.id === 2 ? 'status-not-started' : 'status-completed'
                                                    }`}>●</span>
                                                <span className="board-my-task-task-name">{itemSubTask.name}</span>
                                            </div>
                                            <div className="board-my-task-item-subtask-deadline">
                                                <span style={{ color: getColor(itemSubTask) }}>{formatDate(itemSubTask.endDate)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {selectedItem && <TaskDetail user={user} id={selectedItem?.id} idWG={selectedItem?.workGroup.id} idG={selectedItem?.workGroup.group.id} onClose={handleCloseTask} />}
        </div>
    );
}
export default BoardMyTask;