import React from 'react';
import RegisterPage from './components/registerPage/registerPage';
import LoginPage from './components/loginPage/loginPage';
import MainDashboard from './components/mainDashboard/mainDashboard';
import CreateTrip from './components/createTrip/createTrip';
import TripDashboard from './components/tripDashboard/tripDashboard';
import FlightsPage from './components/flightsPage/flightsPage';
import AirbnbsPage from './components/airbnbsPage/airbnbsPage';
import ActivitiesPage from './components/activitiesPage/activitiesPage';
import { useJsApiLoader } from '@react-google-maps/api';
import { GoogleMapsApiContext } from './contexts/GoogleMapsApiContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

function App() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_PLACES_KEY as string,
    libraries,
  });

  if (!isLoaded) {
    return <p>Loading....</p>
  }

  if (loadError) {
    return <p>Error loading Google Maps API: {loadError.message}</p>
  }
  return (
    <GoogleMapsApiContext.Provider value={{ isLoaded }}>
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
        <Route path='/activities/:tripId' element={<ActivitiesPage />} />
      </Routes>
    </div>
    </Router>
    </GoogleMapsApiContext.Provider>
  );
}

export default App;
