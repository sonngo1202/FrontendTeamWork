import { useEffect, useState } from "react";
import { getByUser } from "../services/taskService";
import Cookies from 'js-cookie';
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import '../assets/css/MyTask.css';

const MyTask = () => {
    const location = useLocation();
    const { user } = useOutletContext();
    const navigate = useNavigate();
    const [listTask, setListTask] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const isBoardPage = location.pathname.includes('/board');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekDays, setWeekDays] = useState([]);

    const groupItems = [
        { name: "Board", icon: "fas fa-columns", path: `/my-task/board` },
        { name: "Calendar", icon: "fas fa-calendar", path: `/my-task/calendar` },
    ];

    const optionItems = [
        { name: "Filter", icon: "fas fa-filter" },
        { name: "Sort", icon: "fas fa-sort" }
    ];

    const handleSelectGroupClick = (item) => {
        setSelectedItem(item.name);
        navigate(item.path);
    }

    const fetchData = async () => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            try {
                const data = await getByUser(accessToken);
                setListTask(data);
                console.log(data)
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const activeItem = groupItems.find(item => location.pathname.includes(item.path));
        if (activeItem) {
            setSelectedItem(activeItem.name);
        }
    }, [location]);

    function getCurrentMonthYear(date) {
        const options = { month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function getWeekDates(date) {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1); 
        const weekDates = [];
        const weekDayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

        for (let i = 0; i < 7; i++) {
            const current = new Date(startOfWeek);
            current.setDate(startOfWeek.getDate() + i);

            const formattedDate = current.toISOString().split('T')[0]; 

            const day = current.getDate().toString().padStart(2, '0'); 
            weekDates.push({
                id: i + 1, 
                name: weekDayNames[i],
                day: day, 
                value: formattedDate,
            });
        }
        return weekDates;
    }

    useEffect(() => {
        console.log(getWeekDates(currentDate));
        setWeekDays(getWeekDates(currentDate));
    }, [currentDate]);

    const handlePreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    }

    return (
        <div className="container-group">
            <div className="group-header">
                <div className="group-title">
                    <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${user?.picture}?alt=media`} alt="Avatar-User" />
                    <span className="group-name">My tasks</span>
                </div>
                <div className="group-select">
                    {groupItems.map((item) =>
                        <button className={`${selectedItem === item.name ? 'selected' : ''}`} key={item.name} onClick={() => handleSelectGroupClick(item)}>
                            <i className={`fas ${item.icon}`}></i>
                            <span>{item.name}</span>
                        </button>
                    )}
                </div>
            </div>
            {isBoardPage && (<div className="group-filter">
                {optionItems.map((item) =>
                    <button key={item.name} >
                        <i className={`fas ${item.icon}`}></i>
                        <span>{item.name}</span>
                    </button>
                )}
            </div>)}
            {!isBoardPage && (<div className="my-task-week-month">
                <p onClick={handleToday}>Today</p>
                <button onClick={handlePreviousWeek}><i className="fas fa-chevron-left"></i></button>
                <button onClick={handleNextWeek}><i className="fas fa-chevron-right"></i></button>
                <span>{getCurrentMonthYear(currentDate)}</span>
            </div>)}
            <Outlet context={{ user, listTask, weekDays }} />
        </div>
    );
}
export default MyTask;