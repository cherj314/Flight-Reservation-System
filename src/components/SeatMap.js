import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SeatMap.css';

const SeatMap = ({match}) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const flightId = match.params.flightId;

    useEffect(() => {
        fetchSeats();
    }, [flightId]);

    const fetchSeats = async () => {
        try {
            const response = await fetch(`http://localhost:3001/flights/info/${flightId}`);
            const data = await response.json();
            setSeats(data.aircraft.seats);
        } catch (error) {
            console.error('Error fetching seats:', error);
        }
    };

    const onSeatClick = (seat) => {
        setSelectedSeat(seat);
    };

    const getSeatStyle = (seat) => {
        let style = {backgroundColor: seat.availability ? 'green' : 'red'};
        return style;
    };

    const getAvailabilityColor = (availability) => {
        return availability ? 'green' : 'red';
    };

    return (
        <div>
            <header>
                <h1>{`Seat Map for Flight ${flightId}`}</h1>
            </header>
            <nav>
                <Link to={`/flights`}>Back to Flights</Link>
            </nav>
            <div className="plane">
                <div className="airplane">
                    <div className="seat-map">
                        {seats.map((seat) => (
                            <div
                                key={seat.seat_id}
                                className="seat"
                                style={getSeatStyle(seat)}
                                onClick={() => onSeatClick(seat)}
                            >
                                {seat.seat_number}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedSeat && (
                <div className="seat-details">
                    <p>Seat Number: {selectedSeat.seat_number}</p>
                    <p>Seat Type: {selectedSeat.seat_type}</p>
                    <p>Price: {selectedSeat.price}</p>
                    <p style={{color: getAvailabilityColor(selectedSeat.availability)}}>
                        {selectedSeat.availability ? 'Available' : 'Not Available'}
                    </p>
                    {selectedSeat.availability && (
                        <Link to={`/payment/${flightId}/${selectedSeat.seat_id}/${selectedSeat.price}`}>Go to
                            Payment</Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default SeatMap;