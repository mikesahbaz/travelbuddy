import React, { useEffect, useState, useContext, useRef } from 'react';
import './mainDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { auth } from '../../firebase';
import { User } from 'firebase/auth';
import { GoogleMapsApiContext } from '../../contexts/GoogleMapsApiContext';
import { getAllTripsByUserEmail } from '../../services/tripService';
import { ITrip } from '../../interfaces/tripInterface';
import NavBar from '../navBar/navBar';

const MainDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userLoaded, setUserLoaded] = useState(false);
  const navigate = useNavigate();
  const { isLoaded } = useContext(GoogleMapsApiContext);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  const getPlacesData = (place: string): Promise<google.maps.places.PlaceResult[] | null> => {
    return new Promise((resolve, reject) => {
      if (!placesServiceRef.current) {
        reject('Service not available');
        return;
      }

      const request = {
        query: place,
        fields: ["name", "photos"],
      };

      placesServiceRef.current.textSearch(request, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
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
      const trips: ITrip[] = data.trips;

      // This entire function should probably be moved to createTrip.tsx
      // That way, when a new trip is created, we don't need to fetch a photoURL here for the trip
      for (let trip of trips) {
        const placesData = await getPlacesData(trip.name);

        // Check if placesData and the necessary properties exist
        if (placesData && placesData[0] && placesData[0].photos && placesData[0].photos[0]) {
          const photoUrl = placesData[0].photos[0].getUrl({maxWidth: 500, maxHeight: 500});
          trip.photoUrl = photoUrl;
        } else {
          trip.photoUrl = '';
        }
      }

      return trips;

    } catch (error) {
      console.error(error);
      return [];
    }
  }

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

  useEffect(() => {
    if (isLoaded && !placesServiceRef.current) {
      placesServiceRef.current = new window.google.maps.places.PlacesService(document.createElement('div'));
    }
  }, [isLoaded]);

  const tripsQuery = useQuery(
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
        {tripsQuery.isLoading && <h1>Your trips are loading...</h1>}
        {tripsQuery.data && tripsQuery.data.map( (trip: ITrip) => (
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
