import React, { useEffect, useState } from 'react';
import './tripDashboard.css';
import NavBar from '../NavBar/NavBar';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { IFlight } from '../../interfaces/flightInterface';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';

const TripDashboard: React.FC = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<any>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [stays, setStays] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

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
        setStays(data.trip.stays);
        setActivities(data.trip.activities);
        console.log(data.trip.activities);
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
              <div className='flight-item-dash' key={flight.id}>
                <div className='flight-legs'>
                  {flight.legs.map((leg: any, index: any) => (
                    <div className='flight-leg' key={index}>
                      <h3>{new Date(leg.departure).toLocaleTimeString()}</h3>
                      <h4>{leg.origin.display_code}</h4>
                      <h3>{new Date(leg.arrival).toLocaleTimeString()}</h3>
                      <h4>{leg.destination.display_code}</h4>
                      <h3 className='duration-and-arrow'>{formatDuration(leg.duration)}</h3>
                      {index === 0 ? <FaArrowRight/> : <FaArrowLeft/>}
                    </div>
                  ))}
                </div>
                <div className='flight-price'>${flight.price.amount}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className='stays-container'>
              <div className='stays-box'>
                <h2>Favorite Stays</h2>
              </div>
          </div>
          <div className='stays'>
              {stays && stays.map( (stay) => (
                <div className='stay-item' key={stay._id}>
                  <img src={stay.images[0]} alt='stay'/>
                  <div className='stay-details'>
                    <h3>{stay.listingName}</h3>
                    <p>{stay.publicAddress}</p>
                    <div className='stay-features'>
                      <p>{stay.listingGuestLabel}  {stay.listingBathroomLabel}  {stay.listingBedLabel}</p>
                    </div>
                      <p className='stay-detail'>{stay.price}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className='activities-container-dash'>
                <div className='activities-box'>
                  <h2>Favorite Activities</h2>
                </div>
        </div>
        <div className='activities'>
                {}
        </div>
      </div>
    </div>
  )
}

export default TripDashboard;