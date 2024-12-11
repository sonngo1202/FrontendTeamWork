import { useEffect, useState } from 'react';
import '../assets/css/TaskDetail.css';
import Cookies from 'js-cookie';
import { detail } from '../services/taskService';
import { useNavigate, useParams } from 'react-router-dom';

const TaskDetail = ({ user, id, idWG, idG, onClose }) => {
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const { idTask } = useParams();
    const [isEdit, setIsEdit] = useState(true);

    const getColor = (item) => {
        if (item?.status?.name === 'Completed') {
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

    const fetchData = async () => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            try {
                const taskData = await detail(id, idWG, idG, accessToken);
                setTask(taskData);
                console.log(taskData)
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [idTask, id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    }

    const handleDocumentClick = (url, fileType) => {
        if (fileType === 'pdf') {
            const pdfWindow = window.open(url, '_blank');
            if (pdfWindow) {
                pdfWindow.focus();
            }
        } else if (fileType === 'txt') {
            const txtWindow = window.open(url, '_blank');
            if (txtWindow) {
                txtWindow.focus();
            }
        }
    };

    const processContent = (comment) => {
        let words = comment?.content.split(' ');
        comment?.listTag.sort((a, b) => b.position - a.position);

        comment?.listTag.forEach(tag => {
            const position = parseInt(tag?.position, 10);
            const userName = tag?.user.fullName;
            const userImage = tag?.user.picture;

            const link = `
                <a href="#">
                    <img src="https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${userImage}?alt=media" alt="${userName}" />
                    <span>${userName}</span>
                </a>
            `;

            words.splice(position, 0, link);
        });

        return words.map(word => {
            if (word.startsWith('<a') && word.endsWith('</a>')) {
                return word;
            } else {
                return `<span>${word}</span>`;
            }
        }).join(' ');
    };


    const handleCloseTask = () => {
        if(onClose){
            onClose();
        }else{
            navigate(`/group/${idG}/board`);
        }
    }

    return (
        <div className='container-task-detail'>
            <div className='task-detail-header'>
                <div className='task-detail-header-left'>
                    <span>{task?.status.name}</span>
                </div>
                <div className='task-detail-header-right'>
                    <button><i className="fas fa-upload"></i></button>
                    <button><i className="fas fa-pen"></i></button>
                    <button><i className="fas fa-arrow-right" onClick={handleCloseTask}></i></button>
                </div>
            </div>
            <div className='task-detail-info'>
                <div className='task-detail-info-base'>
                    <div className={`task-detail-name ${isEdit ? '' : 'edit'}`}>
                        <textarea rows={1} value={task?.name} disabled={isEdit}></textarea>
                    </div>
                    <div className='task-detail-other'>
                        <div className='task-detail-item'>
                            <span className='task-detail-item-title'>Assignee</span>
                            <img
                                src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${task?.assignee.picture}?alt=media`}
                                alt="Avatar"
                            />
                            <span>{task?.assignee.fullName}</span>
                        </div>
                        <div className={`task-detail-item ${task?.priorityLevel.id === 1 ? 'priority-hight' :
                            task?.priorityLevel.id === 2 ? 'priority-medium' : 'priority-low'}`}>
                            <span className='task-detail-item-title'>Priority level</span>
                            <div className='icon-container'>
                                <i className="fas fa-level-up-alt"></i>
                            </div>
                            <span className='task-detail-item-content'>{task?.priorityLevel.name}</span>
                        </div>
                        <div className='task-detail-item'>
                            <span className='task-detail-item-title'>Start date</span>
                            <div className='icon-container'>
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                            <span>{formatDate(task?.startDate)}</span>
                        </div>
                        <div className='task-detail-item'>
                            <span className='task-detail-item-title'>Due date</span>
                            <div className='icon-container' style={{ border: `0.3px solid ${getColor(task)}` }}>
                                <i className="fas fa-calendar-alt" style={{ color: getColor(task) }}></i>
                            </div>
                            <span className='task-detail-item-content' style={{ color: getColor(task) }}>{formatDate(task?.endDate)}</span>
                        </div>
                        {task?.completedDate && (<div className={`task-detail-item`}>
                            <span className='task-detail-item-title'>Last completed</span>
                            <div className='icon-container'>
                                <i className="fas fa-check"></i>
                            </div>
                            <span className='task-detail-item-content'>{formatDate(task?.completedDate)}</span>
                        </div>)}
                        <div className={`task-detail-item-des ${task?.des ? '' : 'empty'}`}>
                            <span>Description</span>
                            <textarea rows={8} value={task?.des ? task?.des : 'Bạn muốn mô tả nhiệm vụ này ?'} disabled={isEdit}></textarea>
                        </div>
                    </div>
                </div>
                <div className='task-detail-subtask'>
                    {task?.listSubTask.length > 0 && (<div className='task-detail-list-subtask'>
                        <div className='task-detail-item-subtask'>
                            <span>Subtask</span>
                        </div>
                        {task.listSubTask.map((item =>
                            <div key={item.id} className="task-detail-item-subtask">
                                <div className="task-detail-item-subtask-title">
                                    <span className={`task-detail-item-subtask-status ${item.status.id === 1 ? 'status-in-progress' :
                                        item.status.id === 2 ? 'status-not-started' : 'status-completed'
                                        }`}>●</span>
                                    <span className="task-detail-item-subtask-name">{item.name}</span>
                                </div>
                                <div className="task-detail-item-subtask-deadline">
                                    <span style={{ color: getColor(item) }}>{formatDate(item.endDate)}</span>
                                    <img
                                        src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item.assignee.picture}?alt=media`}
                                        alt="Avatar"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>)}
                    <button className="add-subtask">
                        <i className="fas fa-plus"></i>
                        <span>Add subtask</span>
                    </button>
                </div>
                <div className='task-detail-file'>
                    {task?.listDocument.map((item) =>
                        <div key={item?.id} className='task-detail-item-file' onClick={() => handleDocumentClick(item?.url, getFileExtension(item?.name))}>
                            <div className={`task-detail-item-file-icon ${getFileExtension(item?.name) === 'pdf' ? 'pdf' : 'txt'}`}>
                                {getFileExtension(item?.name) === 'pdf' ? (<i className='fas fa-file-pdf'></i>) : (<i className='fas fa-file-alt'></i>)}
                            </div>
                            <div className='task-detail-item-file-info'>
                                <span>{item?.name}</span>
                                <span className='task-detail-item-file-type'>{getFileExtension(item?.name) === 'pdf' ? 'PDF' : 'Word Document'}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className={`task-detail-comment ${task?.completedDate ? '' : 'not-completed'}`}>
                    <div className='task-detail-comment-title'>
                        <span>Comments</span>
                    </div>
                    {task?.listComment.length > 0 ? (
                        <div className='task-detail-list-comment'>
                            {task?.listComment.map((item) =>
                                <div key={item?.id} className='task-detail-item-comment'>
                                    <div className='task-detail-item-comment-creator'>
                                        <img
                                            src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item?.creator.picture}?alt=media`}
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className='task-detail-item-comment-content'>
                                        <span className='task-detail-item-comment-content-top'>{item?.creator.fullName}</span>
                                        <div className='task-detail-item-comment-content-bottom'
                                            dangerouslySetInnerHTML={{ __html: processContent(item) }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='task-detail-comment-empty'>
                            <span>Chưa có bình luận nào</span>
                        </div>
                    )}
                </div>
            </div>
            <div className='task-detail-add-comment'>
                <img
                    src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${user?.picture}?alt=media`}
                    alt="Avatar"
                />
                <textarea rows={8} placeholder="Nhập nội dung comment" ></textarea>
            </div>
        </div>
    );
};
export default TaskDetail;