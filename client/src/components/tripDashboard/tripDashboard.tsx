import React, { useEffect, useState } from 'react';
import './tripDashboard.css';
import NavBar from '../navBar/navBar';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { IFlight } from '../../interfaces/flightInterface';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import usePlacesPhoto from '../../hooks/usePlacesPhoto';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { formatDuration } from '../../utils/helperFunctions';


const TripDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { fetchPhoto, isServiceReady } = usePlacesPhoto(process.env.REACT_APP_PLACES_KEY);
  const { tripId } = useParams();
  const location = useLocation();
  const photoUrl = location.state.photoUrl;


  const fetchTrip = async () => {
    try {
      const res = await fetch(`http://localhost:3001/trips/trip/${tripId}`);
      const data = await res.json();
      if (res.ok) {
        const tripWithPhoto = {...data.trip, photoUrl};
        console.log(tripWithPhoto.startDate);
        const activitiesWithPhotos = await Promise.all(data.trip.activities.map(async (activity: any) => {
          const photoUrl = await fetchPhoto(activity.poiName);
          return { ...activity, photoUrl };
        }));
        return {trip: tripWithPhoto, flights: data.trip.flights, stays: data.trip.stays, activities: activitiesWithPhotos};
      } else {
        console.error('Res was not okay, error fetch trips');
      }
    } catch (error) {
      console.error('Error in fetching trips', error);
    }
  }

  useEffect(() => {
    const socket = io('http://localhost:3001');
    socket.on('trip_update', () => {
      queryClient.invalidateQueries();
    });
    fetchTrip();

    return () => {socket.disconnect();};
  }, [])

  const tripQuery = useQuery({
    queryKey: ["trips"],
    queryFn: () => fetchTrip(),
    enabled: isServiceReady,
  })

  if (tripQuery.isLoading) return <h1>Loading...</h1>
  const { trip, flights, stays, activities } = tripQuery.data || {};

  return (
    <div>
      <NavBar />
      <div className='trip-dashboard-container'>
        <div className='trip-details'>
          <div className='trip-name'>
            <img src={trip.photoUrl} alt={trip.name} className='trip-dash-photo'/>
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
          {flights && flights.map( (flight: any) => (
              <div className='flight-item-dash' key={flight.id}>
                <div className='flight-legs'>
                  {flight.legs.map((leg: any, index: any) => (
                    <div className='flight-leg' key={index}>
                      <div className='departing-flight-leg'>
                        <h3>{new Date(leg.departure).toLocaleTimeString()}</h3>
                        <h4>{leg.origin.display_code}</h4>
                      </div>
                      <div className='duration-container'>
                        <p className='duration-and-arrow'>{formatDuration(leg.duration)}</p>
                        {index === 0 ? <FaArrowRight/> : <FaArrowLeft/>}
                      </div>
                      <div className='arriving-flight-leg'>
                        <h3>{new Date(leg.arrival).toLocaleTimeString()}</h3>
                        <h4>{leg.destination.display_code}</h4>
                      </div>
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
              {stays && stays.map( (stay: any) => (
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
                {activities && activities.map( (activity) => (
                  <div className='activity-item-dash' key={activity._id}>
                    <div className='activity-details-dash'>
                      <img src={activity.photoUrl} alt={activity.poiName} className='activity-photo' />
                      <h3>{activity.poiName}</h3>
                      <p>{activity.poiType}</p>
                    </div>
                  </div>
                ))}
        </div>
      </div>
    </div>
  )
}

export default TripDashboard;
