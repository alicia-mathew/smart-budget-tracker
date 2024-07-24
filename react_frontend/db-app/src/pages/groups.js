import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './groups.css';

function Groups() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const user_id = user.ind_id;

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/user_groups?user_id=${user_id}`);
            setGroups(response.data);
        } catch (error) {
            console.error('There was an error fetching the groups!', error);
        }
    }

    const createGroup = async(event) => {
        event.preventDefault();
        const groupName = document.getElementById("group_name").value;
        try {
            const response = await axios.post(`http://127.0.0.1:5000/api/create_group`, {"user_id": user_id, "group_name": groupName});
            setGroups(prevGroups => [...prevGroups, response.data]);
        } catch(error) {
            console.error('There was an error creating the group!', error);
        } 
    }

    const joinGroup = async(event) => {
        event.preventDefault();
        const groupId = document.getElementById("group_id").value;
        try {
            const response = await axios.post(`http://127.0.0.1:5000/api/join_group`, {"user_id": user_id, "group_id": groupId});
            setGroups(prevGroups => [...prevGroups, response.data]);
        } catch(error) {
            console.error('There was an error joining the group!', error);
        }
    }

    const goDashboard = () => {
        navigate('/dashboard');
        navigate(0);
    };

    return (
        <div className="groups-table">
            <header className="header">
                <h1>Group Management</h1>
            </header>
            <div className="intro-container">
                <h3 className="intro">Take a look at your group enrollment, manage group permissions, create a new group, or join an existing one!</h3>
            </div>
            <div className="groups-list">
                <div className="table-row">
                    <div className="table-header">Group ID</div>
                    <div className="table-header">Group Name</div>
                    <div className="table-header">Group Permissions</div>
                </div>
                {groups.map(group => (
                    <div className="table-row" key={group.group_id}>
                        <div>{group.group_id}</div>
                        <div>{group.name}</div>
                        <div>
                            <a href={`/groups/manage_permissions/${group.group_id}`}>
                                <button type='button' className="manage-button">
                                    Manage Permissions
                                </button>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <h2>Create a New Group</h2>
                <form onSubmit={createGroup}>
                    <label>Group Name: 
                        <input 
                            type="text"
                            name="group_name"
                            id="group_name"
                            required
                            className="common-style"
                        />
                    </label>
                    <button type="submit" className="action-button">Create</button>
                </form>
            </div>
            <div>
                <h2>Join a New Group</h2>
                <form onSubmit={joinGroup}>
                    <label>Group ID: 
                        <input 
                            type="text"
                            name="group_id"
                            id="group_id"
                            required
                            className="common-style"
                        />
                    </label>
                    <button type="submit" className="action-button">Join</button>
                </form>
            </div>
            <br/>
            <button className="dashboard-button" onClick={goDashboard}>Return to Dashboard</button>
        </div>
    );
}
export default Groups;
