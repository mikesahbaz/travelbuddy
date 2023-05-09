import React, { useEffect, useState } from 'react';
import './flightsPage.css';
import NavBar from '../NavBar/NavBar';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../../firebase';

const FlightsPage: React.FC = () => {
  const [startDest, setStartDest] = useState('');
  const [endDest, setEndDest] = useState('');
  const [startDate, setStartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [startDestCode, setStartDestCode] = useState('');
  const [endDestCode, setEndDestCode] = useState('');
  const [flightData, setFlightData] = useState(null);

  const handleSubmitFlightSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = 'https://skyscanner50.p.rapidapi.com/api/v1/searchAirport?query=';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '59105418dcmshf3603ffaa760351p1f2ba6jsne3209d54b546',
        'X-RapidAPI-Host': 'skyscanner50.p.rapidapi.com'
      }
};
  try {
    const [startResponse, endResponse] = await Promise.all([
      fetch(url + startDest, options),
      fetch(url + endDest, options)
    ]);

    const [startData, endData] = await Promise.all([
      startResponse.json(),
      endResponse.json()
    ]);

    setStartDestCode(startData[0]?.PlaceId || '');
    setEndDestCode(endData[0]?.PlaceId);

    const flightSearchUrl = `https://skyscanner50.p.rapidapi.com/api/v1/searchFlights?origin=${startDestCode}&destination=${endDestCode}&date=${startDate}&returnDate=${returnDate}&adults=1&currency=USD`
    
    const flightRes = await fetch(flightSearchUrl, options);
    const flightData = await flightRes.json();
    
    setFlightData(flightData);
    console.log(flightData);

  } catch (error) {
    console.error('error fetching the airport codes', error);
  }

  };




  return (
    <div className='flight-page-container'>
      <form onSubmit={handleSubmitFlightSearch}>
        <input
          type="text"
          placeholder="Start Destination"
          value={startDest}
          onChange={(e) => setStartDest(e.target.value)}
        />
        <input
          type="text"
          placeholder="End Destination"
          value={endDest}
          onChange={(e) => setEndDest(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />
        <button type="submit">Search Flights</button>
      </form>

      <div className='flight-data'>
      {flightData && <pre>{JSON.stringify(flightData, null, 2)}</pre>}
      </div>
    </div>
  )
}


export default FlightsPage;
