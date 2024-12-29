import { useNavigate, useOutletContext } from 'react-router-dom';
import '../assets/css/DashboardByStatus.css';
import { statByStatus } from '../services/statService';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const DashboardByStatus = () => {
    const navigate = useNavigate();
    const { group } = useOutletContext();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState({
        inprogress: 0,
        notstarted: 0,
        completed: 0,
    });

    const fetchData = async () => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            try {
                const resp = await statByStatus(group?.id, accessToken);
                setData(resp);

                let totalInProgress = 0;
                let totalNotStarted = 0;
                let totalCompleted = 0;
                resp.forEach(item => {
                    if (item.name === 'In Progress') {
                        totalInProgress += item.count;
                    } else if (item.name === 'Not Started') {
                        totalNotStarted += item.count;
                    } else if (item.name === 'Completed') {
                        totalCompleted += item.count;
                    }
                });
                setTotal({
                    inprogress: totalInProgress,
                    notstarted: totalNotStarted,
                    completed: totalCompleted,
                });
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

    const getChartData = (item) => {
        return {
            labels: ['On Time', 'Delayed'],
            datasets: [
                {
                    data: [item.count - item.countDelay, item.countDelay],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                    borderWidth: 1,
                },
            ],
        };
    };

    const getChartDataTotal = () => {
        return {
            labels: ['Completed', 'Not Started', 'In Progress'],
            datasets: [
                {
                    data: [
                        total.completed,
                        total.notstarted,
                        total.inprogress
                    ],
                    backgroundColor: ['#008000', '#A2A0A2', '#F0A500'],
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <div className='container-dashboard-status'>
            <div className='dashboard-status-data'>
                {data.map((item, index) =>
                    <div key={index} className='dashboard-status-data-item' onClick={() => navigate(`/group/${group?.id}/dashboard/by-status/${item.id}`)}>
                        <span className='status-data-item-title'>{item.name} task</span>
                        <span className='status-data-item-count'>{item.count}</span>
                    </div>
                )}
                <div className='dashboard-status-data-total' >
                    <span className='status-data-item-title'>Total task</span>
                    <span className='status-data-item-count'>{total.completed + total.inprogress + total.notstarted}</span>
                </div>
            </div>
            <div className='dashboard-status-chart'>
                {(total.completed + total.inprogress + total.notstarted) && <div className='dashboard-status-chart-total'>
                    <span>Task status breakdown</span>
                    <div className='dashboard-status-chart-total-detail'>
                        <Pie data={getChartDataTotal()} options={{
                            plugins: {
                                legend: {
                                    position: 'right',
                                    labels: {
                                        padding: 20,
                                    },
                                },
                            },
                        }} />
                    </div>
                </div>}
                {data.map((item, index) => item.count > 0 &&
                    <div key={index} className='dashboard-status-chart-item' onClick={() => navigate(`/group/${group?.id}/dashboard/by-status/${item.id}`)}>
                        <span>{item.name} task on time vs delay</span>
                        <div className='dashboard-status-chart-item-detail'>
                            <Pie data={getChartData(item)} options={{
                                plugins: {
                                    legend: {
                                        position: 'right',
                                        labels: {
                                            padding: 20,
                                        },
                                    },
                                },
                            }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default DashboardByStatus;