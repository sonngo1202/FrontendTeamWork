import React, { useEffect, useState } from "react";
import "../assets/css/Header.css";
import logo from '../assets/image/logo.png';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const Header = ({ setIsAuthenticated, user }) => {

  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(prevState => !prevState);

  const handleLogout = () => {
    Cookies.remove('user');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setIsAuthenticated(false);
    navigate('/sign-in');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-section')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="container-header">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="brand-name">Pandoras</h1>
      </div>
      <div className="search-section">
        <div className="search-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
      </div>
      <div className="profile-section" onClick={toggleDropdown}>
        <img src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${user?.picture}?alt=media`} alt="Avatar" className="avatar" />
        <i className="fas fa-caret-down dropdown-icon"></i>
        {isDropdownOpen && (
          <div className="dropdown-profile">
            <div className="dropdown-header">
              <img
                src={`https://firebasestorage.googleapis.com/v0/b/datn-5ae48.appspot.com/o/${user?.picture}?alt=media`}
                alt="Avatar"
                className="dropdown-avatar"
              />
              <p className="dropdown-username">{user?.fullName}</p>
            </div>
            <div className="dropdown-options">
              <button className="dropdown-option">
                <i className="fas fa-key"></i> Change Password
              </button>
              <button className="dropdown-option">
                <i className="fas fa-edit"></i> Edit Profile
              </button>
            </div>
            <div className="dropdown-divider"></div>
            <button className="dropdown-logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Signout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
