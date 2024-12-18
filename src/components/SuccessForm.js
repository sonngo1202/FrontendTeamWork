import '../assets/css/SuccessForm.css';

const SuccessForm = ({content, setClose}) => {
    return (
        <div className='container-success'>
            <div className='success-icon'>
                <i className='fas fa-check'></i>
            </div>
            <span>{content}</span>
            <button onClick={() => setClose(false)}>OK</button>
        </div>
    );
}
export default SuccessForm;