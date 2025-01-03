import { useEffect, useRef, useState } from 'react';
import '../assets/css/Filter.css';
import SearchMember from './SearchMember';
import DatePicker from './DatePicker';

const Filter = ({ status, setStatus, priority, setPriority, assignee, setAssignee, start, setStart, end, setEnd, member }) => {
    const [activeFilter, setActiveFilter] = useState(false);
    const [isMemberOpen, setIsMemberOpen] = useState(false);
    const memberRef = useRef(null);

    const [isStartSOpen, setIsStartSOpen] = useState(false);
    const [isEndSOpen, setIsEndSOpen] = useState(false);
    const [isStartEOpen, setIsStartEOpen] = useState(false);
    const [isEndEOpen, setIsEndEOpen] = useState(false);
    const [startS, setStartS] = useState(start?.startDay);
    const [endS, setEndS] = useState(start?.endDay);
    const [startE, setStartE] = useState(end?.startDay);
    const [endE, setEndE] = useState(end?.endDay);
    const startRef = useRef(null);
    const endRef = useRef(null);

    const optionStatus = [
        { id: 1, name: 'In progress' },
        { id: 2, name: 'Not started' },
        { id: 3, name: 'Completed' },
    ]

    const optionPriority = [
        { id: 1, name: 'Hight' },
        { id: 2, name: 'Medium' },
        { id: 3, name: 'Low' },
    ];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (memberRef.current && !memberRef.current.contains(e.target)) {
                setIsMemberOpen(false);
            }
            if (startRef.current && !startRef.current.contains(e.target)) {
                setIsStartSOpen(false);
                setIsEndSOpen(false);
            }
            if (endRef.current && !endRef.current.contains(e.target)) {
                setIsStartEOpen(false);
                setIsEndEOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setActiveFilter(status || priority || assignee || start?.startDay || start?.endDay || end?.startDay || end?.endDay)
    }, [status, priority, assignee, start, end])

    const handleClear = () => {
        setStatus(null);
        setPriority(null);
        setAssignee(null);
        setStart(null);
        setEnd(null);
        setStartS(null);
        setEndS(null);
        setStartE(null);
        setEndE(null);
    }

    const handleStatus = (item) => {
        if (status?.id === item.id) {
            setStatus(null)
        } else {
            setStatus(item);
        }
    }

    function formatDateUsingDateObject(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng tính từ 0
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const handlePriority = (item) => {
        if (priority?.id === item.id) {
            setPriority(null)
        } else {
            setPriority(item);
        }
    }

    useEffect(() => {
        setStart({ startDay: startS, endDay: endS });
    }, [startS, endS])

    useEffect(() => {
        setEnd({ startDay: startE, endDay: endE });
    }, [startE, endE])

    return (
        <div className={`filter-container ${member ? '' : 'special'}`}>
            <div className='filter-header'>
                <span>Filters</span>
                <button disabled={!activeFilter} className={`${activeFilter ? 'active' : ''}`} onClick={handleClear} >Clear</button>
            </div>
            <div className='filter-content'>
                <div className='filter-by-status'>
                    <span>Status</span>
                    <div className='filter-by-status-content'>
                        {optionStatus.map((item, index) =>
                            <div key={index} className={`filter-by-status-item ${status?.id === item.id ? 'active' : ''}`} onClick={() => handleStatus(item)}>
                                {status?.id === item.id ? <i className='fas fa-check'></i> : <i className='fas fa-check-circle'></i>}
                                <span>{item.name}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className='filter-by-level'>
                    <span>Priority level</span>
                    <div className='filter-by-status-content'>
                        {optionPriority.map((item, index) =>
                            <div key={index} className={`filter-by-status-item ${priority?.id === item.id ? 'active' : ''}`} onClick={() => handlePriority(item)}>
                                {priority?.id === item.id ? <i className='fas fa-check'></i> : <i className='fas fa-check-circle'></i>}
                                <span>{item.name}</span>
                            </div>
                        )}
                    </div>
                </div>
                {member && <div className='filter-by-assignee' ref={memberRef}>
                    <span>Assignee</span>
                    <div className='filter-by-assignee-content'>
                        {!assignee && <button onClick={() => setIsMemberOpen(!isMemberOpen)}>
                            <i className='fas fa-plus'></i>
                            <span>Select member</span>
                        </button>}
                        {assignee && <div className='assignee-filter-info' onClick={() => setIsMemberOpen(!isMemberOpen)}>
                            <div className='assignee-filter-info-left'>
                                <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${assignee.picture}?alt=media`} alt="Avatar-User" />
                                <span>{assignee.fullName}</span>
                            </div>
                            <div className='assignee-filter-info-right'>
                                <i className='fas fa-times' onClick={(e) => { e.stopPropagation(); setAssignee(null) }}></i>
                            </div>
                        </div>}
                        {isMemberOpen && <SearchMember data={member} setSelected={setAssignee} />}
                    </div>
                </div>}
                <div className='filter-by-start-date' ref={startRef}>
                    <span>Start date</span>
                    <div className='filter-by-start-date-content'>
                        {!start?.startDay && <button onClick={() => { setIsStartSOpen(!isStartSOpen); setIsEndSOpen(false) }}>
                            <i className='fas fa-plus'></i>
                            <span>Select start</span>
                        </button>}
                        {start?.startDay && <div className='form-start-date' onClick={() => { setIsStartSOpen(!isStartSOpen); setIsEndSOpen(false) }}>
                            <span>{formatDateUsingDateObject(start?.startDay)}</span>
                            <i className='fas fa-times' onClick={(e) => { e.stopPropagation(); setStartS(null) }}></i>
                        </div>}
                        {!start?.endDay && <button onClick={() => { setIsEndSOpen(!isEndSOpen); setIsStartSOpen(false) }}>
                            <i className='fas fa-plus'></i>
                            <span>Select end</span>
                        </button>}
                        {start?.endDay && <div className='form-start-date' onClick={() => { setIsEndSOpen(!isEndSOpen); setIsStartSOpen(false) }}>
                            <span>{formatDateUsingDateObject(start?.endDay)}</span>
                            <i className='fas fa-times' onClick={(e) => { e.stopPropagation(); setEndS(null) }}></i>
                        </div>}
                        {isStartSOpen && <DatePicker setDate={setStartS} date={startS} />}
                        {isEndSOpen && <DatePicker setDate={setEndS} date={endS} />}
                    </div>
                </div>
                <div className='filter-by-end-date' ref={endRef}>
                    <span>End date</span>
                    <div className='filter-by-start-date-content'>
                        {!end?.startDay && <button onClick={() => { setIsStartEOpen(!isStartEOpen); setIsEndEOpen(false) }}>
                            <i className='fas fa-plus'></i>
                            <span>Select start</span>
                        </button>}
                        {end?.startDay && <div className='form-start-date' onClick={() => { setIsStartEOpen(!isStartEOpen); setIsEndEOpen(false) }}>
                            <span>{formatDateUsingDateObject(end?.startDay)}</span>
                            <i className='fas fa-times' onClick={(e) => { e.stopPropagation(); setStartE(null) }}></i>
                        </div>}
                        {!end?.endDay && <button onClick={() => { setIsEndEOpen(!isEndEOpen); setIsStartEOpen(false) }}>
                            <i className='fas fa-plus'></i>
                            <span>Select end</span>
                        </button>}
                        {end?.endDay && <div className='form-start-date' onClick={() => { setIsEndEOpen(!isEndEOpen); setIsStartEOpen(false) }}>
                            <span>{formatDateUsingDateObject(end?.endDay)}</span>
                            <i className='fas fa-times' onClick={(e) => { e.stopPropagation(); setEndE(null) }}></i>
                        </div>}
                        {isStartEOpen && <DatePicker setDate={setStartE} date={startE} />}
                        {isEndEOpen && <DatePicker setDate={setEndE} date={endE} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Filter;