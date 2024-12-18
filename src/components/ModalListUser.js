import '../assets/css/ModalListUser.css';

const ModalListUser = ({ listUser, setSelected, setKey }) => {
    const handleSelect = (item) => {
        setSelected(item);
        setKey('');
    }

    return (
        <div className='container-list-user'>
            {listUser.map((item, index) =>
                <div className={`list-user-item ${item.inGroup ? 'in-group' : ''}`} key={index} onClick={() => handleSelect(item)} >
                    <div className='list-user-item-left'>
                        <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item.picture}?alt=media`} alt="Avatar-User" />
                        <div className='list-user-item-info'>
                            <span>{item.fullName}</span>
                            <span className='email'>{item.email}</span>
                        </div>
                    </div>
                    <div className='list-user-item-right'>
                        {item.inGroup && <span>Group member</span>}
                    </div>
                </div>
            )}
            {listUser.length <= 0 && <div className='list-user-empty'>
                <span>Không tìm thấy người dùng...</span>
            </div>}
        </div>
    );
}
export default ModalListUser;