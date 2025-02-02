import { useNavigate, useOutletContext } from 'react-router-dom';
import '../assets/css/DashboardByMember.css';
import { statByMember } from '../services/statService';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const DashboardByMember = () => {
    const navigate = useNavigate();
    const { group } = useOutletContext();
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchData = async () => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            try {
                const resp = await statByMember(group?.id, accessToken);
                setData(resp);
            } catch (error) {
                console.error("Failed to fetch stat data:", error);
            }
        }
    }

    useEffect(() => {
        if (group) {
            fetchData();
        }
    }, [group]);

    const getChartDataByDelay = (item) => {
        return {
            labels: ['On Time', 'Delayed'],
            datasets: [
                {
                    data: [item.countCl + item.countIG + item.countNS - item.countDelay, item.countDelay],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                    borderWidth: 1,
                },
            ],
        };
    };

    const getChartDataByStatus = (item) => {
        console.log(item)
        return {
            labels: ['Completed', 'Not Started', 'In Progress'],
            datasets: [
                {
                    data: [
                        item.countCl,
                        item.countNS,
                        item.countIG
                    ],
                    backgroundColor: ['#008000', '#A2A0A2', '#F0A500'],
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <div className='container-dashboard-by-member'>
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Full name</th>
                        <th>Email</th>
                        <th>Task not started</th>
                        <th>Task in progress</th>
                        <th>Task completed</th>
                        <th>Task delay</th>
                        <th>Total</th>
                        <th>Task status breakdown</th>
                        <th>On time vs delay</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id} className={`${selectedItem?.id === item.id ? 'active' : ''}`} onMouseEnter={() => setSelectedItem(item)}
                            onMouseLeave={() => setSelectedItem(null)} onClick={() => navigate(`/group/${group?.id}/dashboard/by-member/${item.id}`)}>
                            <td className='item-no'>{index + 1}</td>
                            <td>
                                <div className='item-full-name'>
                                    <img
                                        src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item.picture}?alt=media`}
                                    /> <span>{item.fullName}</span>
                                </div>
                            </td>
                            <td className='item-email'>{item.email}</td>
                            <td className='item-count'>{item.countNS}</td>
                            <td className='item-count'>{item.countIG}</td>
                            <td className='item-count'>{item.countCl}</td>
                            <td className='item-count'>{item.countDelay}</td>
                            <td>{item.countCl + item.countIG + item.countNS}</td>
                            <td className='item-chart'><Pie data={getChartDataByStatus(item)} options={{
                                plugins: {
                                    legend: {
                                        position: 'right',
                                        labels: {
                                            padding: 20,
                                        },
                                    },
                                },
                            }} /></td>
                            <td className='item-chart'><Pie data={getChartDataByDelay(item)} options={{
                                plugins: {
                                    legend: {
                                        position: 'right',
                                        labels: {
                                            padding: 20,
                                        },
                                    },
                                },
                            }} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}
export default DashboardByMember;