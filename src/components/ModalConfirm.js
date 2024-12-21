import '../assets/css/ModalConfirm.css';
import ReactDOM from 'react-dom';

const ModalConfirm = ({ actionCancel, actionConfirm, message }) => {
    return ReactDOM.createPortal(
        <div className={`modal-confirm-overlay`}>
            <div className="container-modal-confirm">
                <span>{message}</span>
                <div className='modal-confirm-action'>
                    <button className='btn-confirm' onClick={() => actionConfirm()}>Yes</button>
                    <button className='btn-cancel' onClick={() => actionCancel(false)}>No</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
export default ModalConfirm;