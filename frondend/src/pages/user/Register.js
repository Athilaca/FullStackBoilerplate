import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom'; 


const isValidEmail = (email) => {
  return /^[^\s@]+@gmail\.com$/.test(email);
};
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false); 
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const navigate = useNavigate();

  const handleRegister = (e) => {
       e.preventDefault();
     if (!name || !email || !password) {
      alert('All fields are required');
      return;
    }

     if (!isValidEmail(email)) {
      alert('Email should be in the correct format (e.g., example@gmail.com)');
      return;
    }
    dispatch(registerUser({name,email,password})).then((result) => {
      console.log(result.payload)
      if (!result.error)  {
        setEmail('')
        setPassword('')
        setName('')
        navigate('/login'); 
      }
    }) 
  }

  return (
  <div className="container">
     <section className='heading m-5'>
     <h1>signup</h1>
     <h6>please create an account</h6>
     </section>
        <section className='form'>
        <form onSubmit={handleRegister}>
          <div className="form-group mt-3">
            <input
              type="text"
              placeholder="Enter Your Name"
              className="form-control "
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <button
              type="submit"
              className="btn btn-dark "
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </div>
        </form>
        </section>
      </div>
    
  );
}

export default Register
