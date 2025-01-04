import { useEffect, useRef, useState } from "react";
import '../assets/css/Group.css';
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import Cookies from 'js-cookie';
import { detail } from '../services/groupService'
import Filter from "./Filter";
import Sort from "./Sort";

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
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const filterRef = useRef(null);
    const sortRef = useRef(null);
    const [selectedFilterStatus, setSelectedFilterStatus] = useState(null);
    const [selectedFilterPriority, setSelectedFilterPriority] = useState(null);
    const [selectedFilterAssignee, setSelectedFilterAssignee] = useState(null);
    const [selectedFilterStart, setSelectedFilterStart] = useState(null);
    const [selectedFilterEnd, setSelectedFilterEnd] = useState(null);
    const [listWG, setListWG] = useState([]);
    const [totalFilter, setTotalFilter] = useState(0);
    const [criteria, setCriteria] = useState([]);

    const groupItems = [
        { name: "Overview", icon: "fas fa-clipboard-list", path: `/group/${groupId}/overview`, isDisplay: true },
        { name: "Board", icon: "fas fa-columns", path: `/group/${groupId}/board`, isDisplay: true },
        { name: "Dashboard", icon: "fas fa-project-diagram", path: `/group/${groupId}/dashboard`, isDisplay: isManager },
        { name: "File", icon: "fas fa-file-alt", path: `/group/${groupId}/file`, isDisplay: true }
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
        setSelectedFilterStatus(null);
        setSelectedFilterPriority(null);
        setSelectedFilterAssignee(null);
        setSelectedFilterStart(null);
        setSelectedFilterEnd(null);
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

    useEffect(() => {
        let listFilter = group?.listWorkGroup;
        let countFilter = 0;

        if (selectedFilterStatus) {
            const filteredGroup = listFilter.map(wg => {
                const tasks = wg.listTask.filter(task => task.status.id === selectedFilterStatus.id);
                return {
                    ...wg,
                    listTask: tasks.length > 0 ? tasks : []
                };
            });
            listFilter = filteredGroup;
            countFilter += 1;
        }
        if (selectedFilterPriority) {
            const filteredGroup = listFilter.map(wg => {
                const tasks = wg.listTask.filter(task => task.priorityLevel.id === selectedFilterPriority.id);
                return {
                    ...wg,
                    listTask: tasks.length > 0 ? tasks : []
                };
            });
            listFilter = filteredGroup;
            countFilter += 1;
        }
        if (selectedFilterAssignee) {
            const filteredGroup = listFilter.map(wg => {
                const tasks = wg.listTask.filter(task => task.assignee.id === selectedFilterAssignee.id);
                return {
                    ...wg,
                    listTask: tasks.length > 0 ? tasks : []
                };
            });
            listFilter = filteredGroup;
            countFilter += 1;
        }
        if (selectedFilterStart?.startDay || selectedFilterStart?.endDay) {
            const filteredGroup = listFilter.map(wg => {
                const tasks = wg.listTask.filter(task => {
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

                return {
                    ...wg,
                    listTask: tasks.length > 0 ? tasks : [],
                };
            });
            listFilter = filteredGroup;
            countFilter += 1;
        }
        if (selectedFilterEnd?.startDay || selectedFilterEnd?.endDay) {
            const filteredGroup = listFilter.map(wg => {
                const tasks = wg.listTask.filter(task => {
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

                return {
                    ...wg,
                    listTask: tasks.length > 0 ? tasks : [],
                };
            });
            listFilter = filteredGroup;
            countFilter += 1;
        }

        setListWG(listFilter);
        setTotalFilter(countFilter);

    }, [group, selectedFilterStatus, selectedFilterPriority, selectedFilterAssignee, selectedFilterStart, selectedFilterEnd]);

    const handleClearFilter = (e) => {
        e.stopPropagation();
        setSelectedFilterStatus(null);
        setSelectedFilterPriority(null);
        setSelectedFilterAssignee(null);
        setSelectedFilterStart(null);
        setSelectedFilterEnd(null);
        setIsFilterOpen(false);
    }

    const handleClearSort = (e) => {
        e.stopPropagation();
        setCriteria([]);
        setIsSortOpen(false);
    }

    const [showListWG, setShowListWG] = useState(listWG);

    useEffect(() => {
        let sortedWorkGroups = listWG;
        if (criteria.length > 0) {
            sortedWorkGroups = listWG.map(wg => {
                const sortedTasks = [...wg.listTask].sort((a, b) => {
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

                return {
                    ...wg,
                    listTask: sortedTasks,
                };
            });
        }
        setShowListWG(sortedWorkGroups);
    }, [criteria, listWG]);

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
                    <div key={"filter"} className={`group-filter-item ${totalFilter > 0 ? 'active' : ''}`} ref={filterRef}>
                        <button onClick={() => { setIsFilterOpen(true); setIsSortOpen(false) }} >
                            <i className={`fas fa-filter`}></i>
                            <span>Filter</span>
                            {totalFilter > 0 && (<span>{totalFilter}</span>)}
                            {totalFilter > 0 && (<i className='fas fa-times' onClick={(e) => handleClearFilter(e)}></i>)}
                        </button>
                        {isFilterOpen && <Filter status={selectedFilterStatus} setStatus={setSelectedFilterStatus}
                            priority={selectedFilterPriority} setPriority={setSelectedFilterPriority}
                            assignee={selectedFilterAssignee} setAssignee={setSelectedFilterAssignee}
                            start={selectedFilterStart} setStart={setSelectedFilterStart}
                            end={selectedFilterEnd} setEnd={setSelectedFilterEnd}
                            member={group?.listUserGroup} />}
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
            {isDashboardPage && (
                <div className="group-dashboard">
                    <button className={`${typeDashboard === 1 ? 'selected' : ''}`} onClick={() => { setTypeDashboard(1); navigate(`/group/${groupId}/dashboard/by-status`) }}>By Status</button>
                    <button className={`${typeDashboard === 2 ? 'selected' : ''}`} onClick={() => { setTypeDashboard(2); navigate(`/group/${groupId}/dashboard/by-member`) }}>By Member</button>
                </div>
            )}
            <Outlet context={{ group, user, fetchUserData, fetchDataGroup, showListWG }} />
        </div>
    );
};
export default Group;