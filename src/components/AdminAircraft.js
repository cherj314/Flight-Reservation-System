import React from 'react';
import { useEntityManagement } from '../useEntityManagement'; // Adjust the path as needed
import DynamicList from "./DynamicList";
import './AdminDashboard.css';

function AdminAircraft() {
    // API configuration for aircraft management
    const apiConfig = {
        fetchUrl: 'http://localhost:3001/aircraft',
        addUrl: 'http://localhost:3001/aircraft/add',
        removeUrl: 'http://localhost:3001/aircraft/remove',
        entityName: 'aircraft',
        idField: 'aircraft_id'
    };

    // Use the custom hook for entity management
    const {
        entities: aircraft,
        newEntity: newAircraft,
        setNewEntity: setNewAircraft,
        addEntity: handleAddAircraft,
        removeEntity
    } = useEntityManagement(apiConfig);

    // Handle add aircraft
    const onAddAircraft = async (e) => {
        e.preventDefault();
        await handleAddAircraft();
    };

    // Handle remove aircraft
    const onRemove = async (index) => {
        const aircraftToRemove = aircraft[index];
        await removeEntity(aircraftToRemove.aircraft_id);
    };

    return (
        <div>
            {/* Manage Aircraft */}
            <div>
                <h3>Manage Aircraft</h3>
                <form onSubmit={onAddAircraft}>
                    <label>
                        Aircraft Name:
                        <input
                            type="text"
                            value={newAircraft.aircraft_name || ''}
                            onChange={(e) => setNewAircraft({...newAircraft, aircraft_name: e.target.value})}
                        />
                    </label>
                    <label>
                        Seats Capacity:
                        <input
                            type="number"
                            value={newAircraft.seats_capacity || ''}
                            onChange={(e) => setNewAircraft({...newAircraft, seats_capacity: e.target.value})}
                        />
                    </label>
                    <button type="submit">Add Aircraft</button>
                </form>
            </div>

            {/* Display existing aircraft */}
            <DynamicList
                data={aircraft}
                columns={['aircraft_id', 'aircraft_name', 'seats_capacity']}
                onRemove={onRemove}
            />
        </div>
    );
}

export default AdminAircraft;
