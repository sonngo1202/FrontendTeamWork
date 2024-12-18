import '../assets/css/ModalAddMember.css';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { searchAll } from '../services/authService';
import ModalListUser from './ModalListUser';
import { addMember } from '../services/groupMemberService';

const ModalAddMember = ({ setClose, fetchDataGroup, group }) => {
    const [key, setKey] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchData, setSearchData] = useState([]);

    const fetchSearchData = async () => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            const data = await searchAll(group?.id, key, accessToken);
            setSearchData(data);
        }
    };

    useEffect(() => {
        if (key.trim()) {
            fetchSearchData();
        }
    }, [key]);

    const add = async (accessToken) => {
        if (!selectedUser?.inGroup) {
            try {
                const data = await addMember(group?.id, selectedUser?.id, accessToken);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
    }

    const handleAdd = () => {
        const accessToken = Cookies.get('accessToken');
        
        add(accessToken)
            .then(() => {
                return fetchDataGroup(accessToken);
            })
            .catch((error) => {
                console.error("Failed to update user:", error);
            });
        setClose(false);
    }

    return ReactDOM.createPortal(
        <div className={`modal-add-member-overlay`}>
            <div className='container-modal-add-member'>
                <div className='modal-add-member-header'>
                    <span>Add member</span>
                    <button onClick={() => setClose(false)}><i className='fas fa-times'></i></button>
                </div>
                <div className='input-search-user'>
                    <div className='action-search'>
                        {selectedUser ?
                            <div className='container-selected-user'>
                                <div className='selected-user'>
                                    <div className='selected-content'>
                                        <img
                                            src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${selectedUser.picture}?alt=media`}
                                            alt={selectedUser.fullName}
                                        />
                                        <span>{selectedUser.fullName}</span>
                                    </div>
                                    <div className='remove-selected'>
                                        <i
                                            className='fas fa-times'
                                            onClick={() => {
                                                setSelectedUser(null);
                                                setKey('');
                                            }}
                                        ></i>
                                    </div>
                                </div>
                            </div> :
                            <input
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder='Add members by email...'
                            />}
                        <button disabled={!selectedUser} className={`${selectedUser ? 'active' : ''}`} onClick={handleAdd}>Add</button>
                    </div>
                    {key.trim() && (<ModalListUser listUser={searchData} setSelected={setSelectedUser} setKey={setKey} />)}
                </div>
            </div>
        </div>,
        document.body
    );
}
export default ModalAddMember;