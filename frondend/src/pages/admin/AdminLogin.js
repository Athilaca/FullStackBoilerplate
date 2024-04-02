import React,{useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin } from '../../redux/adminAuthSlice';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const dispatch = useDispatch();
  // const _loading = useSelector((state) => state.adminAuth.loading);
  const error = useSelector((state) => state.adminAuth.error);
  const navigate = useNavigate(); 

  

  const handleAdminLogin = (e) => {
    e.preventDefault();
    dispatch(adminLogin({ email, password })).then((result) => {
      console.log(result.payload)
      if (!result.error) {
        navigate('/admin-dashboard'); // Navigate to home page after successful login
      };
       });
  };
   

  
  return (
      <>
  <div className="container">
     <section className='heading m-5'>
     <h2>Admin Login</h2>
     
     </section>
        <section className='form'>
        <form onSubmit={handleAdminLogin}>
          <div className="form-group mt-3">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <button
              type="submit"
              className="btn btn-dark "
            
            >
               Submit
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </div>
        </form>
    
        </section>
      </div>
  
</>
    
  )
}

export default AdminLogin
