import { useOutletContext } from "react-router-dom";
import '../assets/css/BoardGroup.css'
import { useState } from "react";

const BoardGroup = () => {
    const { group } = useOutletContext();
    const [isOpenSubTask, setIsOpenSubTask] = useState(false);

    document.addEventListener('mouseover', (event) => {
        const target = event.target;
        if (target && target.matches && target.matches('.board-item-work-group-header')) {
            target.closest('.board-item-work-group').style.border = '0.5px solid #6c6f72';
        }
    });

    document.addEventListener('mouseout', (event) => {
        const target = event.target;
        if (target && target.matches && target.matches('.board-item-work-group-header')) {
            target.closest('.board-item-work-group').style.border = '0.5px solid transparent';
        }
    });

    document.addEventListener('mouseenter', (event) => {
        const target = event.target;
        if (target && target.matches && target.matches('.board-item-subtask')) {
            const itemList = Array.from(document.querySelectorAll('.board-item-subtask'));
            const index = itemList.indexOf(target);

            if (index > 0) {
                itemList[index - 1].style.borderBottom = '0.3px solid transparent';
            }
        }
    }, true);

    document.addEventListener('mouseleave', (event) => {
        const target = event.target;
        if (target && target.matches && target.matches('.board-item-subtask')) {
            const itemList = Array.from(document.querySelectorAll('.board-item-subtask'));
            const index = itemList.indexOf(target);

            if (index > 0) {
                itemList[index - 1].style.borderBottom = '0.3px solid #6c6f72';
            }
        }
    }, true);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const getColor = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const diff = (end - today) / (1000 * 60 * 60 * 24);

        if (diff < 0) return "#D32F2F";
        if (diff <= 2) return "#F0A500";
        return "#A2A0A2";
    };

    const handleOpenSubTask = () => {
        setIsOpenSubTask(!isOpenSubTask);
    }

    return (
        <div className="container-board">
            {group && group.listWorkGroup && group.listWorkGroup.map((item =>
                <div key={item.id} className={`board-item-work-group`}>
                    <div className="board-item-work-group-header">
                        <div className="board-title">
                            <span className="board-title-name">{item.name}</span>
                            <span className="board-title-count">{item?.listTask.length}</span>
                        </div>
                        <div className="board-select">
                            <button><i className="fas fa-plus"></i></button>
                            <button><i className="fas fa-ellipsis-h"></i></button>
                        </div>
                    </div>
                    <div className={`board-item-work-group-content ${item?.listTask.length > 0 ? 'list' : 'empty'}`}>
                        {item?.listTask.length > 0 && item.listTask.map((itemTask =>
                            <div key={itemTask.id} className="board-item-task">
                                <div className="board-item-task-title">
                                    <span className={`board-task-status ${itemTask.status.id === 1 ? 'status-in-progress' :
                                        itemTask.status.id === 2 ? 'status-not-started' : 'status-completed'
                                        }`}>●</span>
                                    <span className="board-task-name">{itemTask.name}</span>
                                </div>
                                <div className="board-item-task-level">
                                    <i className={`${itemTask.priorityLevel.id === 1 ? 'fas fa-fire' :
                                        itemTask.priorityLevel.id === 2 ? 'fas fa-bolt' : 'fas fa-leaf'}`}></i>
                                    <span className={`${itemTask.priorityLevel.id === 1 ? 'priority-hight' :
                                        itemTask.priorityLevel.id === 2 ? 'priority-medium' : 'priority-low'}`}>{itemTask.priorityLevel.name}</span>
                                </div>
                                <div className="board-item-task-footer">
                                    <div className="board-item-task-deadline">
                                        <img
                                            src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${itemTask.assignee.picture}?alt=media`}
                                            alt="Avatar"
                                            className="dropdown-avatar"
                                        />
                                        <span style={{ color: getColor(itemTask.endDate) }}>{formatDate(itemTask.endDate)}</span>
                                    </div>
                                    {itemTask?.listSubTask.length > 0 && (<button className={`board-item-task-count ${isOpenSubTask ? 'selected' : ''}`} onClick={handleOpenSubTask}>
                                        <span>{itemTask.listSubTask.length}</span>
                                        <i className="fas fa-sitemap"></i>
                                        <i className={`dropdown-icon ${isOpenSubTask ? 'fas fa-caret-down' : 'fa fa-caret-right'}`}></i>
                                    </button>)}
                                </div>
                                {isOpenSubTask && itemTask.listSubTask.length > 0 && <div className="board-subtask">
                                    {itemTask.listSubTask.map((itemSubTask =>
                                        <div key={itemSubTask.id} className="board-item-subtask">
                                            <div className="board-item-subtask-title">
                                                <span className={`board-subtask-status ${itemSubTask.status.id === 1 ? 'status-in-progress' :
                                                    itemSubTask.status.id === 2 ? 'status-not-started' : 'status-completed'
                                                    }`}>●</span>
                                                <span className="board-task-name">{itemSubTask.name}</span>
                                            </div>
                                            <div className="board-item-subtask-deadline">
                                                <span style={{ color: getColor(itemSubTask.endDate) }}>{formatDate(itemSubTask.endDate)}</span>
                                                <img
                                                    src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${itemSubTask.assignee.picture}?alt=media`}
                                                    alt="Avatar"
                                                    className="dropdown-avatar"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button className="add-subtask">
                                        <i className="fas fa-plus"></i>
                                        <span>Add subtask</span>
                                    </button>
                                </div>}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <div className="board-add-work-group">
                <button className="add-work-group">
                    <i className="fas fa-plus"></i>
                    <span>Add work group</span>
                </button>
                <div className="board-add-work-group-content"></div>
            </div>
        </div>
    );

}
export default BoardGroup;