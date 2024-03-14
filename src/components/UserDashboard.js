import React, { useContext, useEffect, useState } from 'react';
import './UserDashboard.css';
import { UserContext } from '../UserContext';
import DynamicList from './DynamicList';
import { useHistory } from 'react-router-dom';

function UserDashboard() {
    const history = useHistory();
    const {user, setUser} = useContext(UserContext);
    const [entities, setEntities] = useState([]);
    const [notification, setNotification] = useState(null);
    const [cancel, setCancel] = useState(0);
    const [selectedTab, setSelectedTab] = useState('info');
    const [ssn, setSsn] = useState('');

    const fetchEntities = async () => {
        try {
            const response = await fetch(`http://localhost:3001/bookings/user/${user.user_id}`);
            const data = await response.json();
            setEntities(data);
        } catch (error) {
            console.error(`Error fetching:`, error);
        }
    };

    const cancelBooking = async (item) => {
        setNotification(null);
        if (item.cancellation_insurance === 0) {
            setCancel(1);
            return;

        }
        setCancel(0);
        const bookingId = item.booking_id; // Extract booking_id from the item

        try {
            const response = await fetch(`http://localhost:3001/bookings/remove/${bookingId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedEntities = entities.filter((entity) => entity.booking_id !== bookingId);
                setEntities(updatedEntities);
                setNotification('Booking has been cancelled successfully.');
				
				let responseEmail = await fetch(`http://localhost:3001/email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_email: user.email,
                    email_subject: "Moussavi Air - Booking Cancellation",
                    email_body: "Dear " + user.name + "\n\nYour booking has been successfully cancelled: \n BookingId: " + bookingId + "\n\n Hope to see you again!\n\n Moussavi Air"
                }),
            });
				
            } else {
                console.error(`Error canceling booking`);
                setNotification('Error cancelling booking.');
            }
        } catch (error) {
            console.error(`Error canceling booking: ${error.message}`);
            setNotification('Error cancelling booking.');
        }
    };

    useEffect(() => {
        fetchEntities();
    }, []);

    useEffect(() => {
        // Clear the notification after a certain time (e.g., 3000 milliseconds)
        const timeout = setTimeout(() => {
            setNotification(null);
        }, 30000);

        // Cleanup the timeout to avoid memory leaks
        return () => clearTimeout(timeout);
    }, [notification]);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const handleBenefitToggle = (benefit, value) => {
        // Create a copy of the user object and update the selected benefit value
        const updatedUser = {...user, [benefit]: value};
        // Update the user state with the new values
        setUser(updatedUser);
    };

    const saveChanges = async () => {
        try {
            const response = await fetch(`http://localhost:3001/users/up/${user.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lounge: user.lounge,
                    news: user.news,
                    ticket: user.ticket,
                }),
            });

            if (response.ok) {
                setNotification('Changes saved successfully.');
            } else {
                throw new Error('Failed to save changes.');
            }
        } catch (error) {
            console.error(`Error saving changes: ${error.message}`);
            setNotification('Error saving changes.');
        }
    };

    const handleSsnChange = (e) => {
        setSsn(e.target.value);
    };


    const handleApply = async () => {
        // Check if the SSN input is empty before taking any action
        if (ssn.trim() === '') {
            return;
        }

        // For simulation purpose we generate a random 8-digit number
        const randomCreditCardNumber = Math.floor(10000000 + Math.random() * 90000000);

        try {
            const response = await fetch(`http://localhost:3001/users/up/${user.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lounge: true,
                    news: true,
                    ticket: true,
                    credit_card_number: randomCreditCardNumber
                }),
            });

            if (response.ok) {
                setNotification('Changes saved successfully.');
                setUser(null); // Set user to null on logout
                history.push("/"); // Redirect to "/user" route
            } else {
                throw new Error('Failed to save changes.');
            }
        } catch (error) {
            console.error(`Error saving changes: ${error.message}`);
            setNotification('Error saving changes.');
        }
    };

    return (
        <div className="user-login">
            <div className="tab-buttons">
                <button
                    className={selectedTab === 'info' ? 'active' : ''}
                    onClick={() => handleTabClick('info')}
                >
                    Info and Bookings
                </button>
                <button
                    className={selectedTab === 'cardAndBenefits' ? 'active' : ''}
                    onClick={() => handleTabClick('cardAndBenefits')}
                >
                    Company Card and Benefits
                </button>
            </div>

            {selectedTab === 'info' ? (
                <>
                    {user ? (
                        <>
                            <p>Hello, {user.name}</p>
                            <p>Member ID: {user.user_id}</p>
                            <p>Address: {user.address}</p>
                            <p>Email: {user.email}</p>
                            <p>Companion Ticket Benefit:: {user.ticket === 0 ? 'NO' : 'YES'}</p>
                            <p>Discounted Lounge Access Benefit:: {user.lounge === 0 ? 'NO' : 'YES'}</p>
                            <p>Subscribed to Promotional News:: {user.news === 0 ? 'NO' : 'YES'}</p>
                        </>
                    ) : (
                        <p>Hello, Guest</p>
                    )}

                    {entities.length > 0 ? (
                        <>
                            <h2>Bookings:</h2>
                            <DynamicList
                                data={entities}
                                columns={['booking_id', 'flight_id', 'seat_id', 'cancellation_insurance', 'payment_amount']}
                                onCancel={cancelBooking}
                            />
                        </>
                    ) : (
                        <h2>You have no bookings yet.</h2>
                    )}
                    {notification && <div className="notification">{notification}</div>}
                    {cancel === 1 && (
                        <p>You cannot cancel this booking. Only bookings with cancel insurance can be canceled.</p>
                    )}
                </>
            ) : (
                user && user.credit_card_number ? (
                    <>
                        <p>You can turn on and off your benefits!</p>
                        <p>Credit card: {user.credit_card_number}</p>
                        <div>
                            <p>Companion Ticket Benefit:</p>
                            <label>
                                <input
                                    type="radio"
                                    name="ticketBenefit"
                                    value="Yes"
                                    checked={user.ticket === 1}
                                    onChange={() => handleBenefitToggle('ticket', 1)}
                                />
                                Yes
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="ticketBenefit"
                                    value="No"
                                    checked={user.ticket === 0}
                                    onChange={() => handleBenefitToggle('ticket', 0)}
                                />
                                No
                            </label>
                        </div>

                        <div>
                            <p>Discounted Lounge Access Benefit:</p>
                            <label>
                                <input
                                    type="radio"
                                    name="loungeBenefit"
                                    value="Yes"
                                    checked={user.lounge === 1}
                                    onChange={() => handleBenefitToggle('lounge', 1)}
                                />
                                Yes
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="loungeBenefit"
                                    value="No"
                                    checked={user.lounge === 0}
                                    onChange={() => handleBenefitToggle('lounge', 0)}
                                />
                                No
                            </label>
                        </div>

                        <div>
                            <p>Subscribed to Promotional News:</p>
                            <label>
                                <input
                                    type="radio"
                                    name="newsBenefit"
                                    value="Yes"
                                    checked={user.news === 1}
                                    onChange={() => handleBenefitToggle('news', 1)}
                                />
                                Yes
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="newsBenefit"
                                    value="No"
                                    checked={user.news === 0}
                                    onChange={() => handleBenefitToggle('news', 0)}
                                />
                                No
                            </label>
                            <button onClick={saveChanges}>Save Changes</button>
                        </div>
                    </>
                ) : (
                    // Content to show when user.credit_card_number is not available
                    <>
                        <p>Apply for the credit card and obtain benefits!</p>
                        <label htmlFor="ssn">Social Security Number (SSN):</label>
                        <input
                            type="text"
                            id="ssn"
                            name="ssn"
                            pattern="\d{3}-\d{2}-\d{4}"
                            placeholder="XXX-XX-XXXX"
                            required
                            value={ssn}
                            onChange={handleSsnChange}
                        />
                        <p>Once you submit your application you will be redirected to the Home Page, Log In again to see your benefits.</p>
                        <button onClick={handleApply} disabled={!ssn.trim()}>Apply Now</button>
                    </>

                )
                )}
        </div>
    );

}

export default UserDashboard;
