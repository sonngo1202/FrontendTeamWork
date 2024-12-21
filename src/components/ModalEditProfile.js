import { useState, useEffect } from 'react';
import '../assets/css/ModalEditProfile.css';
import { update } from '../services/authService';
import Cookies from 'js-cookie';
import ReactDOM from 'react-dom';

const ModalEditProfile = ({ user, setIsEditProfileOpen, fetchUserData }) => {
    const [fullName, setFullName] = useState(user.fullName);
    const [job, setJob] = useState(user.job);
    const [location, setLocation] = useState(user.location);

    useEffect(() => {
        setFullName(user.fullName);
        setJob(user.job);
        setLocation(user.location);
    }, [user]);

    const updateUser = async () => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            try {
                const data = await update(fullName, job, location, accessToken);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
    }

    const handleUpdate = () => {
        const accessToken = Cookies.get('accessToken');

        updateUser()
            .then(() => {
                return fetchUserData(accessToken);
            })
            .catch((error) => {
                console.error("Failed to update user:", error);
            });
        setIsEditProfileOpen(false);
    };

    return ReactDOM.createPortal(
        <div className={`modal-edit-profile-overlay`}>
            <div className='container-modal-edit-profile'>
                <div className='modal-edit-profile-header'>
                    <span>Edit profile</span>
                    <button onClick={() => setIsEditProfileOpen(false)}><i className='fas fa-times'></i></button>
                </div>
                <div className='modal-edit-profile-content'>
                    <div className='modal-edit-profile-item'>
                        <label>Your full name <span>*</span></label>
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='modal-edit-profile-item'>
                        <label>Job <span>*</span></label>
                        <input
                            value={job}
                            onChange={(e) => setJob(e.target.value)}
                            required
                        />
                    </div>
                    <div className='modal-edit-profile-item'>
                        <label>Location <span>*</span></label>
                        <input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button className='btn-save' onClick={handleUpdate}>Save</button>
            </div>
        </div>,
        document.body
    );
};

export default ModalEditProfile;
