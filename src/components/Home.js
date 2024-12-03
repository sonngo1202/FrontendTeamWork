import React from "react";
import "../assets/css/Home.css";
import { useOutletContext } from "react-router-dom";

const Home = () => {
    const {user} = useOutletContext();
    const getCurrentTimeDetails = () => {
        const now = new Date();
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const dayName = dayNames[now.getDay()];
        const monthName = monthNames[now.getMonth()];
        const date = now.getDate();
        const year = now.getFullYear();
        const hours = now.getHours();

        let greeting = "Good morning";
        if (hours >= 12 && hours < 18) {
            greeting = "Good afternoon";
        } else if (hours >= 18) {
            greeting = "Good evening";
        }

        return {
            fullDate: `${dayName}, ${monthName} ${date}, ${year}`,
            greeting
        };
    };

    const { fullDate, greeting } = getCurrentTimeDetails();

    return (
        <div className="container-home">
            <h1 className="title">Home</h1>
            <p className="home-date">{fullDate}</p>
            <p className="home-greeting">{`${greeting}, ${user?.fullName}`}</p>
            <div className="home-content">
                <div className="profile-content">
                    <div className="profile-title">
                        <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${user?.picture}?alt=media`} alt="Profile" className="profile-image" />
                        <div className="right-title">
                            <p className="profile-name">{user?.fullName}</p>
                        </div>
                    </div>
                    <div className="profile-button">
                        <button>Edit profile</button>
                        <button>Change password</button>
                    </div>
                    <div className="profile-list">
                        <div className="profile-item">
                            <i className="fas fa-envelope"></i>
                            <span>{user?.email}</span>
                        </div>
                        <div className="profile-item">
                            <i className="fas fa-briefcase"></i>
                            <span>{user?.job}</span>
                        </div>
                        <div className="profile-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{user?.location}</span>
                        </div>
                    </div>
                </div>
                <div className="project-content">
                    <div className="project-title">
                        <span>Groups</span>
                        <button><span>Active</span> <i className="fas fa-caret-down dropdown-icon"></i></button>
                    </div>
                    <div className="project-grid">
                        <div className="project-item add-project">
                            <div className="icon-container">
                                <i className="fas fa-plus-circle"></i>
                            </div>
                            <span>Create group</span>
                        </div>
                        {user?.roles.map((item, index) => !item.group.isClosed && (
                            <div key={index} className="project-item">
                                <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item.group.picture}?alt=media`} alt="Avatar-Group" />
                                <span>{item.group.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
