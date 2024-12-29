import '../assets/css/ModalMemberComment.css';
import ReactDOM from 'react-dom';

const ModalMemberComment = ({ data, setSelected, y }) => {
    return (
        <div className='container-member-comment' style={{top : y}} contentEditable={false}>
            {data && data?.map((item, index) =>
                <div className={`member-comment-item`} key={index} onClick={() => setSelected(item)}>
                    <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item.user.picture}?alt=media`} alt="Avatar-User" />
                    <div className='member-comment-item-info'>
                        <span>{item.user.fullName}</span>
                        <span className='email'>{item.user.email}</span>
                    </div>
                </div>
            )}
            {data?.length <= 0 && <div className='empty'><span>No result</span></div>}
        </div>
    );
}
export default ModalMemberComment;