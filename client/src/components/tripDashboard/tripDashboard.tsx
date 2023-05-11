import React, { useEffect, useState } from 'react';
import './tripDashboard.css';
import NavBar from '../NavBar/NavBar';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const TripDashboard: React.FC = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<any>([]);

  const fetchTrip = async () => {
    try {
      const res = await fetch(`http://localhost:3001/trips/trip/${tripId}`);
      const data = await res.json();
      if (res.ok) {
        console.log(data.trip);
        setTrip(data.trip);
      } else {
        console.error('Res was not okay, error fetch trips');
      }
    } catch (error) {
      console.error('Error in fetching trips', error);
    }
  }

  const fetchFlights = async () => {
    try {
      
    } catch (error) {
      console.error('Error in fetching flights', error);
    }
  }

  useEffect(() => {
    fetchTrip();
  }, [])

  return (
    <div>
      <NavBar />
      <div className='trip-dashboard-container'>
        <div className='trip-details'>
          <div className='trip-name'>
            <h2>{trip.name}</h2>
          </div>
          <div className='trip-dates'>
            <h2>{new Date(new Date(trip.startDate).getTime() + new Date().getTimezoneOffset() * 60 * 1000).toDateString() + ' '}
              -
             {' ' + new Date(new Date(trip.endDate).getTime() + new Date().getTimezoneOffset() * 60 * 1000).toDateString()}
             </h2>
          </div>
        </div>
        <div className='flights-container'>
          <div className='flight-box'>
            <h2>Favorite Flights</h2>
          </div>
          <div className='flights'>

          </div>
        </div>
      </div>
    </div>
  )
}

export default TripDashboard;