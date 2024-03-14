import React from 'react';
import { useEntityManagement } from '../useEntityManagement'; // Adjust the path as needed
import DynamicList from "./DynamicList";
import './AdminDashboard.css';

function AdminFlights() {
    const getCurrentLocalDateTime = () => {
        const date = new Date();
        const tzOffset = date.getTimezoneOffset() * 60000; // timezone offset in milliseconds
        return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    };

    // API configuration for flight management
    const apiConfig = {
        fetchUrl: 'http://localhost:3001/flights',
        addUrl: 'http://localhost:3001/flights/add',
        removeUrl: 'http://localhost:3001/flights/remove',
        entityName: 'flight',
        idField: 'flight_id'
    };

    // Use the custom hook for entity management
    const {
        entities: flights,
        newEntity: newFlight,
        setNewEntity: setNewFlight,
        addEntity: handleAddFlight,
        removeEntity
    } = useEntityManagement(apiConfig);

    // Initialize the new flight state
    if (Object.keys(newFlight).length === 0) {
        setNewFlight({
            aircraft_id: 1,
            origin_id: 1,
            destination_id: 2,
            departure_datetime: getCurrentLocalDateTime(),
            arrival_datetime: getCurrentLocalDateTime(),
            base_price: 100
        });
    }

    // Handle add aircraft
    const onAddFlight = async (e) => {
        e.preventDefault();
        await handleAddFlight();
    };

    // Handle remove flight
    const onRemove = async (index) => {
        const flightToRemove = flights[index];
        await removeEntity(flightToRemove.flight_id);
    };

    return (
        <div>
            {/* Manage Flights */}
            <h3>Manage Flights</h3>
            <form onSubmit={onAddFlight}>
                <label>
                    Origin Destination ID:
                    <input
                        type="number"
                        value={newFlight.origin_id}
                        onChange={(e) => setNewFlight({...newFlight, origin_id: e.target.value})}
                    />
                </label>
                <label>
                    Destination ID:
                    <input
                        type="number"
                        value={newFlight.destination_id}
                        onChange={(e) => setNewFlight({...newFlight, destination_id: e.target.value})}
                    />
                </label>
                <label>
                    Departure Datetime:
                    <input
                        type="datetime-local"
                        value={newFlight.departure_datetime}
                        onChange={(e) => setNewFlight({...newFlight, departure_datetime: e.target.value})}
                    />
                </label>
                <label>
                    Arrival Datetime:
                    <input
                        type="datetime-local"
                        value={newFlight.arrival_datetime}
                        onChange={(e) => setNewFlight({...newFlight, arrival_datetime: e.target.value})}
                    />
                </label>
                <label>
                    Aircraft ID:
                    <input
                        type="number"
                        value={newFlight.aircraft_id}
                        onChange={(e) => setNewFlight({...newFlight, aircraft_id: e.target.value})}
                    />
                </label>
                <label>
                    Base Price:
                    <input
                        type="number"
                        value={newFlight.base_price}
                        onChange={(e) => setNewFlight({...newFlight, base_price: e.target.value})}
                    />
                </label>
                <button type="submit">Add Flight</button>
            </form>

            {/* Display existing flights */}
            <DynamicList
                data={flights}
                columns={['flight_id', 'origin_id', 'destination_id', 'departure_datetime', 'arrival_datetime', 'aircraft_id', 'base_price']}
                onRemove={onRemove}
            />
        </div>
    );
}

export default AdminFlights;
