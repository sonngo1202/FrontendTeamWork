import React, { useEffect, useRef, useState } from "react";
import "../assets/css/Home.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import Option from "./Option";
import ModalEditProfile from "./ModalEditProfile";
import ModalChangePassword from "./ModalChangePassword";
import ModalGroupDetail from "./ModalGroupDetail";

const Home = () => {
    const navigate = useNavigate();
    const { user, fetchUserData } = useOutletContext();
    const [isOpenOption, setIsOpenOption] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Active');
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
    const optionRef = useRef(null);
    const buttonRef = useRef(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (user?.roles) {
            let filterData = user.roles.filter((item) =>
                item.group.isClosed === (selectedOption !== 'Active')
            );
            setData(filterData);
        }else{
            setData([]);
        }
    }, [selectedOption, user?.roles])

    const select = [
        { name: "Active" },
        { name: "Archive" }
    ];
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

    const handleOpenOption = () => {
        setIsOpenOption(!isOpenOption);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                optionRef.current &&
                !optionRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpenOption(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                        <button onClick={() => setIsEditProfileOpen(true)}>Edit profile</button>
                        <button onClick={() => setIsChangePasswordOpen(true)}>Change password</button>
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
                        <span className="project-title-name">Groups</span>
                        <button ref={buttonRef} onClick={handleOpenOption}><span>{selectedOption}</span> <i className='dropdown-icon fas fa-caret-down'></i></button>
                        {isOpenOption && (
                            <div ref={optionRef}>
                                <Option
                                    list={select}
                                    selectedItem={selectedOption}
                                    setSelectedItem={setSelectedOption}
                                />
                            </div>
                        )}
                    </div>
                    <div className="project-grid">
                        {selectedOption === 'Active' && <div className="project-item add-project" onClick={() => setIsAddGroupOpen(true)}>
                            <div className="icon-container">
                                <i className="fas fa-plus-circle"></i>
                            </div>
                            <span>Create group</span>
                        </div>}
                        {data.map((item, index) =>
                            <div key={index} className="project-item" onClick={() => navigate(`/group/${item.group.id}/board`)}>
                                <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${item.group.picture}?alt=media`} alt="Avatar-Group" />
                                <span>{item.group.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isEditProfileOpen && (<ModalEditProfile user={user} setIsEditProfileOpen={setIsEditProfileOpen} fetchUserData={fetchUserData} />)}
            {isChangePasswordOpen && (<ModalChangePassword user={user} setIsChangePasswordOpen={setIsChangePasswordOpen} />)}
            {isAddGroupOpen && (<ModalGroupDetail setClose={setIsAddGroupOpen} fetchUserData={fetchUserData} />)}
        </div>
    );
};

export default Home;
