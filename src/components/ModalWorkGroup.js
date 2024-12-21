import '../assets/css/ModalWorkGroup.css';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { add, edit } from '../services/workGroupService';

const ModalWorkGroup = ({ setClose, workGroup, group, fetchDataGroup }) => {
    const [name, setName] = useState(workGroup?.name || '');

    const addWorkGroup = async (accessToken) => {
        if (accessToken) {
            try {
                const data = await add(group?.id, name, accessToken);
            } catch (error) {
                console.error("Failed to add work group data:", error);
            }
        }
    }

    const editWorkGroup = async (accessToken) => {
        if (accessToken) {
            try {
                const data = await edit(group?.id, workGroup?.id, name, accessToken);
            } catch (error) {
                console.error("Failed to edit work group data:", error);
            }
        }
    }

    const handleAdd = () => {
        const accessToken = Cookies.get('accessToken');

        addWorkGroup(accessToken)
            .then(() => {
                return fetchDataGroup();
            })
            .catch((error) => {
                console.error("Failed to add work group data:", error);
            });
        setClose(false);
    }

    const handleEdit = () => {
        const accessToken = Cookies.get('accessToken');
        editWorkGroup(accessToken)
            .then(() => {
                return fetchDataGroup();
            })
            .catch((error) => {
                console.error("Failed to add work group data:", error);
            });
        setClose(false);
    }

    return ReactDOM.createPortal(
        <div className={`modal-work-group-overlay`}>
            <div className='container-modal-work-group'>
                <div className='modal-work-group-header'>
                    {workGroup ? <span>Edit work group</span> : <span>Create work group</span>}
                    <button onClick={() => setClose(false)}><i className='fas fa-times'></i></button>
                </div>
                <div className='modal-work-group-item'>
                    <label>Name <span>*</span></label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <button className={`btn-save ${name.trim() ? 'active' : ''}`} disabled={!name.trim()} onClick={workGroup ? handleEdit : handleAdd}>Save</button>
            </div>
        </div>,
        document.body
    );
}
export default ModalWorkGroup;