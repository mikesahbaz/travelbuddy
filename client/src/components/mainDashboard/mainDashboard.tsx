import React, { useEffect, useState } from 'react';
import './mainDashboard.css';
import NavBar from '../NavBar/NavBar';
import { auth } from '../../firebase';
import { User } from 'firebase/auth';
import { isTrip } from '../../interfaces/tripInterface';
import { useNavigate } from 'react-router-dom';
import { get } from 'http';
import { getAllTripsByUserEmail } from '../../services/tripService';

const MainDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>('');
  const [trips, setTrips] = useState<isTrip[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged( (user) => {
        setUser(user);
        setUserLoaded(true);
        if (user && user.email) {
          setUserEmail(user.email);
          fetchAllTrips(user.email);
        }
        console.log(userEmail);
    });
    return unsubscribe;
  }, [])

  const fetchAllTrips = async function (userEmail: string) {
    try {
      const data = await getAllTripsByUserEmail(userEmail);
      console.log(data.trips);
      setTrips(data.trips);
    } catch (error) {
      console.error(error);
    }
  }

  const handleCreateTripClick = () => {
    navigate('/createTrip');
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`
  }

  const handleTripClick = (tripId: string) => {
    navigate(`/trips/${tripId}`);
  }

  const handleFlightsClick = (tripId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/flights/${tripId}`);
  }

  const handleStaysClick = (tripId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/stays/${tripId}`);
  }

  if (!userLoaded) {
    return <p>Loading....</p>
  }

  return (
    <div>
      <NavBar/>
      <div className='main-dashboard-container'>
      {user && user.email ? <h1 className='welcome-message'>Welcome back, {user.email}</h1> : <p className='no-user-message'>Please Sign In</p>}
        <div className='info-container'>
          <div className='my-trips'>
            My Trips
          </div>
          <button className='create-trip-btn' onClick={handleCreateTripClick}>Plan a trip</button>
        </div>
        {trips && trips.map( (trip) => (
          <div key={trip._id} className='trip-item' onClick={ () => handleTripClick(trip._id)}>
            <div className='trip-item-details'>
              <div className='trip-name-container'>{trip.name}</div>
              <div className='trip-date-container'>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</div>
              <button data-trip-id={trip._id}  onClick={(e) => handleFlightsClick(trip._id, e)}>Flights Page</button>
              <button data-trip-id={trip._id}  onClick={(e) => handleStaysClick(trip._id, e)}>Stays</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


export default MainDashboard;