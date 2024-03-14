import React from 'react';
import { useEntityManagement } from '../useEntityManagement'; // Adjust the path as needed
import DynamicList from "./DynamicList";
import './AdminDashboard.css';

function AdminUser() {
    // API configuration for user management
    const apiConfig = {
        fetchUrl: 'http://localhost:3001/users',
        addUrl: 'http://localhost:3001/users/add',
        removeUrl: 'http://localhost:3001/users/remove',
        entityName: 'user',
        idField: 'user_id'
    };

    // Use the custom hook for entity management
    const {
        entities: users,
        newEntity: newUser,
        setNewEntity: setNewUser,
        addEntity: handleAddUser,
        removeEntity
    } = useEntityManagement(apiConfig);

    return (
        <div>
            <h3>List of Registered Users</h3>

            <DynamicList
                data={users}
                columns={['user_id', 'name', 'address', 'email', 'credit_card_number']}
            />
        </div>
    );
}

export default AdminUser;
