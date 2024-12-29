import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import '../assets/css/BoardGroup.css'
import { useEffect, useRef, useState } from "react";
import TaskDetail from '../components/TaskDetail';
import ModalWorkGroup from "./ModalWorkGroup";
import OptionWG from "./OptionWG";
import { deleteWG } from '../services/workGroupService';
import Cookies from 'js-cookie';
import ModalConfirm from "./ModalConfirm";
import ModalTask from "./ModalTask";
import OptionTask from "./OptionTask";

const isManagerOfGroup = (user, group) => {
    if (!user || !user.roles || !group) {
        return false;
    }

    return user.roles.some(userGroup =>
        userGroup.group.id === group.id && userGroup.role === 'MANAGER'
    );
};

const BoardGroup = () => {
    const { group, user, fetchDataGroup } = useOutletContext();
    const navigate = useNavigate();
    const [openSubTask, setOpenSubTask] = useState(null);
    const [isWGOpen, setIsWGOpen] = useState(false);
    const [selectedOptionItem, setSelectedOptionItem] = useState(null);
    const [showOption, setShowOption] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showActionTask, setShowActionTask] = useState(false);
    const [selectedWG, setSelectedWG] = useState(null);
    const [editedTask, setEditedTask] = useState(null);
    const [selectedParentTask, setSelectedParentTask] = useState(null);
    const taskRef = useRef(null);
    const itemWGRef = useRef([]);
    const optionWGRef = useRef(null);

    const { idTask, idWG, id } = useParams();
    const [contextMenuTask, setContextMenuTask] = useState({ visible: false, x: 0, y: 0 });
    const contextMenuTaskRef = useRef(null);

    const handleCallTaskFunction = () => {
        if (taskRef.current) {
            taskRef.current.fetchData();
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                optionWGRef.current && !optionWGRef.current.contains(e.target) &&
                !itemWGRef.current.some(ref => ref && ref.contains(e.target))
            ) {
                setShowOption(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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

    const handleOpenListSubTask = (item) => {
        if(item?.id === openSubTask?.id){
            setOpenSubTask(null);
            return;
        }
        setOpenSubTask(item);
    }

    const handleOpenSubTask = (task, workGroup) => {
        navigate(`/group/${id}/board/${workGroup.id}/tasks/${task.id}`);
    }

    const handleOpenTask = (event, task, workGroup) => {
        const target = event.target;
        if (target.closest('.board-item-subtask') || target.closest('.board-item-task-count') || target.closest('.add-subtask')) {
            return;
        }
        navigate(`/group/${id}/board/${workGroup.id}/tasks/${task.id}`);
    }

    const deleteWorkGroup = async () => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            try {
                const data = await deleteWG(group?.id, selectedOptionItem?.id, accessToken);
                if (data) {
                    fetchDataGroup();
                    setShowOption(false);
                    setShowConfirm(false);
                    setSelectedOptionItem(null);
                } else {
                    console.error("Failed to delete work group: Response was not true.");
                }
            } catch (error) {
                console.error("Failed to delete work group:", error);
            }
        }
    }

    const handleOutsideTaskClick = (e) => {
        if (contextMenuTaskRef.current && !contextMenuTaskRef.current.contains(e.target)) {
            setContextMenuTask({ ...contextMenuTask, visible: false });
        }
    };

    useEffect(() => {
        if (contextMenuTask.visible) {
            document.addEventListener("mousedown", handleOutsideTaskClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideTaskClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideTaskClick);
        };
    }, [contextMenuTask.visible]);

    const handleContextMenuTask = (e, itemT, itemWG) => {
        e.stopPropagation();
        e.preventDefault();
        setEditedTask(itemT);
        setSelectedWG(itemWG.id);
        setContextMenuTask({
            visible: true,
            x: e.pageX,
            y: e.pageY,
        });
    }

    return (
        <div className={`container-board ${idTask ? 'selected' : ''}`}>
            {group && group.listWorkGroup && group.listWorkGroup.map((item, index) =>
                <div key={index} className={`board-item-work-group`}>
                    <div className="board-item-work-group-header">
                        <div className="board-title">
                            <span className="board-title-name">{item.name}</span>
                            <span className="board-title-count">{item?.listTask.length}</span>
                        </div>
                        {isManagerOfGroup(user, group) && <div className="board-select" onClick={() => {
                            setSelectedOptionItem(item);
                            setShowOption(true);
                        }}>
                            <button onClick={() => {
                                setShowActionTask(true);
                                setSelectedWG(item.id);
                                setEditedTask(null);
                                setSelectedParentTask(null);
                            }}><i className="fas fa-plus"></i></button>
                            <button ref={(el) => itemWGRef.current[index] = el}><i className="fas fa-ellipsis-h"></i></button>
                            {showOption && selectedOptionItem?.id === item?.id && <OptionWG optionWGRef={optionWGRef} openWG={setIsWGOpen} showConfirm={setShowConfirm} workGroup={selectedOptionItem} deleteWG={deleteWorkGroup} />}
                        </div>}
                    </div>
                    <div className={`board-item-work-group-content ${item?.listTask.length > 0 ? 'list' : 'empty'}`}>
                        {item?.listTask.length > 0 && item.listTask.map((itemTask =>
                            <div key={itemTask.id} className={`board-item-task ${String(idTask) === String(itemTask.id) ? 'selected' : ''}`} onClick={(event) => handleOpenTask(event, itemTask, item)}
                                onContextMenu={(e) => handleContextMenuTask(e, itemTask, item)}>
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
                                        <span style={{ color: getColor(itemTask) }}>{formatDate(itemTask.endDate)}</span>
                                    </div>
                                    {itemTask?.listSubTask.length > 0 && (<button className={`board-item-task-count ${openSubTask?.id === itemTask?.id ? 'selected' : ''}`} onClick={() => handleOpenListSubTask(itemTask)}>
                                        <span>{itemTask.listSubTask.length}</span>
                                        <i className="fas fa-sitemap"></i>
                                        <i className={`dropdown-icon ${openSubTask?.id === itemTask?.id ? 'fas fa-caret-down' : 'fa fa-caret-right'}`}></i>
                                    </button>)}
                                </div>
                                {openSubTask?.id === itemTask?.id && itemTask.listSubTask.length > 0 && <div className="board-subtask">
                                    {itemTask.listSubTask.map((itemSubTask =>
                                        <div key={itemSubTask.id} className={`board-item-subtask ${String(idTask) === String(itemSubTask.id) ? 'selected' : ''}`} onClick={() => handleOpenSubTask(itemSubTask, item)}
                                            onContextMenu={(e) => handleContextMenuTask(e, itemSubTask, item)}>
                                            <div className="board-item-subtask-title">
                                                <span className={`board-subtask-status ${itemSubTask.status.id === 1 ? 'status-in-progress' :
                                                    itemSubTask.status.id === 2 ? 'status-not-started' : 'status-completed'
                                                    }`}>●</span>
                                                <span className="board-task-name">{itemSubTask.name}</span>
                                            </div>
                                            <div className="board-item-subtask-deadline">
                                                <span style={{ color: getColor(itemSubTask) }}>{formatDate(itemSubTask.endDate)}</span>
                                                <img
                                                    src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${itemSubTask.assignee.picture}?alt=media`}
                                                    alt="Avatar"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {isManagerOfGroup(user, group) && <button className="add-subtask" onClick={() => {
                                        setShowActionTask(true);
                                        setSelectedWG(item.id);
                                        setEditedTask(null);
                                        setSelectedParentTask(itemTask);
                                    }}>
                                        <i className="fas fa-plus"></i>
                                        <span>Add subtask</span>
                                    </button>}
                                </div>}
                            </div>
                        ))}
                        {isManagerOfGroup(user, group) && <button className="add-task" onClick={() => {
                            setShowActionTask(true);
                            setSelectedWG(item.id);
                            setEditedTask(null);
                            setSelectedParentTask(null);
                        }}>
                            <i className="fas fa-plus"></i>
                            <span>Add task</span>
                        </button>}
                    </div>
                </div>
            )}
            {isManagerOfGroup(user, group) && <div className="board-add-work-group" onClick={() => { setIsWGOpen(true); setSelectedOptionItem(null); }}>
                <button className="add-work-group">
                    <i className="fas fa-plus"></i>
                    <span>Add work group</span>
                </button>
                <div className="board-add-work-group-content"></div>
            </div>}
            {idTask && (<TaskDetail ref={taskRef} user={user} id={idTask} idWG={idWG} idG={id} fetchDataGroup={fetchDataGroup} group={group} />)}
            {!isManagerOfGroup(user, group) && group?.listWorkGroup.length <= 0 && <div className="board-empty">
                <span>There are currently no tasks.</span>
            </div>}
            {isWGOpen && (<ModalWorkGroup setClose={setIsWGOpen} group={group} fetchDataGroup={fetchDataGroup} workGroup={selectedOptionItem} />)}
            {showConfirm && <ModalConfirm message={'Warning: This work group contains assigned tasks. Deleting it will result in the removal of all its tasks. Do you want to proceed?'} actionCancel={setShowConfirm} actionConfirm={deleteWorkGroup} />}
            {showActionTask && <ModalTask setClose={setShowActionTask} group={group} task={editedTask} workGroup={selectedWG} parentTask={selectedParentTask} fetchDataGroup={fetchDataGroup} fetchDataTask={handleCallTaskFunction} />}
            {contextMenuTask.visible &&
                <OptionTask contextMenuRef={contextMenuTaskRef} user={user} group={group} workGroup={selectedWG} task={editedTask} contextMenu={contextMenuTask}
                    setContextMenu={setContextMenuTask} setIsEditTaskOpen={setShowActionTask} fetchDataGroup={fetchDataGroup} idTask={idTask} />}
        </div>
    );

}
export default BoardGroup;