import { useEffect, useState } from 'react';
import '../assets/css/Search.css';
import { getDataSearch } from '../services/authService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Search = ({ searchKey, user, setIsSearchOpen, setSearchKey }) => {
    const navigate = useNavigate();
    const [selectedOpition, setSelectedOption] = useState(null);
    const [data, setData] = useState([]);
    const [filteredTask, setFilteredTask] = useState([]);
    const [filteredGroup, setFilteredGroup] = useState([]);

    const opitons = [
        { name: 'Tasks', icon: 'fas fa-check-circle' },
        { name: 'Groups', icon: 'fas fa-object-group' }
    ]

    const handleSelectOption = (item) => {
        setSelectedOption(item.name);
    }

    const handleCancelOption = (e) => {
        e.stopPropagation();
        setSelectedOption(null);
    };

    const fetchData = async () => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            try {
                const data = await getDataSearch(accessToken);
                setData(data);
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
        if (searchKey) {
            const filteredT = data.filter((item) =>
                item.name.toLowerCase().includes(searchKey.toLowerCase())
            );
            setFilteredTask(filteredT);

            const filteredG = user?.roles.filter((item) =>
                item.group.name.toLowerCase().includes(searchKey.toLowerCase())
            );
            setFilteredGroup(filteredG);
        } else {
            setFilteredGroup([]);
            setFilteredTask([]);
        }
    }, [searchKey, data]);

    const handleClickTask = (item) => {
        setSearchKey('');
        setIsSearchOpen(false);
        navigate(`/group/${item?.workGroup.group.id}/board/${item?.workGroup?.id}/tasks/${item?.id}`)
    }

    const handleClickGroup = (item) => {
        setSearchKey('');
        setIsSearchOpen(false);
        navigate(`/group/${item?.group.id}/board`);
    }
 
    return (
        <div className='container-search'>
            <div className='search-header'>
                {opitons.map((item) =>
                    <div key={item.name} className={`search-header-item ${selectedOpition === item.name ? 'selected' : ''}`} onClick={() => handleSelectOption(item)}>
                        <i className={`${item.icon}`}></i>
                        <span>{item.name}</span>
                        {selectedOpition === item.name && (<i className='fas fa-times' onClick={(e) => handleCancelOption(e)}></i>)}
                    </div>
                )}
            </div>
            {!selectedOpition && filteredTask.length > 0 && (<span className='search-content-title'>Tasks</span>)}
            {searchKey && (selectedOpition === 'Tasks' || !selectedOpition) && (
                <div className='search-content'>
                    {filteredTask.map((item) =>
                        <div key={item?.id} className='search-content-item' onClick={() => handleClickTask(item)}>
                            <div className='search-content-item-top'>
                                <span className={`search-content-item-status ${item?.status.id === 1 ? 'status-in-progress' :
                                    item?.status.id === 2 ? 'status-not-started' : 'status-completed'
                                    }`}>●</span>
                                <span className="search-content-item-name">{item?.name}</span>
                            </div>
                            <div className='search-content-item-footer'>
                                <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item?.workGroup.group.picture}?alt=media`} alt="Avatar-Task" className="avatar" />
                                <span>{item?.workGroup.group.name}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {!selectedOpition && filteredGroup.length > 0 && (<span className='search-content-title'>Groups</span>)}
            {searchKey && (selectedOpition === 'Groups' || !selectedOpition) && (
                <div className='search-content'>
                    {filteredGroup.map((item) =>
                        <div key={item?.id} className='search-content-item' onClick={() => handleClickGroup(item)}>
                            <div className='search-content-item-top'>
                                <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item?.group.picture}?alt=media`} alt="Avatar-Task" className="avatar" />
                                <span>{item?.group.name}</span>
                            </div>
                            {item?.group.isClosed && (<div className='search-content-item-footer'>
                                <i className='fas fa-archive'></i>
                                <span>Archive</span>
                            </div>)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

}
export default Search;