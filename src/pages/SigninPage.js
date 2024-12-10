import React, {useState } from "react";
import {signin} from '../services/authService'
import { Link, useNavigate } from "react-router-dom";
import FormInput from '../components/FormInput';
import logo from '../assets/image/logo.png';
import '../assets/css/SigninPage.css';
import { Helmet } from 'react-helmet';

function SigninPage({ setIsAuthenticated }){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async(e) => {
        e.preventDefault();
        try{
            const data = await signin(email, password);
            console.log('Signin successful:', data);
            setIsAuthenticated(true);
            navigate('/my-home');
        }catch(err){
            setError(err.message)
            setPassword('');
        }
    }

    const handleCloseError = () => {
        setError(''); 
    };

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
            <div className="signin-container"> 
                <img src={logo} className="logo-signin" alt="Logo"/>
                <h2>Sign in to Pandoras</h2>
                {error && (
                    <div className="error-message">
                        {error}
                        <button className="close-btn" onClick={handleCloseError}>X</button>
                    </div>
                )} 
                <form onSubmit={handleLogin}>
                    <label>Email</label>
                    <FormInput type='email' value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} required />
                    <div className="lable-password">
                        <label>Password</label>
                        <Link to="/forgot-password">Quên mật khẩu?</Link>
                    </div>
                    <FormInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Sign in</button>
                </form>
                <div className="new-account">
                    <label>Bạn là người mới?</label>
                    <Link to={"/sign-up"}>Tạo tài khoản mới</Link>
                </div>
            </div>
        </>
        
    );
}

export default SigninPage;