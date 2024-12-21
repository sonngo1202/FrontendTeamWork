import { useOutletContext } from 'react-router-dom';
import '../assets/css/Overview.css';
import { useEffect, useRef, useState } from 'react';
import ModalGroupDetail from './ModalGroupDetail';
import ModalAddMember from './ModalAddMember';
import OptionUser from './OptionUser';
import ModalError from './ModalError';
import ModalSaveRoleUser from './ModalSaveRoleUser';

const isManagerOfGroup = (user, group) => {
    if (!user || !user.roles || !group) {
        return false;
    }

    return user.roles.some(userGroup =>
        userGroup.group.id === group.id && userGroup.role === 'MANAGER'
    );
};

const Overview = () => {
    const { group, user, fetchUserData, fetchDataGroup } = useOutletContext();
    const optionUserRef = useRef(null);
    const itemMemberRef = useRef([]);
    const roleUserRef = useRef(null);
    const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [selectedUserOption, setSelectedUserOption] = useState(null);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [showError, setShowError] = useState(false);
    const [showRole, setShowRole] = useState(false);
    const [showOption, setShowOption] = useState(false);

    const handleItemClick = (e, item) => {
        if (isManagerOfGroup(user, group)) {
            const itemElement = e.currentTarget;

            const rect = itemElement.getBoundingClientRect();
            setX(rect.left);
            setY(rect.top);
            setSelectedUserOption(item);
            setShowOption(true);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                optionUserRef.current && !optionUserRef.current.contains(e.target) &&
                !itemMemberRef.current.some(ref => ref && ref.contains(e.target))
            ) {
                setShowOption(false);
            }
            if (roleUserRef.current && !roleUserRef.current.contains(e.target) && optionUserRef.current && !optionUserRef.current.contains(e.target)){
                setShowRole(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className='container-overview'>
            <div className='overview-project-description'>
                <div className='overview-project-description-header'>
                    <span>Group description</span>
                    {isManagerOfGroup(user, group) && <i className='fas fa-pen' onClick={() => setIsEditGroupOpen(true)}></i>}
                </div>
                <textarea rows={8} value={group?.des ? group?.des : 'Bạn muốn mô tả nhóm của bạn?'} disabled></textarea>
            </div>
            <div className='overview-project-roles'>
                <span>Group member</span>
                <div className='overview-project-list-member'>
                    {isManagerOfGroup(user, group) && <div className='overview-project-add-member' onClick={() => setIsAddMemberOpen(true)}>
                        <div className='overivew-project-add-member-icon'>
                            <i className='fas fa-plus'></i>
                        </div>
                        <span>Add member</span>
                    </div>}
                    {group?.listUserGroup && group?.listUserGroup.map((item, index) =>
                        <div key={index} className='overview-project-item-member' onClick={(e) => handleItemClick(e, item)} ref={(el) => itemMemberRef.current[index] = el} >
                            <div className='overview-project-item-member-left'>
                                <img
                                    src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item?.user.picture}?alt=media`}
                                    alt="Avatar"
                                />
                            </div>
                            <div className='overview-project-item-member-right'>
                                <span className='item-member-name'>{item?.user.fullName}</span>
                                {item?.position ? <span className='item-member-role'>{item?.position}</span> : (
                                    isManagerOfGroup(user, group) ? <span className='item-member-role'><i className='fas fa-plus'></i>Add role</span> :
                                        <span className='item-member-role'>No role</span>
                                )}
                            </div>
                            {(showOption && selectedUserOption?.user.id === item?.user.id) && (<OptionUser setClose={setShowOption} fetchDataGroup={fetchDataGroup} group={group} x={x} y={y}
                                optionUserRef={optionUserRef} selectedUserOption={selectedUserOption} user={user} setShowError={setShowError} setShowRole={setShowRole} />)}
                        </div>
                    )}
                </div>
            </div>
            {isEditGroupOpen && (<ModalGroupDetail setClose={setIsEditGroupOpen} fetchUserData={fetchUserData} group={group} fetchDataGroup={fetchDataGroup} />)}
            {isAddMemberOpen && (<ModalAddMember setClose={setIsAddMemberOpen} fetchDataGroup={fetchDataGroup} group={group} />)}
            {showError && (<ModalError setClose={setShowError} error={'The member currently has assigned tasks. Please ensure the member has no remaining tasks before deleting.'} />)}
            {showRole && (<ModalSaveRoleUser x={x} y={y} fetchDataGroup={fetchDataGroup} selectedUserOption={selectedUserOption} setClose={setShowRole} roleUserRef={roleUserRef} setCloseOption={setShowOption} group={group} />)}
        </div>
    );
};
export default Overview;