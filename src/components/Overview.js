import { useOutletContext } from 'react-router-dom';
import '../assets/css/Overview.css';

const Overview = () => {
    const { group } = useOutletContext();
    console.log(group);

    return (
        <div className='container-overview'>
            <div className='overview-project-description'>
                <div className='overview-project-description-header'>
                    <span>Group description</span>
                    <i className='fas fa-pen'></i>
                </div>
                <textarea rows={8} value={group?.des ? group?.des : 'Bạn muốn mô tả nhóm của bạn?'} disabled></textarea>
            </div>
            <div className='overview-project-roles'>
                <span>Group member</span>
                <div className='overview-project-list-member'>
                    <div className='overview-project-add-member'>
                        <div className='overivew-project-add-member-icon'>
                            <i className='fas fa-plus'></i>
                        </div>
                        <span>Add member</span>
                    </div>
                    {group?.listUserGroup && group?.listUserGroup.map((item) =>
                        <div key={item?.id} className='overview-project-item-member'>
                            <div className='overview-project-item-member-left'>
                                <img
                                    src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item?.user.picture}?alt=media`}
                                    alt="Avatar"
                                />
                            </div>
                            <div className='overview-project-item-member-right'>
                                <span className='item-member-name'>{item?.user.fullName}</span>
                                {item?.position ? <span className='item-member-role'>{item?.position}</span> : <span className='item-member-role'><i className='fas fa-plus'></i>Add role</span>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Overview;