import React from 'react';
import RegisterPage from './components/registerPage/registerPage';
import LoginPage from './components/loginPage/loginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
