import { useEffect, useRef, useState } from "react";
import { getByUser } from "../services/taskService";
import Cookies from 'js-cookie';
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import '../assets/css/MyTask.css';
import Filter from "./Filter";
import Sort from "./Sort";

const MyTask = () => {
    const location = useLocation();
    const { user } = useOutletContext();
    const navigate = useNavigate();
    const [listTask, setListTask] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const isBoardPage = location.pathname.includes('/board');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekDays, setWeekDays] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const filterRef = useRef(null);
    const sortRef = useRef(null);
    const [selectedFilterStatus, setSelectedFilterStatus] = useState(null);
    const [selectedFilterPriority, setSelectedFilterPriority] = useState(null);
    const [selectedFilterStart, setSelectedFilterStart] = useState(null);
    const [selectedFilterEnd, setSelectedFilterEnd] = useState(null);
    const [listTaskFilter, setListTaskFilter] = useState([]);
    const [totalFilter, setTotalFilter] = useState(0);
    const [criteria, setCriteria] = useState([]);
    const [listTaskShow, setListTaskShow] = useState([]);

    const groupItems = [
        { name: "Board", icon: "fas fa-columns", path: `/my-task/board` },
        { name: "Calendar", icon: "fas fa-calendar", path: `/my-task/calendar` },
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
        setSelectedFilterStatus(null);
        setSelectedFilterPriority(null);
        setSelectedFilterStart(null);
        setSelectedFilterEnd(null);
    }, []);

    useEffect(() => {
        const activeItem = groupItems.find(item => location.pathname.includes(item.path));
        if (activeItem) {
            setSelectedItem(activeItem.name);
        }
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const isClickOutsideFilter = filterRef.current && !filterRef.current.contains(e.target);
            const isClickOutsideSort = sortRef.current && !sortRef.current.contains(e.target);

            if (isClickOutsideFilter && isClickOutsideSort) {
                setIsFilterOpen(false);
                setIsSortOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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

    useEffect(() => {
        let listFilter = listTask;
        let countFilter = 0;

        if (selectedFilterStatus) {
            listFilter = listFilter.filter(task => task.status.id === selectedFilterStatus.id);
            countFilter += 1;
        }
        if (selectedFilterPriority) {
            listFilter = listFilter.filter(task => task.priorityLevel.id === selectedFilterPriority.id);;
            countFilter += 1;
        }
        if (selectedFilterStart?.startDay || selectedFilterStart?.endDay) {
            listFilter = listFilter.filter(task => {
                const taskStartDate = new Date(task.startDate).setHours(0, 0, 0, 0);
                const filterStartDate = selectedFilterStart?.startDay
                    ? new Date(selectedFilterStart.startDay).setHours(0, 0, 0, 0)
                    : null;
                const filterEndDate = selectedFilterStart?.endDay
                    ? new Date(selectedFilterStart.endDay).setHours(0, 0, 0, 0)
                    : null;

                return (
                    (!filterStartDate || taskStartDate >= filterStartDate) &&
                    (!filterEndDate || taskStartDate <= filterEndDate)
                );
            });
            countFilter += 1;
        }
        if (selectedFilterEnd?.startDay || selectedFilterEnd?.endDay) {
            listFilter = listFilter.filter(task => {
                const taskEndDate = new Date(task.endDate).setHours(0, 0, 0, 0);
                const filterStartDate = selectedFilterEnd?.startDay
                    ? new Date(selectedFilterEnd.startDay).setHours(0, 0, 0, 0)
                    : null;
                const filterEndDate = selectedFilterEnd?.endDay
                    ? new Date(selectedFilterEnd.endDay).setHours(0, 0, 0, 0)
                    : null;

                return (
                    (!filterStartDate || taskEndDate >= filterStartDate) &&
                    (!filterEndDate || taskEndDate <= filterEndDate)
                );
            });
            countFilter += 1;
        }

        setListTaskFilter(listFilter);
        setTotalFilter(countFilter);

    }, [listTask, selectedFilterStatus, selectedFilterPriority, selectedFilterStart, selectedFilterEnd]);

    const handleClearFilter = (e) => {
        e.stopPropagation();
        setSelectedFilterStatus(null);
        setSelectedFilterPriority(null);
        setSelectedFilterStart(null);
        setSelectedFilterEnd(null);
        setIsFilterOpen(false);
    }

    const handleClearSort = (e) => {
        e.stopPropagation();
        setCriteria([]);
        setIsSortOpen(false);
    }

    useEffect(() => {
        let sortedTasks = [...listTaskFilter];
        if (criteria.length > 0) {
            sortedTasks = sortedTasks.sort((a, b) => {
                for (const criterion of criteria) {
                    const key = criterion.key;
                    const order = criterion.order;

                    const aValue = key.split('.').reduce((obj, field) => obj?.[field], a);
                    const bValue = key.split('.').reduce((obj, field) => obj?.[field], b);

                    if (aValue < bValue) return order === 'asc' ? -1 : 1;
                    if (aValue > bValue) return order === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        setListTaskShow(sortedTasks);
    }, [criteria, listTaskFilter]);

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
            {isBoardPage && (
                <div className="group-filter">
                    <div key={"filter"} className={`group-filter-item ${totalFilter > 0 ? 'active' : ''}`} ref={filterRef}>
                        <button onClick={() => { setIsFilterOpen(true); setIsSortOpen(false) }} >
                            <i className={`fas fa-filter`}></i>
                            <span>Filter</span>
                            {totalFilter > 0 && (<span>{totalFilter}</span>)}
                            {totalFilter > 0 && (<i className='fas fa-times' onClick={(e) => handleClearFilter(e)}></i>)}
                        </button>
                        {isFilterOpen && <Filter status={selectedFilterStatus} setStatus={setSelectedFilterStatus}
                            priority={selectedFilterPriority} setPriority={setSelectedFilterPriority}
                            start={selectedFilterStart} setStart={setSelectedFilterStart}
                            end={selectedFilterEnd} setEnd={setSelectedFilterEnd} />}
                    </div>
                    <div key={"sort"} className={`group-filter-item ${criteria.length > 0 ? 'active' : ''}`} ref={sortRef}>
                        <button onClick={() => { setIsSortOpen(true); setIsFilterOpen(false) }} >
                            <i className={`fas fa-sort`}></i>
                            <span>Sort</span>
                            {criteria.length > 0 && (<span>{criteria.length}</span>)}
                            {criteria.length > 0 && (<i className='fas fa-times' onClick={(e) => handleClearSort(e)}></i>)}
                        </button>
                        {isSortOpen && <Sort criteria={criteria} setCriteria={setCriteria} setClose={setIsSortOpen} />}
                    </div>
                </div>
            )}
            {!isBoardPage && (<div className="my-task-week-month">
                <p onClick={handleToday}>Today</p>
                <button onClick={handlePreviousWeek}><i className="fas fa-chevron-left"></i></button>
                <button onClick={handleNextWeek}><i className="fas fa-chevron-right"></i></button>
                <span>{getCurrentMonthYear(currentDate)}</span>
            </div>)}
            <Outlet context={{ user, listTaskShow, weekDays, listTask }} />
        </div>
    );
}
export default MyTask;