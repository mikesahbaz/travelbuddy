import React, { useEffect, useState } from 'react';
import './tripDashboard.css';
import NavBar from '../NavBar/NavBar';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const TripDashboard: React.FC = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  const fetchTrip = async () => {
    try {
      const res = await fetch(`http://localhost:3001/trips/trip/${tripId}`);
      const data = await res.json();
      if (res.ok) {
        setTrip(data.trip);
      } else {
        console.error('Res was not okay, error fetch trips');
      }
    } catch (error) {
      console.error('Error in fetching trips', error);
    }
  }

  return (
    <div className='trip-dashboard-container'>

    </div>
  )
}