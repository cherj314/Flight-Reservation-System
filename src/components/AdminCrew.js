import React, { useEffect, useState } from 'react';
import { useEntityManagement } from '../useEntityManagement'; // Adjust the path as needed
import DynamicList from "./DynamicList";
import './AdminDashboard.css';

function FlightCrew() {
    const [searchOption, setSearchOption] = useState(false);
    const [flight, setFlight] = useState();


    // API configuration for crew management
    const apiConfig = {
        fetchUrl: 'http://localhost:3001/crews',
        addUrl: 'http://localhost:3001/crews/add',
        removeUrl: 'http://localhost:3001/crews/remove',
        entityName: 'crew',
        idField: 'crew_id',
        option: searchOption
    };

    // Use the custom hook for entity management
    const {
        entities: crews,
        fetchEntities,
        setEntities,
        newEntity: newCrew,
        setNewEntity: setNewCrew,
        addEntity: handleAddCrew,
        removeEntity
    } = useEntityManagement(apiConfig);

    // Handle add crew member
    const onAddCrew = async (e) => {
        e.preventDefault();
        await handleAddCrew();
    };

    // Handle remove crew member
    const onRemove = async (index) => {
        const crewToRemove = crews[index];
        await removeEntity(crewToRemove.crew_id);
    };

    const handleOption = (event) => {
        setSearchOption(event.target.checked);
        if (!event.target.checked) {
            fetchEntities(); // Trigger fetchEntities when searchOption becomes false
        }
    };


    const handleFlightChange = (event) => {
        setFlight(event.target.value);
    };

    const fetchListCrew = async () => {
        if (!flight || flight === '0') {
            console.log('Invalid flight number. No action taken.');
            setEntities([]); // Clear the crews data when the flight number is invalid or 0
            return; // Exits the function if the flight number is invalid or 0
        }

        try {
            const response = await fetch(`http://localhost:3001/flights/info/${flight}`);
            if (response.ok) {
                const data = await response.json();
                setEntities(data.crew);
            } else {
                console.error(`Error fetching ${apiConfig.entityName}:`, response.statusText);
                setEntities([]); // Clear the crews data when there's an error
            }
        } catch (error) {
            console.error(`Error fetching ${apiConfig.entityName}:`, error);
            setEntities([]); // Clear the crews data when there's an error
        }
    };

    useEffect(() => {
        if (!searchOption) {
            fetchEntities(); // Add this line to trigger fetchEntities when searchOption becomes false
        } else {
            fetchListCrew();
        }
    }, [searchOption]);

    return (
        <div>
            {/* Manage Crews */}
            <div>
                <h3>Manage Crews</h3>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '0',
                        whiteSpace: 'nowrap'
                    }}>
                        List by Flight
                        <input
                            type="checkbox"
                            checked={searchOption}
                            onChange={handleOption}
                        />
                    </label>
                </div>
                { searchOption  &&
                    <div>
                        <label>
                            Introduce Flight Number: <br></br>
                            <input
                                type="text"
                                value={flight}
                                onChange={handleFlightChange}
                                style={{ maxWidth: '30px' }}
                            />
                        </label>
                        <button onClick={fetchListCrew}>Fetch Crew List</button>
                    </div>
                }

                {!searchOption &&
                    <form onSubmit={onAddCrew}>

                    <label>
                        Name:
                        <input
                            type="text"
                            value={newCrew.name || ''}
                            onChange={(e) => setNewCrew({...newCrew, name: e.target.value})}
                        />
                    </label>
                    <label>
                        Position:
                        <input
                            type="text"
                            value={newCrew.position || ''}
                            onChange={(e) => setNewCrew({...newCrew, position: e.target.value})}
                        />
                    </label>
                    <button type="submit">Add Crew</button>
                </form> }
            </div>

            {/* Display existing crews */}
            <DynamicList
                data={crews}
                columns={['crew_id', 'name', 'position']}
                onRemove={onRemove}
            />
        </div>
    );
}

export default FlightCrew;
