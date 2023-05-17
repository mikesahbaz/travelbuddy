import React from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import { auth, signOut } from '../../firebase';

const NavBar: React.FC = () => {
  const navigate = useNavigate();




  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }

  const handleDashboardClick = async () => {
    try {
      navigate('/dashboard');
    } catch (error) {
      console.error('Error navigating to Dashboard', error);
    }
  }

  return (
    <div className='nav-container'>
      <div className='main-container'>
        <button className='dashboard-btn' onClick={handleDashboardClick}>Dashboard</button>
      </div>
      <div className='right-nav-container'>
        <button className='logout-btn' onClick={handleLogout} >Log Out</button>
      </div>
    </div>
  )
}


export default NavBar;