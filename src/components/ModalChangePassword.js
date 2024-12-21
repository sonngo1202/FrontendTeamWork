import { useEffect, useState } from 'react';
import '../assets/css/ModalChangePassword.css';
import ReactDOM from 'react-dom';
import { changePassword } from '../services/authService';
import Cookies from 'js-cookie';
import SuccessForm from './SuccessForm';

const ModalChangePassword = ({ user, setIsChangePasswordOpen }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPasswod] = useState('');
    const [formValid, setFormValid] = useState(false);
    const [showNewPasswordError, setShowNewPasswordError] = useState(false);
    const [showNewPasswordMismatchError, setShowNewPasswordMismatchError] = useState(false);
    const [showNewPasswordSamechError, setShowNewPasswordSameError] = useState(false);
    const [errorCP, setErrorCP] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const isPasswordValid =
        newPassword.length >= 8 &&
        /[A-Za-z]/.test(newPassword) &&
        /\d/.test(newPassword) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    useEffect(() => {
        const passwordDelay = setTimeout(() => {
            setShowNewPasswordError(!isPasswordValid && newPassword);
        }, 500);

        return () => clearTimeout(passwordDelay);
    }, [newPassword]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setShowNewPasswordMismatchError(newPassword && confirmPassword && newPassword !== confirmPassword);
        }, 700);

        return () => clearTimeout(delay);
    }, [newPassword, confirmPassword]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setShowNewPasswordSameError(newPassword && currentPassword && newPassword === currentPassword);
        }, 700);

        return () => clearTimeout(delay);
    }, [newPassword, currentPassword]);

    useEffect(() => {
        setErrorCP('');
    }, [currentPassword]);

    useEffect(() => {
        setFormValid(
            isPasswordValid && newPassword === confirmPassword && !showNewPasswordSamechError
        );
    }, [newPassword, confirmPassword, currentPassword]);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const accessToken = Cookies.get('accessToken');
            const success = await changePassword(currentPassword, newPassword, accessToken);
            if (success) {
                setIsSuccess(true);
            }
        } catch (err) {
            setErrorCP(err.message);
        }
    }

    return ReactDOM.createPortal(
        <div className={`modal-change-password-overlay`}>
            <div className='container-modal-change-password'>
                {!isSuccess && <div className='modal-change-password-header'>
                    <span>Change password</span>
                    <button onClick={() => setIsChangePasswordOpen(false)}><i className='fas fa-times'></i></button>
                </div>}
                {!isSuccess && <div className='modal-change-password-content'>
                    <div className='modal-change-password-item'>
                        <label>Current password <span>*</span></label>
                        <input
                            type='password'
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className={`${errorCP ? 'error' : ''}`}
                        />
                    </div>
                    <div className='modal-change-password-item'>
                        <label>New password <span>*</span></label>
                        <input
                            type='password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='modal-change-password-item'>
                        <label>Confirm new password <span>*</span></label>
                        <input
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPasswod(e.target.value)}
                            required
                        />
                    </div>
                </div> }
                {!isSuccess && (showNewPasswordError || showNewPasswordMismatchError || showNewPasswordSamechError || errorCP) && <div className="error-message">
                    {showNewPasswordError && <p>Mật khẩu phải dài ít nhất 8 ký tự và bao gồm chữ cái, số và ký tự đặc biệt.</p>}
                    {showNewPasswordMismatchError && <p>Mật khẩu nhập lại không khớp</p>}
                    {showNewPasswordSamechError && <p>Mật khẩu mới không được trùng với mật khẩu hiện tại.</p>}
                    {errorCP && <p>{errorCP}</p>}
                </div>}
                {!isSuccess && <button className={`btn-send ${formValid ? 'btn-active' : ''}`} disabled={!formValid} onClick={handleChangePassword}>Send</button>}
                {isSuccess && <SuccessForm content={'Đổi mật khẩu thành công'} setClose={setIsChangePasswordOpen} />}
            </div>
        </div>,
        document.body
    );
}
export default ModalChangePassword;