import { Helmet } from "react-helmet";
import logo from '../assets/image/logo.png';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FormInput from "../components/FormInput";
import '../assets/css/ResetPasswordPage.css';
import {resendCode, resetPassword} from "../services/authService";

function ResetPasswordPage(){
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [formValid, setFormValid] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [showPasswordMismatchError, setShowPasswordMismatchError] = useState(false);

    const isPasswordValid = 
        newPassword.length >= 8 &&
        /[A-Za-z]/.test(newPassword) &&
        /\d/.test(newPassword) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    useEffect(() => {
        const passwordDelay = setTimeout(() => {
            setShowPasswordError(!isPasswordValid && newPassword);
        }, 500); 

        return () => clearTimeout(passwordDelay); 
    }, [newPassword]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setShowPasswordMismatchError(newPassword && confirmPassword && newPassword !== confirmPassword);
        }, 700);

        return () => clearTimeout(delay); 
    }, [newPassword, confirmPassword]);
    
    useEffect(() => {
        setFormValid(
            code && isPasswordValid && newPassword === confirmPassword
        );
    }, [newPassword, confirmPassword, code]);

    const handleCloseError = () => {
        setError(''); 
    };

    const handleResendCode = async (e) => {
        e.preventDefault();
        try{
            const data = await resendCode(email);
        }catch(err){
            console.log(err.message);
        }
    }

    const handleResetPassword = async (e) =>{
        e.preventDefault();
        try{
            const success = await resetPassword(email, newPassword, code);
            if(success){
                navigate('/sign-in')
            }
        }catch(err){
            setError(err.message);
            setCode('');
        }
    }

    return (
        <>
            <Helmet>
                <style>
                    {`
                        html, body{
                            background-color: #0d1117;
                        }
                    `}
                </style>
            </Helmet>
            <div className="rest-password-container">
                <img src={logo} className="logo-signin" alt="Logo"/>
                <h2>Rest password</h2>
                {error && 
                    <div className="error-message">
                        {error}
                        <button className="close-btn" onClick={handleCloseError}>X</button>
                    </div>
                }
                <form onSubmit={handleResetPassword}>
                    <label>New password*</label>
                    <FormInput type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <label>Confirm password*</label>
                    <FormInput type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <label>Verify code*</label>
                    <FormInput type='text' value={code} onChange={(e) => setCode(e.target.value)} />
                    <button type="submit" disabled={!formValid} className={formValid ? "btn-active" : "btn-disabled"}>Send</button>
                </form>
                {(showPasswordError || showPasswordMismatchError) && <div className="warning-message">
                    {showPasswordError && <p>Mật khẩu phải dài ít nhất 8 ký tự và bao gồm chữ cái, số và ký tự đặc biệt.</p>}
                    {showPasswordMismatchError && <p>Mật khẩu nhập lại không khớp.</p>}
                </div>}
                <div className="footer-verify-code">
                    <label>Bạn không nhận được email?</label>
                    <button onClick={handleResendCode}>Gửi lại mã</button>
                </div>
            </div>
        </>
    );
};
export default ResetPasswordPage;