import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ user_id: '', name: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('There was an error fetching the users!', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/users', newUser);
      setUsers([...users, response.data]);
      setNewUser({ user_id: '', name: '' });
    } catch (error) {
      console.error('There was an error adding the user!', error);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.user_id}>{user.user_id}: {user.name}</li>
        ))}
      </ul>
      <h2>Add a new user</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="user_id"
          placeholder="User ID"
          value={newUser.user_id}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleInputChange}
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default Users;