import React from 'react';
import { useEntityManagement } from '../useEntityManagement'; // Adjust the path as needed
import DynamicList from "./DynamicList";
import './AdminDashboard.css';

function AdminDestinations() {
    // API configuration for destination management
    const apiConfig = {
        fetchUrl: 'http://localhost:3001/destination',
        addUrl: 'http://localhost:3001/destination/add',
        removeUrl: 'http://localhost:3001/destination/remove',
        entityName: 'destinations',
        idField: 'destination_id'
    };

    // Use the custom hook for entity management
    const {
        entities: destinations,
        newEntity: newDestination,
        setNewEntity: setNewDestination,
        addEntity: handleAddDestination,
        removeEntity: removeDestination
    } = useEntityManagement(apiConfig);

    // Handle add destination
    const onAddDestination = async (e) => {
        e.preventDefault();
        await handleAddDestination();
    };

    // Handle remove destination
    const onRemove = async (index) => {
        const destinationToRemove = destinations[index];
        await removeDestination(destinationToRemove.destination_id);
    };

    return (
        <div>
            {/* Manage Destinations */}
            <div>
                <h3>Manage Destinations</h3>
                <form onSubmit={onAddDestination}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={newDestination.destination_name || ''}
                            onChange={(e) => setNewDestination({...newDestination, destination_name: e.target.value})}
                        />
                    </label>
                    {/* Add more input fields for destination properties as needed */}
                    <button type="submit">Add Destination</button>
                </form>
            </div>

            {/* Display existing destinations */}
            <DynamicList
                data={destinations}
                columns={['destination_id', 'destination_name']}
                onRemove={onRemove}
            />
        </div>
    );
}

export default AdminDestinations;
