import { useEffect, useState } from "react";
import '../assets/css/Group.css';
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import Cookies from 'js-cookie';
import { detail } from '../services/groupService'

const Group = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useOutletContext();
    const [group, setGroup] = useState(null);
    const basePath = location.pathname.match(/^\/group\/\d+/)?.[0];
    const groupId = basePath.match(/\/group\/(\d+)/)?.[1];
    const [selectedItem, setSelectedItem] = useState('');
    const isBoardPage = location.pathname.includes('/board');

    const groupItems = [
        { name: "Overview", icon: "fas fa-clipboard-list", path: `/group/${groupId}/overview` },
        { name: "Board", icon: "fas fa-columns", path: `/group/${groupId}/board` },
        { name: "Timeline", icon: "fas fa-sliders-h", path: `/group/${groupId}/timeline` },
        { name: "Dashboard", icon: "fas fa-project-diagram", path: `/group/${groupId}/dashboard`, isManager: true },
        { name: "File", icon: "fas fa-file-alt", path: `/group/${groupId}/file` }
    ];

    const optionItems = [
        { name: "Filter", icon: "fas fa-filter" },
        { name: "Sort", icon: "fas fa-sort" }
    ];

    const handleSelectGroupClick = (item) => {
        setSelectedItem(item.name);
        navigate(item.path);
    }

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = Cookies.get('accessToken');
            if (accessToken) {
                try {
                    const groupData = await detail(groupId, accessToken);
                    setGroup(groupData);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            }
        }
        fetchData()
    }, [groupId]);

    useEffect(() => {
        const activeItem = groupItems.find(item => location.pathname.includes(item.path));
        if (activeItem) {
            setSelectedItem(activeItem.name);
        }
    }, [location]);
    
    return (
        <div className="container-group">
            <div className="group-header">
                <div className="group-title">
                    <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${group?.picture}?alt=media`} alt="Avatar-Group" />
                    <span className="group-name">{group?.name}</span>
                    <span className={`${group?.isClosed ? "archived" : "active"}`}>●</span>
                    <span className="status">{group?.isClosed ? "Archived" : "Active"}</span>
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
                    {optionItems.map((item) =>
                        <button key={item.name} >
                            <i className={`fas ${item.icon}`}></i>
                            <span>{item.name}</span>
                        </button>
                    )}
                </div>
            )}
            <Outlet context={{ group, user }} />
        </div>
    );
};
export default Group;