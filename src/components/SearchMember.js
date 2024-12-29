import { useEffect, useState } from 'react';
import '../assets/css/SearchMember.css';

const SearchMember = ({ data, setSelected }) => {
    const [key, setKey] = useState('');
    const [showData, setShowData] = useState([]);

    const removeAccents = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .toLowerCase();
    }

    useEffect(() => {
        if (key.trim() === '') {
            setShowData(data);
        } else {
            const filteredData = data.filter(item => {
                return removeAccents(item.user.fullName).includes(removeAccents(key)) || removeAccents(item.user.email).includes(removeAccents(key));
            });
            setShowData(filteredData);
        }
    }, [key, data])

    return (
        <div className="container-search-member">
            <div className='search-member-header'>
                <input placeholder='Name or email' type='text' value={key} onChange={(e) => setKey(e.target.value)}></input>
            </div>
            <div className='search-member-content'>
                {showData?.map((item, index) =>
                    <div className={`search-member-content-item`} key={index} onClick={() => setSelected(item.user)}>
                        <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item.user.picture}?alt=media`} alt="Avatar-User" />
                        <div className='search-member-content-item-info'>
                            <span>{item.user.fullName}</span>
                            <span className='email'>{item.user.email}</span>
                        </div>
                    </div>
                )}
                {showData.length <= 0 && <div className='empty'><span>No result</span></div>}
            </div>
        </div>
    );
}
export default SearchMember;