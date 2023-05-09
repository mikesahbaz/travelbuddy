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
  const [flightData, setFlightData] = useState<any[] | null>(null);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmitFlightSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = 'https://skyscanner50.p.rapidapi.com/api/v1/searchAirport?query=';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY as string,
        'X-RapidAPI-Host': 'skyscanner50.p.rapidapi.com'
      }
};
  try {
    const startResponse = await fetch(url + startDest, options);
    const startData = await startResponse.json();
    console.log(startData);
    // setStartDestCode(startData[0]?.PlaceId);

    // await delay(2000); 

    const endResponse = await fetch(url + endDest, options);
    const endData = await endResponse.json();
    console.log(endData);
    // setEndDestCode(endData[0]?.PlaceId);

    // await delay(2000); 

    if (startData.data[0]?.PlaceId && endData.data[0]?.PlaceId) {
      const flightSearchUrl = `https://skyscanner50.p.rapidapi.com/api/v1/searchFlights?origin=${startData.data[0]?.PlaceId}&destination=${endData.data[0]?.PlaceId}&date=${startDate}&returnDate=${returnDate}&adults=1&currency=USD`
      console.log('Flight Search URL : ', flightSearchUrl);
      const flightRes = await fetch(flightSearchUrl, options);
      const flightData = await flightRes.json();
      console.log('Flight data: ', flightData);
      
      setFlightData(flightData.data.slice(0, 5));
      console.log(flightData.data.slice(0, 5));
    } else {
      console.log('CODES ARE NOT SET');
    }

  } catch (error) {
    console.error('error fetching the airport codes', error);
  }

  };




  return (
    <div className='flight-page-container'>
      <form onSubmit={handleSubmitFlightSearch} className='search-form'>
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
      {flightData && flightData.map( (flight) => (
        <div key={flight.id} className='flight-item'>
          <h1>{flight.legs[0].origin.name} To {flight.legs[0].destination.name}</h1>
        </div>
      ))}
      </div>
    </div>
  )
}


export default FlightsPage;
