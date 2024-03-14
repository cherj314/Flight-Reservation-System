import React, {useState} from 'react';
import AdminAircraft from './AdminAircraft';
import AdminCrew from './AdminCrew';
import AdminUser from './AdminUser'; // Import AdminUser
import AdminFlights from './AdminFlights';
import AdminDestinations from "./AdminDestinations"; // Import AdminFlights

function AdminDashboard() {
    const [selectedTab, setSelectedTab] = useState('aircraft');

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <div className="tab-buttons">
                <button
                    className={selectedTab === 'flights' ? 'active' : ''}
                    onClick={() => handleTabClick('flights')}
                >
                    Flights
                </button>
                <button
                    className={selectedTab === 'aircraft' ? 'active' : ''}
                    onClick={() => handleTabClick('aircraft')}
                >
                    Aircraft
                </button>
                <button
                    className={selectedTab === 'destinations' ? 'active' : ''}
                    onClick={() => handleTabClick('destinations')}
                >
                    Destinations
                </button>
                <button
                    className={selectedTab === 'crews' ? 'active' : ''}
                    onClick={() => handleTabClick('crews')}
                >
                    Crew
                </button>
                <button
                    className={selectedTab === 'users' ? 'active' : ''}
                    onClick={() => handleTabClick('users')}
                >
                    Registered Users
                </button>
            </div>

            <div className="dashboard-container">
                {selectedTab === 'aircraft' && <AdminAircraft/>} {/* Render AdminAircraft */}
                {selectedTab === 'crews' && <AdminCrew/>} {/* Render AdminCrew */}
                {selectedTab === 'users' && <AdminUser/>} {/* Render AdminUser */}
                {selectedTab === 'flights' && <AdminFlights/>} {/* Render AdminFlights */}
                {selectedTab === 'destinations' && <AdminDestinations/>} {/* Render AdminFlights */}
            </div>
        </div>
    );
}

export default AdminDashboard;
