import React from 'react';
import RegisterPage from './components/registerPage/registerPage';
import LoginPage from './components/loginPage/loginPage';
import MainDashboard from './components/mainDashboard/mainDashboard';
import CreateTrip from './components/createTrip/createTrip';
import TripDashboard from './components/tripDashboard/tripDashboard';
import FlightsPage from './components/flightsPage/flightsPage';
import AirbnbsPage from './components/airbnbsPage/airbnbsPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' element={<MainDashboard />} />
        <Route path='/createTrip' element={<CreateTrip />} />
        <Route path='/trips/:tripId' element={<TripDashboard />} />
        <Route path='/flights/:tripId' element={<FlightsPage />} />
        <Route path='/stays/:tripId' element={<AirbnbsPage />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
