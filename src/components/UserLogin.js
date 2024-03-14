import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Link, useHistory } from 'react-router-dom';
import './UserDashboard.css';


function UserLogin() {
    const history = useHistory();
    const { setUser } = useContext(UserContext);
    const [selectedTab, setSelectedTab] = useState('login'); // Default to 'login' tab
    const [errorFlag, setErrorFlag] = useState(false);
    const [verifiedFlag, setVerifiedFlag] = useState(false);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [address, setUserAddress] = useState('');
    const [creditCard, setCreditCard] = useState('');
    const [password, setPassword] = useState('');

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        setErrorFlag(false); // Reset error flag when switching tabs
        setVerifiedFlag(false); // Reset error flag when switching tabs
    };

    const handleLogIn = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            } else {
                const userData = await response.json();
                setUser(userData);
                console.log(userData);
                history.push('/user'); // Redirect to the user dashboard
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorFlag(true); // Set error flag on login failure
        }
    };

    const handleVerifyEmail = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/users/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Verification failed');
            }

            const { exists } = await response.json();
            if (exists) {
                setErrorFlag(true);
                setVerifiedFlag(false);
            } else {
                setErrorFlag(false);
                setVerifiedFlag(true);
            }
        } catch (error) {
            console.error('Verification error:', error);
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        await handleVerifyEmail(event);

        try {
            const response = await fetch('http://localhost:3001/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    address: address,
                    email: email,
                    credit_card_number: creditCard,
                    password: password // Sending the password for additional processing
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            } else {
                const userData = await response.json();
                setUser(userData);
                history.push('/user'); // Redirect to the user dashboard
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorFlag(true); // Set error flag on login failure
        }
    };

    return (
        <div className="user-login">
            <div>
                <h2>Log in or Register</h2>
                <div className="tab-buttons">
                    <button
                        className={selectedTab === 'login' ? 'active' : ''}
                        onClick={() => handleTabClick('login')}
                    >
                        Log In
                    </button>
                    <button
                        className={selectedTab === 'register' ? 'active' : ''}
                        onClick={() => handleTabClick('register')}
                    >
                        Register
                    </button>
                </div>

                <div className="dashboard-container">
                    {selectedTab === 'login' && (
                        <div>
                            <h3>Login</h3>
                            <form onSubmit={handleLogIn}>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Password:
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </label>
                                {errorFlag && (
                                    <div style={{ color: 'red' }}>
                                        Log in Failed. Verify your email and password
                                    </div>
                                )}
                                <button type="submit">Log In</button>
                            </form>
                        </div>
                    )}
                    {selectedTab === 'register' && (
                        <div>
                            <h3>Register</h3>
                            <p>Register now and become a member of the airline!</p>
                            {!verifiedFlag && (
                                <form onSubmit={handleVerifyEmail}>
                                    <label>
                                        Email:
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </label>
                                    {errorFlag && (
                                        <div style={{ color: 'red' }}>
                                            Email has been registered already.
                                        </div>
                                    )}
                                    <button type="submit"> Continue </button>
                                </form>
                            )}
                            {verifiedFlag && (
                                <form onSubmit={handleRegister}>
                                    <label>
                                        Email:
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        Name:
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        Address:
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setUserAddress(e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        New Password:
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </label>
                                    <button type="submit">Register</button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserLogin;
