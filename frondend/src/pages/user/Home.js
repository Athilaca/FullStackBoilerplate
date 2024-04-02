import React,{useState} from 'react';
import profilePic from '../../assets/image.jpg'; 
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';



const Home = () => {
  const navigate=useNavigate()
  const user = useSelector((state) => state.auth.user);

  const handleLogout=()=>{
    localStorage.removeItem('user')
    navigate('login')
  }
  return (
    <div className="container mt-5">
      <div style={{ width: '5rem' ,height:'5rem'}}>
        <img variant="top" src={user ? `http://127.0.0.1:8000${user.profile_picture}` : profilePic} alt="" style={{ width: '80%', height: 'auto', borderRadius: '50%',cursor:"pointer" }}
        onClick={() => navigate('/profile')}/>
        
          <h6>{user && user.name}</h6> 
        
      </div>
      <div className="mt-4">
        <h1>Welcome to My Homepage</h1>
        <p>This is a simple homepage created with React and django.</p>
      </div>
      <button className='btn btn-secondary btn-md' onClick={handleLogout}>{user?'LOGOUT':'LOGIN'}</button>
    </div>
  );
};

export default Home;


