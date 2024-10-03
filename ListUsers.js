import React, { useEffect, useState } from 'react';
import { listOfUsers, deleteUser } from '../service/UserService';
import UserForm from './UserForm';
import { useNavigate } from 'react-router-dom';

const ListUsers = () => {
    const [users, setUsers] = useState([]);
    const [userToUpdate, setUserToUpdate] = useState(null);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getAllUser();
    }, []);

    async function getAllUser() {
        try {
            const response = await listOfUsers();
            setUsers(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpdateClick = (user) => {
        setUserToUpdate(user);
        setIsUpdateMode(true);
    };

    const handleSave = (user) => {
        console.log('User saved:', user);
        setUsers((prevUsers) => [...prevUsers, user]);
        setUserToUpdate(null); // Reset the form after saving
        setIsUpdateMode(false); // Switch back to Add mode
        getAllUser();
    };

    const handleViewClick = (userId) => {
        navigate(`/contact-detail/${userId}`);
    };

    const handleDeleteClick = async (userId) => {
        try {
            await deleteUser(userId); // Call the delete API
            const updatedUsers = users.filter(user => user.id !== userId); // Create a new array without the deleted user
            setUsers(updatedUsers); // Update the state with the new array
        } catch (error) {
            console.error(error);
        }
    };


    return (

        <div className='container'>

            {!isUpdateMode && <UserForm onSave={handleSave} />}
            {isUpdateMode && <UserForm user={userToUpdate} onSave={handleSave} />}
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(
                            user =>
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.contact}</td>
                                    <td>
                                        <button className='btn btn-light' onClick={() => handleViewClick(user.id)}>View</button>
                                        <button className='btn btn-light' style={{ marginLeft: '10px' }} onClick={() => handleUpdateClick(user)}>Update</button>
                                        <button className='btn btn-light' style={{ marginLeft: '10px' }}onClick={() => handleDeleteClick(user.id)}>Delete</button>
                                    </td>
                                </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default ListUsers;