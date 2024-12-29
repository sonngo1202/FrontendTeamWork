import Cookies from 'js-cookie';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import '../assets/css/ModalTask.css';
import DatePicker from './DatePicker';
import CustomOption from './CustomOption';
import SearchMember from './SearchMember';
import { add, edit } from '../services/taskService';

const ModalTask = ({ setClose, task, group, workGroup, parentTask, fetchDataGroup, fetchDataTask }) => {
    const [name, setName] = useState(task?.name || '');
    const [startDate, setStartDate] = useState(task?.startDate || '');
    const [endDate, setEndDate] = useState(task?.endDate || '');
    const [assignee, setAssignee] = useState(task?.assignee || null);
    const [des, setDes] = useState(task?.des || '');
    const [priorityLevel, setPriorityLevel] = useState(task?.priorityLevel || null);
    const [isDatePickerSOpen, setIsDatePickerSOpen] = useState(false);
    const [isDatePickerEOpen, setIsDatePickerEOpen] = useState(false);
    const [isSelectPriorityOpen, setIsSelectPriorityOpen] = useState(false);
    const [isSelectedAssigneeOpen, setIsSelectedAssigneeOpen] = useState(false);
    const formStartDateRef = useRef(null);
    const formEndDateRef = useRef(null);
    const formSelectPriorityRef = useRef(null);
    const formSelectAssigneeRef = useRef(null);

    const [checkData, setCheckData] = useState(false);

    const optionPriority = [
        { id: 1, name: 'Hight' },
        { id: 2, name: 'Medium' },
        { id: 3, name: 'Low' },
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (formStartDateRef.current && !formStartDateRef.current.contains(e.target)) {
                setIsDatePickerSOpen(false);
            }
            if (formEndDateRef.current && !formEndDateRef.current.contains(e.target)) {
                setIsDatePickerEOpen(false);
            }
            if (formSelectPriorityRef.current && !formSelectPriorityRef.current.contains(e.target)) {
                setIsSelectPriorityOpen(false);
            }
            if (formSelectAssigneeRef.current && !formSelectAssigneeRef.current.contains(e.target)) {
                setIsSelectedAssigneeOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    function isDateBeforeToday(date1, date2) {
        if (date1.getFullYear() < date2.getFullYear()) {
            return true;
        }
        if (date1.getFullYear() === date2.getFullYear() && date1.getMonth() < date2.getMonth()) {
            return true;
        }
        if (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() < date2.getDate()) {
            return true;
        }
        return false;
    }

    useEffect(() => {
        if (name && assignee && priorityLevel && startDate && endDate && !isDateBeforeToday(new Date(endDate), new Date(startDate))) {
            setCheckData(true);
        } else {
            setCheckData(false);
        }
    }, [name, assignee, priorityLevel, startDate, endDate]);

    const addTask = async (accessToken) => {
        if (accessToken) {
            try {
                const data = await add(name, startDate, endDate, des, priorityLevel, assignee, parentTask, group?.id, workGroup, accessToken);
            } catch (error) {
                console.error("Failed to add task data:", error);
            }
        }
    }

    const editTask = async (accessToken) => {
        if (accessToken) {
            try {
                const data = await edit(name, startDate, endDate, des, priorityLevel, assignee, task?.id, group?.id, workGroup, accessToken);
            } catch (error) {
                console.error("Failed to edit task data:", error);
            }
        }
    }

    const handleAdd = () => {
        const accessToken = Cookies.get('accessToken');

        addTask(accessToken)
            .then(() => {
                return fetchDataGroup();
            })
            .then(() => {
                if (fetchDataTask) {
                    return fetchDataTask();
                }
            })
            .catch((error) => {
                console.error("Failed to add task:", error);
            });
        setClose(false);
    }

    const handleEdit = () => {
        const accessToken = Cookies.get('accessToken');

        editTask(accessToken)
            .then(() => {
                return fetchDataGroup();
            })
            .then(() => {
                if (fetchDataTask) {
                    return fetchDataTask();
                }
            })
            .catch((error) => {
                console.error("Failed to edit task:", error);
            });
        setClose(false);
    }

    return ReactDOM.createPortal(
        <div className={`modal-task-detail-overlay`}>
            <div className='container-modal-task-detail'>
                <div className='modal-task-detail-header'>
                    <span>{task ? 'Edit task' : 'Add task'}</span>
                    <button onClick={() => setClose(false)}><i className='fas fa-times'></i></button>
                </div>
                <div className='modal-task-detail-content'>
                    <input type='type' value={name} onChange={(e) => setName(e.target.value)} placeholder='Write a task name' required></input>
                    <div className='modal-task-detail-item'>
                        <span>Assignee</span>
                        <div className='modal-task-detail-item-action' ref={formSelectAssigneeRef} onClick={() => setIsSelectedAssigneeOpen(true)}>
                            {!assignee && <div className="icon-wrapper">
                                <i className="fas fa-user"></i>
                            </div>}
                            {assignee && <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${assignee.picture}?alt=media`} alt="Avatar-User" />}
                            <div className={`item-name ${assignee ? 'active' : ''}`}><span>{assignee ? assignee?.fullName : 'No assignee'}</span></div>
                            {isSelectedAssigneeOpen && <SearchMember data={group?.listUserGroup} setSelected={setAssignee} />}
                        </div>
                    </div>
                    <div className='modal-task-detail-item'>
                        <span>Priority level</span>
                        <div className='modal-task-detail-item-action' ref={formSelectPriorityRef} onClick={() => setIsSelectPriorityOpen(true)}>
                            <div className={`icon-wrapper ${!priorityLevel ? '' : priorityLevel?.id === 1 ? 'priority-hight' :
                                priorityLevel?.id === 2 ? 'priority-medium' : 'priority-low'}`}>
                                <i className="fas fa-level-up-alt"></i>
                            </div>
                            <div className={`item-name ${!priorityLevel ? '' : priorityLevel?.id === 1 ? 'priority-hight' :
                                priorityLevel?.id === 2 ? 'priority-medium' : 'priority-low'}`}><span>{priorityLevel ? priorityLevel?.name : 'No priority level'}</span></div>
                            {isSelectPriorityOpen && <CustomOption data={optionPriority} setSelected={setPriorityLevel} selected={priorityLevel} />}
                        </div>
                    </div>
                    <div className='modal-task-detail-item'>
                        <span>Start date</span>
                        <div className='modal-task-detail-item-action' ref={formStartDateRef} onClick={() => setIsDatePickerSOpen(true)}>
                            <div className={`icon-wrapper ${startDate ? 'active' : ''}`}>
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                            <div className={`item-name ${startDate ? 'active' : ''}`}><span>{startDate ? formatDate(startDate) : 'No start date'}</span></div>
                            {isDatePickerSOpen && <DatePicker date={startDate} setDate={setStartDate} />}
                        </div>
                    </div>
                    <div className='modal-task-detail-item'>
                        <span>End date</span>
                        <div className='modal-task-detail-item-action' ref={formEndDateRef} onClick={() => setIsDatePickerEOpen(true)}>
                            <div className={`icon-wrapper ${(endDate && isDateBeforeToday(new Date(endDate), new Date())) ? 'active-delay' : endDate ? 'active' : ''}`}>
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                            <div className={`item-name ${(endDate && isDateBeforeToday(new Date(endDate), new Date())) ? 'active-delay' : endDate ? 'active' : ''}`}><span>{endDate ? formatDate(endDate) : 'No end date'}</span></div>
                            {isDatePickerEOpen && <DatePicker date={endDate} setDate={setEndDate} />}
                        </div>
                    </div>
                    <div className='modal-task-detail-item-des'>
                        <span>Description</span>
                        <textarea rows={8} value={des ? des : ''} placeholder='Bạn muốn mô tả nhiệm vụ này ?' onChange={(e) => setDes(e.target.value)}></textarea>
                    </div>
                    {isDateBeforeToday(new Date(endDate), new Date(startDate)) && <span className='error'>End date cannot be earlier than start date.</span>}
                    <button className={`btn-save ${checkData ? 'btn-active' : ''}`} onClick={task ? handleEdit : handleAdd}>Save</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
export default ModalTask;