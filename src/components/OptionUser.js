import '../assets/css/OptionUser.css';
import ReactDOM from 'react-dom';
import { deleteMember } from '../services/groupMemberService';
import Cookies from 'js-cookie';

const OptionUser = ({ x, y, optionUserRef, group, fetchDataGroup, setClose, selectedUserOption, user, setShowError, setShowRole }) => {
    const options = [
        { name: selectedUserOption?.position ? 'Change role' : 'Add role', active: true, onClick: () => handleRole() },
        { name: 'Delete member', color: 'Red', active: user?.id !== selectedUserOption?.user.id, onClick: () => handleDelete() }
    ];

    const deleteM = async (groupId, userId, accessToken) => {
        try {
            const data = await deleteMember(groupId, userId, accessToken);
            return data;
        } catch (error) {
            if (error.message === 'Người dùng vẫn còn nhiệm vụ.') {
                throw new Error('USER_HAS_ACTIVE_TASK');
            } else {
                throw error;
            }
        }
    };

    const handleRole = () => {
        setShowRole(true);
    }

    const handleDelete = async () => {
        const accessToken = Cookies.get('accessToken');

        try {
            await deleteM(group?.id, selectedUserOption?.user.id, accessToken);
            await fetchDataGroup(accessToken);
            setClose(false);
        } catch (error) {
            if (error.message === 'USER_HAS_ACTIVE_TASK') {
                setShowError(true);
                setClose(false);
            } else {
                console.error("Failed to delete member:", error);
            }
        }
    };

    return ReactDOM.createPortal(
        <div className="container-option-user" style={{ left: x + 8, top: y + 56 }} ref={optionUserRef}>
            {options.map((item, index) => item.active && <div key={index} className='option-user-item' onClick={item.onClick}>
                <span className={`${item.color && 'delete'}`}>{item.name}</span>
            </div>)}
        </div>,
        document.body
    );
}
export default OptionUser;