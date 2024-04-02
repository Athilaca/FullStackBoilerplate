import React,{useEffect,useMemo,useState} from 'react'
import {Table,Container,Button, Modal, Form} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../../redux/adminSlice';
import { deleteUser ,addUser,updateUser} from '../../redux/adminSlice';
import { Link } from 'react-router-dom'; 

const AdminDashboard = () => {

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]); 

  const users = useSelector(state => state.admin.users);
  const _loading = useSelector(state => state.admin.loading);
  const error = useSelector(state => state.admin.error);
  const token = useSelector((state) => state.adminAuth.token);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers(token));
  },[token]);

  useEffect(() => {
    setFilteredUsers(users);
}, [users]);
  
  const handleDeleteUser = (userId) => {
    dispatch(deleteUser({ userId, token })).then(() => {
    dispatch(fetchUsers(token));
  });
  };

  const handleEditUser = (userId) => {
  const userToEdit = users.find(user => user.id === userId);
  setSelectedUser(userToEdit);
  setShowAddUserModal(true);
};

   const handleAddOrUpdateUser = () => {
    if (selectedUser) {
      const updatedUser = {
      id: selectedUser.id, 
      name: selectedUser.name,
      email: selectedUser.email,
      password: selectedUser.password
    };
    dispatch(updateUser({ userId: selectedUser.id, updatedUser, token })).then(() => {
      setShowAddUserModal(false);
      setSelectedUser(null); 
      dispatch(fetchUsers(token));
    });
    
  }else{
   const newUser = {
      name: newUserName,
      email: newUserEmail,
      password:newUserPassword
    };
    dispatch(addUser({ newUser, token })).then(() => {
      setShowAddUserModal(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      dispatch(fetchUsers(token));
    });
  }
}

const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter users based on search query
    const filtered = users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
};

  return (
   
    <>
    <Container className="align-items-center justify-content-center m-5" >
        <div className='m-5'style={{ backgroundColor: 'black',color:"white", padding: '10px', borderRadius: '5px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>
           <h2> Dashboard</h2>
        </div>
        {!users ? (
          <h6 className="alert alert-danger" role="alert">
            {error}Please <Link to="/admin-login">login</Link> again to view the dashboard.
          </h6>
        ) : (
          <div className="m-5" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="dark" size="lg" onClick={() => setShowAddUserModal(true)}>
              Add New User
            </Button>

             <div className="m-3">
        <input
            type="text"
            className="form-control"
            placeholder="Search users by name or email"
            value={searchQuery}
            onChange={handleSearchInputChange}
        />
    </div>
          </div>
        )}

      
   
      
      <Table responsive="sm" bordered>
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Email</th>
            <th>edit</th>
            <th>delete</th>
            
          </tr>
        </thead>
        <tbody>
           {filteredUsers && filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><Button variant="success" onClick={() =>handleEditUser(user.id)}>
                    Edit
                  </Button></td>
              <td>
              <Button variant="danger"onClick={() =>handleDeleteUser(user.id)}>
                    Delete
                  </Button>
                  </td>
            </tr>
          ))}
          
        </tbody>
      </Table>
    </Container>

     <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
  <Modal.Header >
    <Modal.Title>{selectedUser ? "Edit User" : "Add New User"}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="formUserName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={selectedUser ? selectedUser.name : newUserName}
          onChange={(e) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, name: e.target.value });
    } else {
      setNewUserName(e.target.value);
    }
  }}
        />
      </Form.Group>
      <Form.Group controlId="formUserEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={selectedUser ? selectedUser.email : newUserEmail}
          onChange={(e) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, email: e.target.value });
    } else {
      setNewUserEmail(e.target.value);
    }
  }}
        />
      </Form.Group>
      <Form.Group controlId="formUserPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={selectedUser?selectedUser.password:newUserPassword}
          onChange={(e) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, password: e.target.value });
    } else {
      setNewUserPassword(e.target.value);
    }
  }}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => {setShowAddUserModal(false); setSelectedUser(null);}}>
      Close 
    </Button>
    <Button variant="primary" onClick={handleAddOrUpdateUser}>
      {selectedUser ? "Update User" : "Add User"}
    </Button>
  </Modal.Footer>
</Modal>
    </>
    
   
  )
}

export default AdminDashboard

