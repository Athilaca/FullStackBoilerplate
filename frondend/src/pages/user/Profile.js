import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { useSelector,useDispatch } from 'react-redux';
import profilePic from '../../assets/image.jpg';
import { uploadProfilePicture } from '../../redux/authSlice'; 
import{updateProfilePicture}  from '../../redux/authSlice';


const Profile = () => {
  
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profile_picture', selectedFile);
      dispatch(uploadProfilePicture(formData)).then((response) => {
      if (response.payload) {
        dispatch(updateProfilePicture(response.payload));
      }
    });
    }
  };

  return (
    <>
   <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          <Card style={{ width: '12rem'}}>
            <Card.Img variant="top" src={user ? `http://127.0.0.1:8000${user.profile_picture}` : profilePic} alt=""/>
              
            <Card.Body>
              <Card.Title>{user ? user.name : 'John Doe'}</Card.Title> 
            </Card.Body>
            <input type="file" onChange={handleFileChange}/>
             <button className="btn btn-dark m-3"  onClick={handleUpload}>Upload</button>
          </Card>
        </div>
        <div className="col-md-4 mt-5">
          <div>
            {user ? (
        <div>
          <h6>Welcome, {user.name}</h6>
          <h6>Email: {user.email}</h6>
        </div>
      ) : (
        <p>User is not logged in.</p>
      )}
            
          </div>
        </div>
      </div>
    </div>
      
    </>
  )
}

export default Profile
