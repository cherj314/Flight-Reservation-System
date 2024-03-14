import React, { useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';

function Payment() {
    const { user } = useContext(UserContext);

    const { flightId, seatId, seatPrice } = useParams(); // Updated to get seatId from URL params
    const history = useHistory();
    const [invalid, setInvalid] = useState(0);

    const [name, setName] = useState(user ? user.name : '');
    const [address, setAddress] = useState(user ? user.address : '');
    const [email, setEmail] = useState(user ? user.email : '');
    const [cardNumber, setCardNumber] = useState(user ? user.credit_card_number : '');
    const [insurance, setInsurance] = useState(0);
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();

        // Calculate total payment amount including insurance if selected
        const totalPaymentAmount = insurance === 1 ? parseFloat(seatPrice) + 30 : parseFloat(seatPrice);

        // If all fields are not filled
        if (!name || !address || !email || !cardNumber || !expiryDate || !cvv) {
            console.error('Please fill in all required fields.');
            setInvalid(1);
            return; // Prevent the form submission
        }

        try {
            // Process payment
            const paymentResponse = await fetch(`http://localhost:3001/payment/${seatPrice}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardNumber, expiryDate, cvv }),
            });

            if (!paymentResponse.ok) {
                return;
            }

            // Step 2: Add user if not already existing
            let userId = user ? user.user_id : null;
            if (!userId) {
                const responseAdd = await fetch('http://localhost:3001/users/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name,
                        address: address,
                        email: email,
                        credit_card_number: null,
                        ticket: false,
                        lounge: false,
                        news: false,
                    }),
                });

                if (!responseAdd.ok) {
                    return;
                }

                const data = await responseAdd.json();
                console.log('Received data:', data);
                userId = data;
            }

            // Step 3: Create booking
            const bookingResponse = await fetch(`http://localhost:3001/bookings/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    flight_id: flightId,
                    seat_id: seatId,
                    cancellation_insurance: insurance,
                    payment_amount: totalPaymentAmount,
                    payment_datetime: new Date().toISOString().slice(0, 19).replace('T', ' ')
                }),
            });

            if (!bookingResponse.ok) {
                return;
            }

            const bookingData = await bookingResponse.json();
            console.log('Booking ID:', bookingData);

            let responseEmail = await fetch(`http://localhost:3001/email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cancellation_insurance: insurance,
                    user_email: email,
                    email_subject: "Moussavi Air - Ticket Confirmation",
                    email_body: "Dear " + name + "\n\nYour booking confirmation and ticket: \n flightId: " + flightId + "\n seatId: " + seatId + "\n bookingId: " + bookingData + "\n Payment Amount: $" + totalPaymentAmount + "\n\n Have a good Flight!\n\n Moussavi Air"
                }),
            });

            // Redirect to the confirmation page after successful payment
            history.push(`/confirmation/${bookingData}`);
        } catch (error) {
            console.error('Error Occurred:', error);
        }
    };

    return (
        <div>
            <h2>Payment</h2>
            <form onSubmit={handlePayment}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
                </label>
                <label>
                    Address:
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required/>
                </label>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </label>
                <label>
                    Card Number:
                    <input type="number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required/>
                </label>
                <label>
                    Expiry Date:
                    <input type="number" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required/>
                </label>
                <label>
                    CVV:
                    <input type="number" value={cvv} onChange={(e) => setCvv(e.target.value)} required/>
                </label>
                <label>
                    <p>Cancellation insurance:</p>
                    <input
                        type="checkbox"
                        checked={insurance === 1}
                        onChange={(e) => setInsurance(e.target.checked ? 1 : 0)}
                    />
                    (There is an extra charge of $30 dollars for the insurance)
                </label>
                <button type="submit">Submit Payment</button>
                {invalid === 1 && <p> You must fill all fields. </p>}
            </form>
        </div>
    );
}

export default Payment;
