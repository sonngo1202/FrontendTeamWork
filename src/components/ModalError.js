import ReactDOM from 'react-dom';
import '../assets/css/ModalError.css';

const ModalError = ({ error, setClose }) => {
    return ReactDOM.createPortal(
        <div className={`modal-error-overlay`}>
            <div className="container-modal-error">
                <span>{error}</span>
                <button onClick={() => setClose(false)}>OK</button>
            </div>
        </div>,
        document.body
    );
}
export default ModalError;