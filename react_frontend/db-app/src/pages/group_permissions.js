import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './group_permissions.css';
import { useParams, useNavigate } from 'react-router-dom';

function Groups() {
    const user = JSON.parse(localStorage.getItem('user'));
    const user_id = user.ind_id;
    const [permissions, setPermissions] = useState([]);
    const [canEditPermissions, setCanEditPermissions] = useState(false);
    const { group_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPermissions();
        fetchCanEdit();
    }, []);

    const fetchPermissions = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/get_group_permissions?group_id=${group_id}`);
            setPermissions(response.data);
        } catch (error) {
            console.error('There was an error fetching the group permissions!', error);
        }
    }

    const fetchCanEdit = async () => {
        try {
            const response = await axios.post(`http://127.0.0.1:5000/api/can_modify_group_permissions`, {"user_id": user_id, "group_id": group_id});
            setCanEditPermissions(response.data.manage_mem);
        } catch (error) {
            console.error('There was an error determining if you are an admin!', error);
        }
    }

    const savePermissions = async () => {
        const permList = document.getElementById("permission-list");
        const rows = permList.children[1].children;
        let permissionData = [];
        for (let i = 0; i < rows.length; i++) {
            console.log(rows[i].children[5]);
            permissionData.push(
                {
                    "role_id": rows[i].children[5].textContent,
                    "manage_mem": rows[i].children[1].children[0].checked,
                    "create_sg": rows[i].children[2].children[0].checked,
                    "add_exp": rows[i].children[3].children[0].checked,
                    "modify_exp": rows[i].children[4].children[0].checked
                }
            )
        }
        axios.post(`http://127.0.0.1:5000/api/modify_group_permissions`, permissionData);
    }

    const handleEditChange = (index, field) => (event) => {
        const updatedPermissions = [...permissions];
        updatedPermissions[index] = {
            ...updatedPermissions[index],
            [field]: event.target.checked,
        };
        setPermissions(updatedPermissions);
    };

    const goToGroups = () => {
        navigate('/groups');
        navigate(0); // Add navigate(0) to make sure the navigated page is refreshed once you go there
    };

    const goDashboard = () => {
        navigate('/dashboard');
        navigate(0); // Add navigate(0) to make sure the navigated page is refreshed once you go there
    };

    if (canEditPermissions) {
        return (
            <div className="permissions-table">
                <header className="header">
                    <h1>Group Permissions Management</h1>
                </header>
                <h3 className="intro" style={{ textAlign: 'center' }}>Manage your group permissions.</h3>
                <div className="expense-list" id="permission-list">
                    <div className="table-row">
                        <div className="table-header">Group Member</div>
                        <div className="table-header">Can Manage Group Member Permissions</div>
                        <div className="table-header">Can Modify Group Spending Goals</div>
                        <div className="table-header">Can Add Group Expense</div>
                        <div className="table-header">Can Modify Group Expense</div>
                    </div>
                    {permissions.map((permission, index) => (
                        <div className="table-row" key={index}>
                            <div>{permission.name}</div>
                            <div><input type='checkbox' checked={permission.manage_mem} onChange={handleEditChange(index, 'manage_mem')}></input></div>
                            <div><input type='checkbox' checked={permission.create_sg} onChange={handleEditChange(index, 'create_sg')}></input></div>
                            <div><input type='checkbox' checked={permission.add_exp} onChange={handleEditChange(index, 'add_exp')}></input></div>
                            <div><input type='checkbox' checked={permission.modify_exp} onChange={handleEditChange(index, 'modify_exp')}></input></div>
                            <div hidden={true}>{permission.role_id}</div>
                        </div>
                    ))}
                </div>
                <br></br>
                <button onClick={savePermissions} className="action-button">Save Permissions</button>
                <br></br>
                <button onClick={goToGroups} className="action-button">Back to Group Management</button>
                <br></br>
                <button onClick={goDashboard} className="action-button">Return to Dashboard</button>
            </div>
        );
    } else {
        return (
            <div className="NoPermissionsPage">
                <h1>Manage Group Permissions</h1>
                <p>You do not have permission to manage permissions for this group!</p>
                <div className="button-group">
                    <button onClick={goToGroups} className="action-button">Back to Group Management</button>
                    <br></br> <br></br>
                    <button onClick={goDashboard} className="action-button">Return to Dashboard</button>
                </div>
            </div>
        );
    }
}
export default Groups;
