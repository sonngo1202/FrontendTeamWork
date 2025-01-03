import { useEffect, useState } from 'react';
import '../assets/css/DatePicker.css';

const DatePicker = ({ date, setDate }) => {
    const [inputDate, setInputDate] = useState(convertDateToDDMMYYYY(date) || '');
    const [weekOfMonth, setWeekOfMonth] = useState([]);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [initDate, setInitDate] = useState(date ? new Date(date) : new Date());

    const handleInputChange = (e) => {
        const input = e.target.value;
        setInputDate(input);

        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        if (dateRegex.test(input)) {
            const [day, month, year] = input.split('/');
            const formattedDate = `${year}-${month}-${day}`;
            setDate(formattedDate);
        }

        if (!input) {
            setDate(null);
        }
    };

    function convertDateToDDMMYYYY(date) {
        if (date) {
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`;
        }
    }

    function getWeeksOfMonth(year, month) {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const startDayOfWeek = firstDayOfMonth.getDay();
        const endDayOfWeek = lastDayOfMonth.getDay();

        const startDate = new Date(firstDayOfMonth);
        if (startDayOfWeek !== 1) {
            startDate.setDate(firstDayOfMonth.getDate() - (startDayOfWeek === 0 ? 6 : startDayOfWeek - 1));
        }

        const endDate = new Date(lastDayOfMonth);
        if (endDayOfWeek !== 0) {
            endDate.setDate(lastDayOfMonth.getDate() + (7 - endDayOfWeek));
        }

        const weeks = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                const formattedDate = formatDate(currentDate);
                const isCurrently = isSameDay(currentDate, new Date());

                week.push({
                    name: currentDate.getDate(),
                    value: formattedDate,
                    isCurrently: isCurrently,
                    isDateBeforeToday: isDateBeforeToday(currentDate, new Date()),
                    isSelected: (date ? isSameDay(currentDate, new Date(date)) : false)
                });

                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeks.push(week);
        }
        setWeekOfMonth(weeks);
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function isSameDay(date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

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
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const currentMonth = initDate.getMonth();
        const currentYear = initDate.getFullYear();

        setMonth(monthNames[currentMonth]);
        setYear(currentYear);

        getWeeksOfMonth(currentYear, currentMonth);
    }, [initDate]);

    const titleWeeks = [
        { id: 1, name: 'M' },
        { id: 2, name: 'T' },
        { id: 3, name: 'W' },
        { id: 4, name: 'T' },
        { id: 5, name: 'F' },
        { id: 6, name: 'S' },
        { id: 7, name: 'S' },
    ];

    const handlePreMonth = () => {
        const newDate = new Date(initDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setInitDate(newDate);
    }

    const handleNextMonth = () => {
        const newDate = new Date(initDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setInitDate(newDate);
    }

    return (
        <div className='container-date-picker'>
            <div className='date-picker-header'>
                <input placeholder='dd/mm/yyyy' value={inputDate} onChange={(e) => handleInputChange(e)} ></input>
            </div>
            <div className='data-picker-content'>
                <div className='data-picker-content-title'>
                    <button onClick={handlePreMonth}><i className="fas fa-chevron-left"></i></button>
                    <div className='data-picker-content-title-content'>
                        <span>{month} {year}</span>
                    </div>
                    <button onClick={handleNextMonth}><i className="fas fa-chevron-right"></i></button>
                </div>
                <div className='data-picker-content-main'>
                    <div className='data-picker-content-main-item-title'>
                        {titleWeeks.map((item) =>
                            <div key={item.id} className='data-picker-item-title-wrap'>
                                <span>{item.name}</span>
                            </div>
                        )}
                    </div>
                    {weekOfMonth.map((itemW, index) =>
                        <div key={index} className='data-picker-content-main-item'>
                            {itemW.map((itemD, index) =>
                                <div key={index} className={`data-picker-item-wrap ${itemD.isCurrently ? 'active' : ''} ${itemD.isSelected ? 'selected' : ''}`} onClick={() => {setDate(itemD.value); setInputDate(convertDateToDDMMYYYY(itemD.value))}}>
                                    <span className={`${itemD.isDateBeforeToday ? 'active' : ''}`}>{itemD.name}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default DatePicker;