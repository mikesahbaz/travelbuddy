import React, { useEffect, useState } from 'react';
import './tripDashboard.css';
import NavBar from '../NavBar/NavBar';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const TripDashboard: React.FC = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<any>([]);
  const [flights, setFlights] = useState([]);

  const fetchTrip = async () => {
    try {
      const res = await fetch(`http://localhost:3001/trips/trip/${tripId}`);
      const data = await res.json();
      if (res.ok) {
        console.log(data.trip);
        console.log(data.trip.flights[0].itineraryId);
        console.log(data.trip.flights[0].legs[0]);
        console.log(data.trip.flights[0].legs[1]);
        setTrip(data.trip);
      } else {
        console.error('Res was not okay, error fetch trips');
      }
    } catch (error) {
      console.error('Error in fetching trips', error);
    }
  }

//   const fetchFlights = async () => {
//     const url = `https://skyscanner50.p.rapidapi.com/api/v1/getFlightDetails?itineraryId=${flight.itineraryId}&legs=%5B%7B%22origin%22%3A%22${flight.legs[0].origin}%22%2C%22destination%22%3A%22${flight.legs[0].destination}%22%2C%22date%22%3A%22${flight.legs[0].departure}%22%7D%2C%7B%22date%22%3A%22${flight.legs[1].departure}%22%2C%22destination%22%3A%22${flight.legs[1].destination}%22%2C%22origin%22%3A%22${flight.legs[1].origin}%22%7D%5D&adults=1&currency=USD&countryCode=US&market=en-US`;
//     const options = {
//       method: 'GET',
//       headers: {
//         'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
//         'X-RapidAPI-Host': 'skyscanner50.p.rapidapi.com'
//       }
// };
//     try {

//     } catch (error) {
//       console.error('Error in fetching flights', error);
//     }
//   }

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