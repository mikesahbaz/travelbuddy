import React from 'react';
import RegisterPage from './components/registerPage/registerPage';
import LoginPage from './components/loginPage/loginPage';
import MainDashboard from './components/mainDashboard/mainDashboard';
import CreateTrip from './components/createTrip/createTrip';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' element={<MainDashboard />} />
        <Route path='/createTrip' element={<CreateTrip />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
