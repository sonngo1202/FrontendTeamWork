import { useEffect, useState } from "react";
import { getTasks } from "../services/authService";
import Cookies from 'js-cookie';
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";

const MyTask = () => {
    const location = useLocation();
    const { user } = useOutletContext();
    const navigate = useNavigate();
    const [listTask, setListTask] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');

    const groupItems = [
        { name: "Board", icon: "fas fa-columns", path: `/my-task/board` },
        { name: "Calender", icon: "fas fa-calendar", path: `/my-task/calender` },
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
                const data = await getTasks(accessToken);
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
    }, [location])

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
            <div className="group-filter">
                {optionItems.map((item) =>
                    <button key={item.name} >
                        <i className={`fas ${item.icon}`}></i>
                        <span>{item.name}</span>
                    </button>
                )}
            </div>
            <Outlet context={{ user, listTask }} />
        </div>
    );
}
export default MyTask;