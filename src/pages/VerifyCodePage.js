import { Helmet } from "react-helmet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from '../assets/image/logo.png';
import FormInput from "../components/FormInput";
import { useEffect, useState } from "react";
import '../assets/css/VerifyCodePage.css';
import {resendCode, verifyCode} from "../services/authService"

function VerifyCodePage(){
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};

    const [code, setCode] = useState('');
    const [formValid, setFormValid] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setFormValid(code);
    }, [code]);

    const handleResendCode = async (e) => {
        e.preventDefault();
        try{
            const data = await resendCode(email);
        }catch(err){
            console.log(err.message);
        }
    }

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try{
            const success = await verifyCode(email, code);
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
                            background: linear-gradient(to right, #1a2a6c, #000000);
                        }
                    `}
                </style>
            </Helmet>
            <div className="verify-code-container">
                <div className="header-signup">
                    <img src={logo} className="logo-signup" alt="Logo"/>
                    <div className="link-sigin-in">
                        <label>Bạn đã có tài khoản?</label>
                        <Link to={"/sign-in"}>Đăng nhập</Link>
                    </div>
                </div>
                <form onSubmit={handleVerifyCode}>
                    <div className="instruction">
                        <label>Bạn đã gần hoàn tất!</label><br/>
                        <label>Chúng tôi đã gửi mã xác nhận đến </label>
                        <label style={{color:'#0DCD79'}}>{email}</label>
                    </div>
                    <label>Verify code*</label>
                    <FormInput type='text' value={code} onChange={(e) => setCode(e.target.value)}/>
                    <button type="submit" disabled={!formValid} className={formValid ? "btn-active" : "btn-disabled"}>Send</button>
                    {error && <p>{error}</p>}
                </form>
                <div className="footer-verify-code">
                    <label>Bạn không nhận được email?</label>
                    <button onClick={handleResendCode}>Gửi lại mã</button>
                </div>
            </div>
        </>
    );
};
export default VerifyCodePage;