import { Helmet } from "react-helmet";
import Menu from "../components/Menu";
import Header from "../components/Header";
import '../assets/css/MainPage.css';
import { Outlet } from "react-router-dom";
import Cookies from 'js-cookie';
import { detail } from '../services/authService';
import { useEffect, useState } from "react";

function MainPage({ setIsAuthenticated }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = Cookies.get('accessToken');
            const userCook = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
            if (token && userCook) {
                const userData = await detail(userCook.id, token);
                setUser(userData);
            }
        };
        fetchUserData();
    }, []);

    return (
        <>
            <Helmet>
                <style>
                    {`
                        html, body{
                            background-color: #0d1117;
                            height: 100%;
                            margin: 0;
                            padding: 0;
                        }
                    `}
                </style>
            </Helmet>
            <div className="main-container">
                <Header setIsAuthenticated={setIsAuthenticated} user={user} />
                <div className="main-content">
                    <Menu user={user} />
                    <Outlet context={{ user }} />
                </div>
            </div>
        </>
    );
};
export default MainPage;