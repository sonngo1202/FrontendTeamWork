import { useState } from 'react';
import '../assets/css/ModalSaveRoleUser.css';
import ReactDOM from 'react-dom';
import { addRoleMember } from '../services/groupMemberService';
import Cookies from 'js-cookie';

const ModalSaveRoleUser = ({ x, y, fetchDataGroup, selectedUserOption, setClose, roleUserRef, setCloseOption, group }) => {
    const [valueRole, setValueRole] = useState(selectedUserOption?.position || '');
    const name = selectedUserOption?.user.fullName;

    const addRole = async (accessToken) => {
        try {
            const data = await addRoleMember(group?.id, selectedUserOption?.user.id, valueRole.trim() ? valueRole : null, accessToken);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }

    const handleAddRole = () => {
        const accessToken = Cookies.get('accessToken');

        addRole(accessToken)
            .then(() => {
                return fetchDataGroup();
            })
            .catch((error) => {
                console.error("Failed to add role member:", error);
            });
        setClose(false);
        setCloseOption(false);
    }

    return ReactDOM.createPortal(
        <div className="container-role-user" style={{ left: x + 8, top: y + 56 }} ref={roleUserRef}>
            <span>What is {name}'s on this group?</span>
            <div className='role-user-input'>
                <input value={valueRole} onChange={(e) => setValueRole(e.target.value)}></input>
                <button onClick={handleAddRole}>Done</button>
            </div>
        </div>,
        document.body
    );
}
export default ModalSaveRoleUser;