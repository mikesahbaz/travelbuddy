import React, { useEffect, useState } from 'react';
import './tripDashboard.css';
import NavBar from '../NavBar/NavBar';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { IFlight } from '../../interfaces/flightInterface';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const TripDashboard: React.FC = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<any>([]);
  const [flights, setFlights] = useState<any[]>([]);

  function formatDuration(durationInMinutes: number) {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  const fetchTrip = async () => {
    try {
      const res = await fetch(`http://localhost:3001/trips/trip/${tripId}`);
      const data = await res.json();
      if (res.ok) {
        setTrip(data.trip);
        setFlights(data.trip.flights);
        console.log(data.trip.flights);
        console.log(data.trip);
      } else {
        console.error('Res was not okay, error fetch trips');
      }
    } catch (error) {
      console.error('Error in fetching trips', error);
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
            {flights && flights.map( (flight) => (
              <div className='flight-item' key={flight.id}>
                <div className='departing-flight'>
                  {/* <h2>{flight.legs[0].carriers[0].name}</h2> */}
                  <h2>{new Date(flight.legs[0].departure).toLocaleTimeString()}</h2>
                  <h2>{flight.legs[0].origin.display_code}</h2>
                  <h2>{new Date(flight.legs[0].arrival).toLocaleTimeString()}</h2>
                  <h2>{flight.legs[0].destination.display_code}</h2>
                </div>
                  <div className='flight-time'>
                  <h2>{formatDuration(flight.legs[0].duration)}</h2>
                  <FaArrowRight />
                  </div>
                <div className='returning-flight'>
                  {/* <h2>{flight.legs[1].carriers[0].name}</h2> */}
                  <h2>{new Date(flight.legs[1].departure).toLocaleTimeString()}</h2>
                  <h2>{flight.legs[1].origin.display_code}</h2>
                  <h2>{new Date(flight.legs[1].arrival).toLocaleTimeString()}</h2>
                  <h2>{flight.legs[1].destination.display_code}</h2>
                </div>
                <div className='flight-price'>${flight.price.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripDashboard;