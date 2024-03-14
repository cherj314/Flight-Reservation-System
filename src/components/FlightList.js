import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FlightList.css';

function FlightList() {
  const [flights, setFlights] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState('');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        let url;
        if (selectedDestination === '') {
          // If "All Destinations" is selected, use a different URL
          url = 'http://localhost:3001/airline/flights';
        } else {
          // If a specific destination is selected, use its ID in the URL
          url = `http://localhost:3001/airline/flights/destination/${selectedDestination}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchFlights();

    // Fetch destinations
    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:3001/destination');
        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, [selectedDestination]);

  const handleDestinationChange = (event) => {
    setSelectedDestination(event.target.value);
  };

  return (
    <div className="flight-table-container">
      <h2>Available Flights</h2>
      <div>
        <label htmlFor="destinationSelect">Select Destination: </label>
        <select
          id="destinationSelect"
          onChange={handleDestinationChange}
          value={selectedDestination}
        >
          <option value="">All Destinations</option>
          {destinations.map((destination) => (
            <option
              key={destination.destination_id}
              value={destination.destination_id}
            >
              {destination.destination_name}
            </option>
          ))}
        </select>
      </div>
      <table className="flight-table">
        <thead>
          <tr>
            <th>Origin</th>
            <th>Destination</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Aircraft</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.flight_id}>
              <td>{flight.origin.destination_name}</td>
              <td>{flight.destination.destination_name}</td>
              <td>{flight.departure_datetime}</td>
              <td>{flight.arrival_datetime}</td>
              <td>{flight.aircraft.aircraft_name}</td>
              <td>
                <Link to={`/seat-map/${flight.flight_id}`}>Select</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FlightList;
