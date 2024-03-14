import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [aircrafts, setAircrafts] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchAircrafts();
    fetchBookings();
  }, []);

  const fetchAircrafts = async () => {
    try {
      const response = await fetch('http://localhost:3001/aircraft');
      const data = await response.json();
      setAircrafts(data);
    } catch (error) {
      console.error('Error fetching aircrafts:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:3001/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  return (
    <div className="home-container">
      <header>
        <h1>Welcome to the Flight Reservation Web Application</h1>
      </header>
      <nav>
        <Link to="/flights">Browse Flights</Link>
        <Link to="/agent">Agent Dashboard</Link>
      </nav>
      <section className="current-aircrafts">
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2 style={{ color: '#4A90E2' }}>ENSF 614 - Fall 2023</h2>
          <h2 style={{ color: '#4A90E2' }}>TERM PROJECT</h2>

          <table style={{ margin: 'auto', border: '2px solid #4A90E2', borderCollapse: 'collapse' }}>
            <thead>
            <tr>
              <th style={{ border: '1px solid #4A90E2', padding: '10px', backgroundColor: '#E7F1FF' }}>Group 3 Members:</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td style={{ border: '1px solid #4A90E2', padding: '10px' }}>John Chernoff (30121394)</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #4A90E2', padding: '10px' }}>Israel Suarez Robles (30200470)</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #4A90E2', padding: '10px' }}>Nicholas Langley (10158348)</td>
            </tr>
            </tbody>
          </table>
        </div>

      </section>
    </div>
  );
}

export default Home;
