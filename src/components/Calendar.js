import { useOutletContext } from 'react-router-dom';
import '../assets/css/Calendar.css';
import { useState } from 'react';
import TaskDetail from '../components/TaskDetail';

const Calendar = () => {
    const { user, listTask, weekDays } = useOutletContext();
    const [selectedItem, setSelectedItem] = useState(null);

    const isDateInRange = (date, startDate, endDate) => {
        const d = new Date(date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return d >= start && d <= end;
    };

    const handleOpenTask = (item) => {
        setSelectedItem(item);
    }

    const handleCloseTask = () => {
        setSelectedItem(null);
    }

    return (
        <div className='container-calendar'>
            {weekDays && weekDays.map((item, index) =>
                <div key={index} className='calendar-item'>
                    <div className='calendar-item-header'>
                        <span className='calendar-item-header-name'>{item.name}</span>
                        <span className={`calendar-item-header-day ${(
                            new Date(item.value).getFullYear() === new Date().getFullYear() &&
                            new Date(item.value).getMonth() === new Date().getMonth() &&
                            new Date(item.value).getDate() === new Date().getDate()
                        )
                            ? 'active'
                            : ''
                            }`}
                        >
                            {item.day}
                        </span>
                    </div>
                    <div className='calendar-item-content'>
                        {listTask.filter(task => isDateInRange(item.value, task.startDate, task.endDate)).map((itemTask) =>
                            <div className={`calendar-item-task ${itemTask.status.name === 'Completed' ? 'completed' : ''}`} onClick={() => handleOpenTask(itemTask)}>
                                <span className={`calendar-item-task-status ${itemTask.status.id === 1 ? 'status-in-progress' :
                                    itemTask.status.id === 2 ? 'status-not-started' : 'status-completed'
                                    }`}>●</span>
                                <span className="calendar-item-task-name">{itemTask.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {selectedItem && <TaskDetail user={user} id={selectedItem?.id} idWG={selectedItem?.workGroup.id} idG={selectedItem?.workGroup.group.id} onClose={handleCloseTask} />}
        </div>
    );
}
export default Calendar;