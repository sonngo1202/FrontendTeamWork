import { useEffect, useState } from 'react';
import '../assets/css/StatDetail.css';
import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import { statByMemberDetail, statByStatusDetail } from '../services/statService';
import Cookies from 'js-cookie';
import TaskDetail from './TaskDetail';

const StatDetail = () => {
    const [data, setData] = useState([]);
    const { group, user } = useOutletContext();
    const { idS, idU, id } = useParams();
    const location = useLocation();
    const [title, setTitle] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

    const fetchDataStatus = async (accessToken) => {
        if (accessToken) {
            try {
                const resp = await statByStatusDetail(id, idS, accessToken);
                setData(resp);
                if (resp.length > 0) {
                    setTitle(resp[0].status.name);
                }
            } catch (error) {
                console.error("Failed to fetch stat data:", error);
            }
        }
    }

    const fetchDataMember = async (accessToken) => {
        if (accessToken) {
            try {
                const resp = await statByMemberDetail(id, idU, accessToken);
                setData(resp);
                if (resp.length > 0) {
                    setTitle('of ' + resp[0].assignee.fullName);
                }
            } catch (error) {
                console.error("Failed to fetch stat data:", error);
            }
        }
    }

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        if (location.pathname.includes('/dashboard/by-member')) {
            fetchDataMember(accessToken);
        } else {
            fetchDataStatus(accessToken);
        }
    }, [location])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const handleCloseTask = () => {
        setSelectedItem(null);
    }

    return (
        <div className='container-stat-detail'>
            <span className='title-stat-detail'>All tasks {title}</span>
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        {idS && <th>Assignee</th>}
                        {idU && <th>Status</th>}
                        <th>Priority level</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Delay</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className={`${hoveredItem?.id === item.id ? 'hovered' : ''} ${selectedItem?.id === item.id ? 'selected' : ''}`}
                            onMouseEnter={() => setHoveredItem(item)} onMouseLeave={() => setHoveredItem(null)} onClick={() => setSelectedItem(item)}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            {idS && <td>
                                <div className='item-full-name'>
                                    <img
                                        src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item.assignee.picture}?alt=media`}
                                    /> <span>{item.assignee.fullName}</span>
                                </div>
                            </td>}
                            {idU && <td className={`${item.status.id === 1 ? 'status-in-progress' :
                                item.status.id === 2 ? 'status-not-started' : 'status-completed'}`}>{item.status.name}</td>}
                            <td className={`${item.priorityLevel.id === 1 ? 'hight' :
                                item.priorityLevel.id === 2 ? 'medium' : 'low'}`}
                            >{item.priorityLevel.name}</td>
                            <td>{formatDate(item.startDate)}</td>
                            <td>{formatDate(item.endDate)}</td>
                            <td>{item.isDelay && <i className='fas fa-check'></i>}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedItem && <TaskDetail user={user} id={selectedItem?.id} idWG={selectedItem?.workGroup.id} idG={selectedItem?.workGroup.group.id} onClose={handleCloseTask} />}
        </div>
    );
}
export default StatDetail;