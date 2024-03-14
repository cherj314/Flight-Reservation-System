import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext'; // Import UserContext
import './LoginBar.css';

function LoginBar() {
    const { user, setUser } = useContext(UserContext);

    const handleLogout = () => {
        setUser(null); // Set user to null on logout
    };

    return (
        <div className="login-bar">
            <Link to="/" className="home-button">
                GROUP 3 AIRLINES
            </Link>
            {user ? (
                <>
                    <Link to="/user" className="login-button">
                        Welcome {user.name}!
                    </Link>
                    <Link to="/" onClick={handleLogout} className="login-button">
                        Logout
                    </Link>
                </>
            ) : (
                <>
                    <Link to="/login" className="login-button">
                        Log In / Register
                    </Link>
                    <Link to="/admin" className="login-button">
                        Admin Dashboard
                    </Link>
                </>
            )}
        </div>
    );
}

export default LoginBar;
