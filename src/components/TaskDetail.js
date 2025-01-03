import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import '../assets/css/TaskDetail.css';
import Cookies from 'js-cookie';
import { detail } from '../services/taskService';
import { useNavigate, useParams } from 'react-router-dom';
import ModalTask from './ModalTask';
import CustomOption from './CustomOption';
import { updateStatus } from '../services/taskService';
import { upload, deleteF } from '../services/documentService';
import ModalError from './ModalError';
import OptionTask from './OptionTask';
import ModalConfirm from './ModalConfirm';
import { Mention, MentionsInput } from 'react-mentions';
import { add, deleteC } from '../services/commentService';
import EditComment from './EditComment';

const isManagerOfGroup = (user, group) => {
    if (!user || !user.roles || !group) {
        return false;
    }

    return user.roles.some(userGroup =>
        userGroup.group.id === group.id && userGroup.role === 'MANAGER'
    );
};

const isAssignee = (user, task) => {
    if (!user || !task) {
        return false;
    }

    return user.id === task.assignee.id;
}

const TaskDetail = forwardRef(({ user, id, idWG, idG, onClose, fetchDataGroup, group }, ref) => {
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const { idTask } = useParams();
    const [isModalTaskOpen, setIsModalTaskOpen] = useState(false);
    const [parentTask, setParentTask] = useState(null);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const fileInputRef = useRef(null);
    const optionStatusRef = useRef(null);
    const [showErr, setShowErr] = useState(false);
    const [editedTask, setEditedTask] = useState(null);
    const [contextMenuTask, setContextMenuTask] = useState({ visible: false, x: 0, y: 0 });
    const contextMenuTaskRef = useRef(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedDeleteFile, setSelectedDeleteFile] = useState(null);

    const optionStatus = [
        { id: 1, name: 'In Progress' },
        { id: 2, name: 'Not Started' },
        { id: 3, name: 'Completed' },
    ]

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
                setSelectedStatus(taskData.status);
                console.log(taskData)
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, [idTask, id]);

    useImperativeHandle(ref, () => ({
        fetchData
    }));

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (optionStatusRef.current && !optionStatusRef.current.contains(e.target)) {
                setIsStatusOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleCopyLink = () => {
        const linkToCopy = `http://localhost:3000/group/${idG}/board/${idWG}/tasks/${idTask}`;
        navigator.clipboard.writeText(linkToCopy)
            .then(() => {
                console.log('Link copied to clipboard');
            })
            .catch((error) => {
                console.error('Failed to copy link: ', error);
            });
    };

    const handleCloseTask = () => {
        if (onClose) {
            onClose();
        } else {
            navigate(`/group/${idG}/board`);
        }
    }

    const report = async (accessToken) => {
        if (accessToken) {
            try {
                const data = await updateStatus(task?.id, group?.id, idWG, selectedStatus?.id, accessToken);
            } catch (error) {
                console.error("Failed to update status:", error);
            }
        }
    }

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        if (task?.status.id !== selectedStatus?.id) {
            report(accessToken)
                .then(() => {
                    return fetchDataGroup();
                })
                .then(() => {
                    return fetchData();
                })
                .catch((error) => {
                    console.error("Failed to update status:", error);
                });
            setIsStatusOpen(false);
        }
    }, [selectedStatus]);

    const uploadFile = async (accessToken, file) => {
        if (accessToken) {
            try {
                const rs = await upload(task?.id, group?.id, idWG, file, accessToken);
            } catch (error) {
                console.error("Failed to upload file:", error);
            }
        }
    }

    const handleSelectedFile = (e) => {
        const file = e.target.files[0];
        const validFileTypes = ['application/pdf', 'text/plain'];

        if (file) {
            if (!validFileTypes.includes(file.type)) {
                setShowErr(true);
                e.target.value = null;
                return;
            }
            const accessToken = Cookies.get('accessToken');

            uploadFile(accessToken, file)
                .then(() => {
                    return fetchData();
                })
                .catch((error) => {
                    console.error("Failed to upload file:", error);
                });
        }
    }

    const handleButtonFile = () => {
        fileInputRef.current.click();
    };

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

    const handleContextMenuTask = (e, itemT) => {
        e.stopPropagation();
        e.preventDefault();
        setEditedTask(itemT);
        setContextMenuTask({
            visible: true,
            x: e.pageX - 185,
            y: e.pageY,
        });
    }

    const deleteFile = async (accessToken, idFile) => {
        if (accessToken) {
            try {
                const rs = await deleteF(task?.id, group?.id, idWG, idFile, accessToken);
            } catch (error) {
                console.error("Failed to delete file:", error);
            }
        }
    }

    const actionDeleteFile = () => {
        const accessToken = Cookies.get('accessToken');
        deleteFile(accessToken, selectedDeleteFile?.id)
            .then(() => {
                return fetchData();
            })
            .catch((error) => {
                console.error("Failed to delete file:", error);
            });
        setSelectedDeleteFile(null);
        setShowConfirm(false);
    }

    const handleDeleteFile = (e, item) => {
        e.stopPropagation();
        setSelectedDeleteFile(item);
        setShowConfirm(true);
    }

    const [comment, setComment] = useState('');
    const commentRefs = useRef({});
    const [mentionMembers, setMentionMembers] = useState([]);

    useEffect(() => {
        if (group && user) {
            setMentionMembers(
                group?.listUserGroup
                    .filter((ug) => ug.user.id !== user?.id)
                    .map((ug) => ({
                        id: ug.user.id,
                        display: ug.user.fullName,
                        avatar: ug.user.picture,
                        email: ug.user.email
                    }))
            );
        }
    }, [group, user]);

    const renderSuggestion = (entry, search, highlightedDisplay, index) => {
        return (
            <div key={entry.id} className="mention-suggestion">
                <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${entry.avatar}?alt=media`} alt={entry.display} className="mention-avatar" />
                <div className='mention-suggestion-item'>
                    <span className='mention-suggestion-name'>{highlightedDisplay}</span>
                    <span className='mention-suggestion-email'>{entry.email}</span>
                </div>
            </div>
        );
    }

    const addComment = async (accessToken, content, listTag) => {
        if (accessToken) {
            try {
                const rs = await add(task?.id, idWG, group?.id, content, listTag, accessToken);
            } catch (error) {
                console.error("Failed to add comment:", error);
            }
        }
    }

    const deleteComment = async (accessToken) => {
        if (accessToken) {
            try {
                const rs = await deleteC(task?.id, idWG, group?.id, selectedComment?.id, accessToken);
            } catch (error) {
                console.error("Failed to add comment:", error);
            }
        }
    }

    const handleAddComment = () => {
        const mentions = [];
        const regex = /@\[(.+?)\]\((.+?)\)/g;
        let match;
        let x = 0;
        while ((match = regex.exec(comment)) !== null) {
            let s = match.index - x;
            x += 6;
            let e = regex.lastIndex - x
            mentions.push({
                user: { id: match[2] },
                start: s,
                end: e,
            });
        }

        const accessToken = Cookies.get('accessToken');
        addComment(accessToken, comment.replace(/@\[(.+?)\]\((.+?)\)/g, "$1"), mentions)
            .then(() => {
                return fetchData();
            })
            .catch((error) => {
                console.error("Failed to upload file:", error);
            });
        setComment('');
    }

    const handleDeleteComment = () => {
        const accessToken = Cookies.get('accessToken');
        deleteComment(accessToken)
            .then(() => {
                return fetchData();
            })
            .catch((error) => {
                console.error("Failed to upload file:", error);
            });
    }

    const commentDisplay = (item) => {
        let formattedComment = item.content;
        let lengthDelta = 0;

        item?.listTag.forEach((mention) => {
            const adjustedStart = mention.start + lengthDelta;
            const adjustedEnd = mention.end + lengthDelta;

            const beforeMention = formattedComment.substring(0, adjustedStart);
            const mentionText = formattedComment.substring(adjustedStart, adjustedEnd);
            const afterMention = formattedComment.substring(adjustedEnd);

            const linkedMention = `<a href="#" style="color:#007BFF;">@${mentionText}</a>`;

            formattedComment = beforeMention + linkedMention + afterMention;

            lengthDelta += linkedMention.length - mentionText.length;
        });

        return formattedComment;
    };

    const formatTimeDifference = (inputDate) => {
        const now = new Date();
        const input = new Date(inputDate);

        const difference = now.getTime() - input.getTime();

        if (difference > 24 * 60 * 60 * 1000) {
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            return input.toLocaleDateString('en-US', options);
        } else if (difference > 60 * 60 * 1000) {
            const hours = Math.floor(difference / (60 * 60 * 1000));
            return `${hours}h ago`;
        } else if (difference > 60 * 1000) {
            const minutes = Math.floor(difference / (60 * 1000));
            return `${minutes}m ago`;
        } else {
            const seconds = Math.floor(difference / 1000);
            return `${seconds}s ago`;
        }
    }

    const [selectedComment, setSelectedComment] = useState(null);
    const [showEditComment, setShowEditComment] = useState(false);

    const optionsComment = [
        { name: 'Edit comment', id: 1, onClick: () => setShowEditComment(true) },
        { name: 'Delete comment', id: 2, color: 'red', onClick: () => handleDeleteComment() }
    ];

    const handleShowOptionComment = (item) => {
        if(item.id != selectedComment?.id){
            setSelectedComment(item);
        }else if(selectedComment != null){
            setSelectedComment(null);
        }else{
            setSelectedComment(item);
        }
    }

    const handleCloseEditCommet = () =>{
        setShowEditComment(false);
        setSelectedComment(null);
    }

    return (
        <div className='container-task-detail'>
            <div className='task-detail-header'>
                <div className={`task-detail-header-left ${isAssignee(user, task) ? 'active' : ''}`} onClick={() => { if (isAssignee(user, task)) { setIsStatusOpen(true) } }} ref={optionStatusRef}>
                    <span className={`${selectedStatus?.id === 1 ? 'status-in-progress' :
                        selectedStatus?.id === 2 ? 'status-not-started' : 'status-completed'
                        }`}>{selectedStatus?.name}</span>
                    {isAssignee(user, task) && <i className='dropdown-icon fas fa-chevron-down'></i>}
                    {isStatusOpen && <CustomOption data={optionStatus} selected={selectedStatus} setSelected={setSelectedStatus} />}
                </div>
                <div className='task-detail-header-right'>
                    {isAssignee(user, task) && <button onClick={handleButtonFile}><i className="fas fa-upload"> <input type='file' style={{ display: 'none' }} ref={fileInputRef} onChange={(e) => handleSelectedFile(e)} /> </i></button>}
                    <button onClick={handleCopyLink}><i className='fas fa-link'></i></button>
                    {isManagerOfGroup(user, group) && <button onClick={() => { setIsModalTaskOpen(true); setParentTask(null); setEditedTask(task) }}><i className="fas fa-pen"></i></button>}
                    <button onClick={handleCloseTask}><i className="fas fa-arrow-right"></i></button>
                </div>
            </div>
            <div className='task-detail-info'>
                <div className='task-detail-info-base'>
                    <div className={`task-detail-name`}>
                        <span>{task?.name}</span>
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
                            <textarea rows={8} value={task?.des ? task?.des : 'Hãy đi đến chỉnh sửa để mô tả nhiệm vụ này!'} disabled></textarea>
                        </div>
                    </div>
                </div>
                <div className={`task-detail-subtask ${task?.listSubTask.length <= 0 ? 'empty' : ''}`}>
                    {task?.listSubTask.length > 0 && (<div className='task-detail-list-subtask'>
                        <div className='task-detail-item-subtask'>
                            <span>Subtask</span>
                        </div>
                        {task.listSubTask.map((item =>
                            <div key={item.id} className="task-detail-item-subtask" onContextMenu={(e) => handleContextMenuTask(e, item)}
                                onClick={() => navigate(`/group/${idG}/board/${idWG}/tasks/${item?.id}`)}>
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
                    {isManagerOfGroup(user, group) && <button className="add-subtask" onClick={() => { setIsModalTaskOpen(true); setParentTask(task); setEditedTask(null) }}>
                        <i className="fas fa-plus"></i>
                        <span>Add subtask</span>
                    </button>}
                </div>
                <div className='task-detail-file'>
                    {task?.listDocument.map((item) =>
                        <div key={item?.id} className='task-detail-item-file' onClick={() => handleDocumentClick(item?.url, getFileExtension(item?.name))}>
                            <div className={`task-detail-item-file-icon ${getFileExtension(item?.name) === 'pdf' ? 'pdf' : 'txt'}`}>
                                {getFileExtension(item?.name) === 'pdf' ? (<i className='fas fa-file-pdf'></i>) : (<i className='fas fa-file-alt'></i>)}
                            </div>
                            <div className={`task-detail-item-file-info ${isAssignee(user, task) ? 'assignee' : ''}`}>
                                <span>{item?.name}</span>
                                <span className='task-detail-item-file-type'>{getFileExtension(item?.name) === 'pdf' ? 'PDF' : 'Word Document'}</span>
                            </div>
                            {isAssignee(user, task) && <div className='task-detail-delete' onClick={(e) => handleDeleteFile(e, item)}><i className='fas fa-archive'></i></div>}
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
                                <div key={item?.id} className='task-detail-item-comment-container'>
                                    <div className='task-detail-item-comment'>
                                        <div className='task-detail-item-comment-creator'>
                                            <img
                                                src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item?.creator.picture}?alt=media`}
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div className='task-detail-item-comment-content'>
                                            <span className='task-detail-item-comment-content-top'>{item?.creator.fullName} <span className='time'>● {formatTimeDifference(item.updateAt)}</span></span>
                                            <div className='task-detail-item-comment-content-bottom'
                                                dangerouslySetInnerHTML={{ __html: commentDisplay(item) }} />
                                        </div>
                                    </div>
                                    {item.creator.id === user?.id && <div className='btn-option-comment' ref={commentRefs.current[item.id]}>
                                        <button onClick={() => handleShowOptionComment(item)}><i className='fas fa-ellipsis-h'></i></button>
                                        {(selectedComment?.id === item.id) && (<div className='option-comment-container'>
                                            {optionsComment.map((option, index) =>
                                                <div key={index} className={`option-comment-item ${option.color ? 'delete' : ''}`} onClick={option.onClick}>
                                                    <span>{option.name}</span>
                                                </div>
                                            )}
                                        </div>)}
                                    </div>}
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
                <MentionsInput className='mention-input' spellCheck={false} value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Enter your comment'>
                    <Mention
                        trigger="@" data={mentionMembers} renderSuggestion={renderSuggestion} className='mention' />
                </MentionsInput>
            </div>
            <div onClick={handleAddComment} className={`btn-add-comment ${comment ? 'active' : ''}`}><div></div><button>Send</button></div>
            {isModalTaskOpen && <ModalTask setClose={setIsModalTaskOpen} group={group} task={editedTask} workGroup={idWG} parentTask={parentTask} fetchDataGroup={fetchDataGroup} fetchDataTask={fetchData} />}
            {showErr && <ModalError error={'Currently, only PDF and TXT files are supported.'} setClose={setShowErr} />}
            {contextMenuTask.visible &&
                <OptionTask contextMenuRef={contextMenuTaskRef} user={user} group={group} workGroup={idWG} task={editedTask} contextMenu={contextMenuTask}
                    setContextMenu={setContextMenuTask} setIsEditTaskOpen={setIsModalTaskOpen} fetchDataGroup={fetchDataGroup} fetchDataTask={fetchData} idTask={idTask} />}
            {showConfirm && <ModalConfirm actionCancel={setShowConfirm} actionConfirm={actionDeleteFile} message={'Do you want to delete this file?'} />}
            {showEditComment && <EditComment setClose={handleCloseEditCommet} comment={selectedComment} members={mentionMembers} renderSuggestion={renderSuggestion} idTask={task?.id} idWG={idWG} idG={group?.id} fetchData={fetchData} />}
        </div>
    );
});
export default TaskDetail;