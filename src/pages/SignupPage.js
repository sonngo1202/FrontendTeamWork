import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/image/logo.png';
import '../assets/css/SignupPage.css'
import FormInput from '../components/FormInput';
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {signup} from "../services/authService"

function SignupPage(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [fullName, setfullName] = useState('');
    const [job, setJob] = useState('');
    const [location, setLocation] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formValid, setFormValid] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [showEmailError, setShowEmailError] = useState(false);
    const [showPasswordMismatchError, setShowPasswordMismatchError] = useState(false);
    const [errorSignup, setErrorSignup] = useState('');

    const isPasswordValid = 
        password.length >= 8 &&
        /[A-Za-z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const isEmailValid = (email) => 
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    useEffect(() => {
        const passwordDelay = setTimeout(() => {
            setShowPasswordError(!isPasswordValid && password);
        }, 500); 

        return () => clearTimeout(passwordDelay); 
    }, [password]);

    useEffect(() => {
        const emailDelay = setTimeout(() => {
            setShowEmailError(!isEmailValid(email) && email);
            if(errorSignup){
                setErrorSignup('');
            }
        }, 500); 

        return () => clearTimeout(emailDelay);
    }, [email]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setShowPasswordMismatchError(password && confirmPassword && password !== confirmPassword);
        }, 700);

        return () => clearTimeout(delay); 
    }, [password, confirmPassword]);

    useEffect(() => {
        setFormValid(
            isEmailValid(email) && email && fullName && job && location && isPasswordValid && password === confirmPassword
        );
    }, [email, fullName, job, location, password, confirmPassword]);

    const handleLogup = async(e) => {
        e.preventDefault();
        try{
            const success = await signup(email, password, fullName, job, location);
            if(success){
                navigate('/verify-code', { state: { email } });
            }
        }catch(err){
            setErrorSignup(err.message);
        }
    }

    return (
        <>
            <Helmet>
                <style>
                    {`
                        html, body{
                            background: linear-gradient(to right, #1a2a6c, #000000);
                        }
                    `}
                </style>
            </Helmet>
            <div className="signup-container">
                <div className="header-signup">
                    <img src={logo} className="logo-signup" alt="Logo"/>
                    <div className="link-sigin-in">
                        <label>Bạn đã có tài khoản?</label>
                        <Link to={"/sign-in"}>Đăng nhập</Link>
                    </div>
                </div>
                <form onSubmit={handleLogup}>
                    <p>
                        Welcome to Pandora!<br />
                        Hãy bắt đầu hành trình
                    </p>
                    <label>Email*</label>
                    <FormInput type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label>Full name*</label>
                    <FormInput type='text' value={fullName} onChange={(e) => setfullName(e.target.value)} required />
                    <label>Job*</label>
                    <FormInput type='text' value={job} onChange={(e) => setJob(e.target.value)} required />
                    <label>Location*</label>
                    <FormInput type='text' value={location} onChange={(e) => setLocation(e.target.value)} required />
                    <label>Password*</label>
                    <FormInput type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label>Confirm password*</label>
                    <FormInput type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <button type="submit" disabled={!formValid} className={formValid ? "btn-active" : "btn-disabled"}>Continue</button>
                </form>
                {(showEmailError || showPasswordError || showPasswordMismatchError || errorSignup) && <div className="error-message">
                    {showEmailError && <p>Email không hợp lệ.</p>}
                    {showPasswordError && <p>Mật khẩu phải dài ít nhất 8 ký tự và bao gồm chữ cái, số và ký tự đặc biệt.</p>}
                    {showPasswordMismatchError && <p>Mật khẩu nhập lại không khớp.</p>}
                    {errorSignup && <p>{errorSignup}</p>}
                </div>}
            </div>
        </>
    );
}
export default SignupPage;