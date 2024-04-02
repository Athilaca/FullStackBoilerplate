import React,{useState} from 'react'
import { loginUser } from '../../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate ,Link} from 'react-router-dom';

const Login = () => {
    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const navigate = useNavigate(); 

  const handleLogin = (e) => {
    e.preventDefault();
    let userData={
      email,password
    }
    console.log('handleLogin function called')
    dispatch(loginUser(userData)).then((result) => {
      console.log(result.payload)
      if (!result.error)  {
        setEmail('')
        setPassword('')
        navigate('/'); 
      }
    })

    
  };

  return (
  <>
  <div className="container">
     <section className='heading m-5'>
     <h1>Login</h1>
     
     </section>
        <section className='form'>
        <form onSubmit={handleLogin}>
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
              {loading ? 'logging Up...' : 'Submit'}
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </div>
        </form>
    
        </section>
      </div>
      <div className='m-5'>
          <h6 onClick={() => navigate('/register')}>if not a user  <Link to="/register">signup</Link>  here </h6>
          </div>
</>

  )
}

export default Login
