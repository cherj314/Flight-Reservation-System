import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserProvider } from './UserContext';
import LoginBar from './components/LoginBar';
import Home from './components/Home';
import FlightList from './components/FlightList';
import SeatMap from './components/SeatMap';
import Payment from './components/Payment';
import TicketConfirmation from './components/TicketConfirmation';
import AdminDashboard from './components/AdminDashboard';
import UserLogin from './components/UserLogin';
import User from './components/UserDashboard';
import AgentDashboard from './components/AgentDashboard';

function App() {
  return (
      <UserProvider>
        <Router>
          <LoginBar />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/flights" component={FlightList} />
            <Route path="/seat-map/:flightId" component={SeatMap} />
            <Route path="/payment/:flightId/:seatId/:seatPrice" component={Payment} />
            <Route path="/confirmation/:bookingId" component={TicketConfirmation} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/login" component={UserLogin} />
            <Route path="/user" component={User} />
            <Route path="/agent" component={AgentDashboard} />
          </Switch>
        </Router>
      </UserProvider>
  );
}

export default App;
