import { Helmet } from "react-helmet";
import logo from '../assets/image/logo.png';
import FormInput from '../components/FormInput';
import { useEffect, useState } from "react";
import '../assets/css/ForgotPasswordPage.css';
import {forgotPassword} from "../services/authService";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [formValid, setFormValid] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setFormValid(email);
    }, [email]);

    const handleForgotPassword = async(e) => {
        e.preventDefault();
        try{
            const success = await forgotPassword(email);
            if(success){
                navigate('/rest-password', {state : {email}});
            }
        }catch(err){
            setError(err.message);
        }
    }

    const handleCloseError = () => {
        setError(''); 
    };

    return(
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
            <div className="forgot-password-container">
                <img src={logo} className="logo-signin" alt="Logo"/>
                <h2>Forgot password</h2>
                {error && (
                    <div className="error-message">
                        {error}
                        <button className="close-btn" onClick={handleCloseError}>X</button>
                    </div>
                )} 
                <form onSubmit={handleForgotPassword}>
                    <label>Nhập email của bạn</label>
                    <FormInput type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button type="submit" disabled={!formValid} className={formValid ? "btn-active" : "btn-disabled"}>Send</button>
                </form>
            </div>
        </>
    );
};
export default ForgotPasswordPage;