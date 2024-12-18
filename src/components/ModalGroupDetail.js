import { useState } from 'react';
import '../assets/css/ModalGroupDetail.css';
import ReactDOM from 'react-dom';
import { add, edit } from '../services/groupService';
import Cookies from 'js-cookie';

const ModalGroupDetail = ({ group, setClose, fetchUserData, fetchDataGroup }) => {
    const [name, setName] = useState(group ? group.name : '');
    const [des, setDes] = useState(group ? group.des : '');

    const addGroup = async (accessToken) => {
        if (accessToken) {
            try {
                const data = await add(name, des, accessToken);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
    }

    const editGroup = async (accessToken) => {
        if (accessToken) {
            try {
                const data = await edit(group?.id ,name, des, accessToken);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
    }

    const handleAdd = () => {
        const accessToken = Cookies.get('accessToken');

        addGroup(accessToken)
            .then(() => {
                return fetchUserData(accessToken);
            })
            .catch((error) => {
                console.error("Failed to update user:", error);
            });
        setClose(false);
    }

    const handleEdit = () => {
        const accessToken = Cookies.get('accessToken');

        editGroup(accessToken)
            .then(() => {
                return fetchUserData(accessToken);
            })
            .then(() => {
                if(fetchDataGroup){
                    return fetchDataGroup(accessToken);
                }
            })
            .catch((error) => {
                console.error("Failed to update user:", error);
            });
        setClose(false);
    }

    return ReactDOM.createPortal(
        <div className={`modal-group-detail-overlay`}>
            <div className='container-modal-group-detail'>
                <div className='modal-group-detail-header'>
                    {group ? <span>Edit Group</span> : <span>Create Group</span>}
                    <button onClick={() => setClose(false)}><i className='fas fa-times'></i></button>
                </div>
                <div className='modal-group-detail-content'>
                    <div className='modal-group-detail-item'>
                        <label>Name <span>*</span></label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='modal-group-detail-item'>
                        <label>Description</label>
                        <textarea rows={8}
                            value={des}
                            onChange={(e) => setDes(e.target.value)}
                            placeholder='Bạn muốn mô tả nhóm của bạn?'
                        />
                    </div>
                </div>
                <button className={`btn-save ${name.trim() ? 'active' : ''}`} disabled={!name.trim()} onClick={group ? handleEdit : handleAdd}>Save</button>
            </div>
        </div>,
        document.body
    );
}
export default ModalGroupDetail;