import { useEffect, useState } from "react";
import '../assets/css/Group.css';
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import Cookies from 'js-cookie';
import { detail } from '../services/groupService'

const isManagerOfGroup = (user, group) => {
    if (!user || !user.roles) {
        console.log(1)
        return false;
    }

    return user.roles.some(userGroup =>
        userGroup?.group.id === group?.id && userGroup.role === 'MANAGER'
    );
};

const Group = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, fetchUserData } = useOutletContext();
    const [group, setGroup] = useState(null);
    const basePath = location.pathname.match(/^\/group\/\d+/)?.[0];
    const groupId = basePath.match(/\/group\/(\d+)/)?.[1];
    const [selectedItem, setSelectedItem] = useState('');
    const isBoardPage = location.pathname.includes('/board');
    const [isManager, setIsManager] = useState(false);
    const isDashboardPage = location.pathname.includes('/dashboard');
    const [typeDashboard, setTypeDashboard] = useState(((location.pathname.includes('/dashboard') && !location.pathname.includes('/dashboard/by-member')) || location.pathname.includes('/dashboard/by-status')) ? 1 : 2);

    const groupItems = [
        { name: "Overview", icon: "fas fa-clipboard-list", path: `/group/${groupId}/overview`, isDisplay: true },
        { name: "Board", icon: "fas fa-columns", path: `/group/${groupId}/board`, isDisplay: true },
        { name: "Dashboard", icon: "fas fa-project-diagram", path: `/group/${groupId}/dashboard`, isDisplay: isManager },
        { name: "File", icon: "fas fa-file-alt", path: `/group/${groupId}/file`, isDisplay: true }
    ];

    const optionItems = [
        { name: "Filter", icon: "fas fa-filter" },
        { name: "Sort", icon: "fas fa-sort" }
    ];

    const handleSelectGroupClick = (item) => {
        setSelectedItem(item.name);
        navigate(item.path);
    }

    const fetchDataGroup = async () => {
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

    useEffect(() => {
        fetchDataGroup();
    }, [groupId]);

    useEffect(() => {
        setIsManager(isManagerOfGroup(user, group))
    }, [group, user])

    useEffect(() => {
        const activeItem = groupItems.find(item => location.pathname.includes(item.path));
        if (activeItem) {
            setSelectedItem(activeItem.name);
        }
        setTypeDashboard(((location.pathname.includes('/dashboard') && !location.pathname.includes('/dashboard/by-member')) || location.pathname.includes('/dashboard/by-status')) ? 1 : 2);
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
                    {groupItems.map((item) => item?.isDisplay &&
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
            {isDashboardPage && (
                <div className="group-dashboard">
                    <button className={`${typeDashboard === 1 ? 'selected' : ''}`} onClick={() => { setTypeDashboard(1); navigate(`/group/${groupId}/dashboard/by-status`) }}>By Status</button>
                    <button className={`${typeDashboard === 2 ? 'selected' : ''}`} onClick={() => { setTypeDashboard(2); navigate(`/group/${groupId}/dashboard/by-member`) }}>By Member</button>
                </div>
            )}
            <Outlet context={{ group, user, fetchUserData, fetchDataGroup }} />
        </div>
    );
};
export default Group;