import React, { useEffect, useState, useContext } from 'react';
import './mainDashboard.css';
import NavBar from '../NavBar/NavBar';
import { auth } from '../../firebase';
import { User } from 'firebase/auth';
import { isTrip } from '../../interfaces/tripInterface';
import { useNavigate } from 'react-router-dom';
import { GoogleMapsApiContext } from '../../contexts/GoogleMapsApiContext';
import { getAllTripsByUserEmail } from '../../services/tripService';
import { useQuery } from '@tanstack/react-query';
import { all } from 'axios';

const placesApiKey = process.env.REACT_APP_PLACES_KEY;
let service: any;

const MainDashboard: React.FC = () => {
  const { isLoaded } = useContext(GoogleMapsApiContext);

  useEffect(() => {
    if (isLoaded) {
      service = new window.google.maps.places.PlacesService(document.createElement('div'));
    }
  }, [isLoaded]);


  const [user, setUser] = useState<User | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>('');
  // const [trips, setTrips] = useState<isTrip[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged( (user) => {
        setUser(user);
        setUserLoaded(true);
        if (user && user.email) {
          setUserEmail(user.email);
          fetchAllTrips(user.email);
        }
    });
    return unsubscribe;
  }, [])

  const getPlacesData = (place: string) => {
    return new Promise((resolve, reject) => {
      if (!service) {
        reject('Service not available');
        return;
      }
  
      const request = {
        query: place,
        fields: ["name", "photos"],
      };
  
      service.textSearch(request, (results: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject('Places search failed');
        }
      });
    });
  };
  
  const fetchAllTrips = async function (userEmail: string) {
    try {
      const data = await getAllTripsByUserEmail(userEmail);
      const updatedTrips = [];

      for (let trip of data.trips) {
        const placesData: any = await getPlacesData(trip.name);
        console.log(placesData[0].photos);
        const photoUrl = placesData[0].photos[0].getUrl({maxWidth: 500, maxHeight: 500});
        console.log(photoUrl);
        trip.photoUrl = photoUrl;
        updatedTrips.push(trip);
        console.log(trip);
      }
      
      return data.trips;
  
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const allTripsQuery = useQuery(
    ['allTrips', userEmail],
    async () => {
      if (userEmail) {
        return await fetchAllTrips(userEmail);
      } else {
        return Promise.resolve([]);
      }
    },
    {enabled: isLoaded }
  )

  const trips = allTripsQuery.data || [];

  

  const handleCreateTripClick = () => {
    navigate('/createTrip');
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`
  }

  const handleTripClick = (tripId: string, tripPhotoUrl: string) => {
    navigate(`/trips/${tripId}`, { state: { photoUrl: tripPhotoUrl }});
  }

  const handleFlightsClick = (tripId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/flights/${tripId}`);
  }

  const handleStaysClick = (tripId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/stays/${tripId}`);
  }

  
  const handleActivitiesClick = (tripId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/activities/${tripId}`);
  }

  if (!userLoaded) {
    return <p>Loading....</p>
  }

  return (
    <div>
      <NavBar/>
      <div className='main-dashboard-container'>
      {user && user.email ? <h1 className='welcome-message slide-right'>Welcome Back</h1> : <p className='no-user-message'>Please Sign In</p>}
        <div className='info-container'>
          <div className='my-trips'>
            My Trips
          </div>
          <button className='create-trip-btn' onClick={handleCreateTripClick}>Plan a trip</button>
        </div>
        {allTripsQuery.isLoading && <h1>Your trips are loading...</h1>}
        {trips && trips.map( (trip: any) => (
          <div key={trip._id} className='trip-item' onClick={ () => handleTripClick(trip._id, trip.photoUrl)}>
            <div className='trip-item-details'>
              <div className='trip-info-container'>
                {trip.photoUrl && <img src={trip.photoUrl} alt={trip.name} className='trip-photo' />}
                <div className='trip-name-container'>Trip to {trip.name}</div>
              </div>
              <div className='trip-date-container'>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</div>
              <div className='buttons-dash-container'>
                <button data-trip-id={trip._id}  onClick={(e) => handleFlightsClick(trip._id, e)} className='main-dash-btn'>Flights</button>
                <button data-trip-id={trip._id}  onClick={(e) => handleStaysClick(trip._id, e)} className='main-dash-btn'>Stays</button>
                <button data-trip-id={trip._id}  onClick={(e) => handleActivitiesClick(trip._id, e)} className='main-dash-btn'>Things To Do</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


export default MainDashboard;