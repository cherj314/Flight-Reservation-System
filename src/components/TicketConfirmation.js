import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function TicketConfirmation() {
  const { bookingId } = useParams();
  const [confirmationDetails, setConfirmationDetails] = useState(null);

  useEffect(() => {
    fetchConfirmationDetails(bookingId);
  }, [bookingId]);

  const fetchConfirmationDetails = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:3001/bookings/confirmation/${bookingId}`);
      const data = await response.json();
      setConfirmationDetails(data);
    } catch (error) {
      console.error('Error fetching confirmation details:', error);
    }
  };

  return (
    <div>
      <h2>Ticket Confirmation</h2>
      {confirmationDetails ? (
        <div>
          <p>Your payment was successful. Your ticket has been confirmed.</p>
          <p>Confirmation Details:</p>
          <ul>
            <li>Booking ID: {confirmationDetails.booking_id}</li>
            <li>User ID: {confirmationDetails.user_id}</li>
            <li>Flight ID: {confirmationDetails.flight_id}</li>
            <li>Seat ID: {confirmationDetails.seat_id}</li>
            {/* Add more confirmation details as needed */}
          </ul>
        </div>
      ) : (
        <p>Loading confirmation details...</p>
      )}
    </div>
  );
}

export default TicketConfirmation;
