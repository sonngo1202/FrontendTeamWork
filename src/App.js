import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import VerifyCodePage from './pages/VerifyCodePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import IntroducePage from './pages/IntroducePage';
import MainPage from './pages/MainPage';
import Home from './components/Home';
import Group from './components/Group';
import BoardGroup from './components/BoardGroup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('accessToken'));

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('accessToken');
      setIsAuthenticated(!!token)
    };

    const interval = setInterval(checkAuth, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/my-home" /> : <IntroducePage />} />
      <Route path="/sign-in" element={isAuthenticated ? <Navigate to="/my-home" /> : <SigninPage setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/sign-up" element={isAuthenticated ? <Navigate to="/my-home" /> : <SignupPage />} />
      <Route path="/verify-code" element={isAuthenticated ? <Navigate to="/my-home" /> : <VerifyCodePage />} />
      <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/my-home" /> : <ForgotPasswordPage />} />
      <Route path="/rest-password" element={isAuthenticated ? <Navigate to="/my-home" /> : <ResetPasswordPage />} />
      <Route path="/" element={isAuthenticated ? <MainPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/sign-in" />}>
        <Route path="group/:id/" element={<Group />}>
          <Route path="board" element={<BoardGroup />} />
        </Route>
        <Route path="my-home" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
