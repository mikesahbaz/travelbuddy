import React, { useEffect, useState } from 'react';
import './mainDashboard.css';
import NavBar from '../NavBar/NavBar';
import { auth } from '../../firebase';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const MainDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>('');
  const [trips, setTrips] = useState([]);

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
      const res = await fetch(`http://localhost:3001/trips/mytrips/${userEmail}`);
      const data = await res.json();
      console.log(data.trips);
      if (res.ok) {
        setTrips(data.trips);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching trips: ', error);
    }
  }

  if (!userLoaded) {
    return <p>Loading....</p>
  }

  return (
    <div>
      <NavBar/>
      <div className='main-dashboard-container'>
      {user && user.email ? <h1>Welcome back, {user.email}</h1> : <p>Please Sign In</p>}
      </div>
    </div>
  )
}


export default MainDashboard;