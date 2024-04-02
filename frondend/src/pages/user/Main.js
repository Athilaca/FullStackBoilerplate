import React from 'react'
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import AdminLogin from '../admin/AdminLogin';
import AdminDashboard from '../admin/AdminDashboard';
import Profile from './Profile';
import { useSelector } from 'react-redux';

const Main = () => {

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <div>
      <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="register" element={<Register/>} />
        <Route path="profile" element={<Profile/>} />
        <Route path="admin-login" element={<AdminLogin/>} />
        <Route path="admin-dashboard" element={<AdminDashboard/>} />
      </Routes>
      </Router>
    </div>
  )
}

export default Main