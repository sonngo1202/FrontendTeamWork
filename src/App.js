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
import Overview from './components/Overview';
import File from './components/File';
import MyTask from './components/MyTask';
import BoardMyTask from './components/BoardMyTask';
import Notification from './components/Notification';
import Calendar from './components/Calendar';
import DashboardByStatus from './components/DashboardByStatus';
import DashboardByMember from './components/DashboardByMember';
import StatDetail from './components/StatDetail';

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
          <Route path="board/:idWG/tasks/:idTask" element={<BoardGroup />} />
          <Route path="overview" element={<Overview />} />
          <Route path="file" element={<File />} />
          <Route path='dashboard' element={<DashboardByStatus />} />
          <Route path='dashboard/by-status' element={<DashboardByStatus />} />
          <Route path='dashboard/by-member' element={<DashboardByMember />} />
          <Route path='dashboard/by-status/:idS' element={<StatDetail />} />
          <Route path='dashboard/by-member/:idU' element={<StatDetail />} />
        </Route>
        <Route path="my-home" element={<Home />} />
        <Route path='my-task/' element={<MyTask />} >
          <Route path='board' element={<BoardMyTask />} />
          <Route path='calendar' element={<Calendar />} />
        </Route>
        <Route path='my-notification' element={<Notification/>} />
      </Route> 
    </Routes>
  );
}

export default App;
