import React, { useState, useEffect } from 'react';
import './AgentDashboard.css';

function AgentDashboard() {
    const [bookings, setBookings] = useState([]);
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState('');
    const [error, setError] = useState(null);


    useEffect(() => {
        // Fetch flights for dropdown
        const fetchFlights = async () => {
            try {
                const response = await fetch('http://localhost:3001/flights'); // Adjust the endpoint as needed
                const data = await response.json();
                setFlights(data);
            } catch (error) {
                console.error('Error fetching flights:', error);
            }
        };

        fetchFlights();

        // Fetch bookings
        const fetchBookings = async () => {
            try {
                let url = selectedFlight ? `http://localhost:3001/airline/bookings/${selectedFlight}` : 'http://localhost:3001/airline/bookings/0';
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('No bookings found for the selected flight');
                }
                const data = await response.json();
                setBookings(data);
                setError(null); // Reset error state in case of successful fetch
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setError(error.message);
                setBookings([]); // Clear bookings as there's an error
            }
        };


        fetchBookings();
    }, [selectedFlight]);

    const handleFlightChange = (event) => {
        setSelectedFlight(event.target.value);
    };

    return (
        <div className="agent-dashboard-container">
            <h2>Passenger List</h2>

            <div>
                <label htmlFor="flightSelect">Select Flight by ID </label>
                <select
                    id="flightSelect"
                    onChange={handleFlightChange}
                    value={selectedFlight}
                >
                    <option value="">All Flights</option>
                    {flights.map((flight) => (
                        <option key={flight.flight_id} value={flight.flight_id}>
                            {flight.flight_id}
                        </option>
                    ))}
                </select>
            </div>

            {error ? ( <> The flight selected does not have bookings yet. </>) : (
            <table className="booking-table">
                <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Passenger Name</th>
                    <th>Flight ID</th>
                    <th>Seat Type</th>
                    <th>Seat Number</th>
                    <th>Cancellation Insurance</th>
                    <th>Payment Amount</th>
                    <th>Payment Date</th>
                </tr>
                </thead>
                <tbody>
                {bookings.map((booking) => (
                    <tr key={booking.booking_id}>
                        <td>{booking.booking_id}</td>
                        <td>{booking.user.name}</td>
                        <td>{booking.flight.flight_id}</td>
                        <td>{booking.seat.seat_type}</td>
                        <td>{booking.seat.seat_number}</td>
                        <td>{booking.cancellation_insurance ? 'Yes' : 'No'}</td>
                        <td>${booking.payment_amount}</td>
                        <td>{booking.payment_datetime}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </div>
    );
}

export default AgentDashboard;
