import React, { useEffect, useState } from 'react';
import './flightsPage.css';
import NavBar from '../NavBar/NavBar';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../../firebase';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const FlightsPage: React.FC = () => {
  const [startDest, setStartDest] = useState('');
  const [endDest, setEndDest] = useState('');
  const [startDate, setStartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [startDestCode, setStartDestCode] = useState('');
  const [endDestCode, setEndDestCode] = useState('');
  const [flightData, setFlightData] = useState<any[] | null>(null);

  function formatDuration(durationInMinutes: number) {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return `${hours}h ${minutes}m`;
  }
  

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
        <div>
        <label>From</label>
        <input
          type="text"
          placeholder="Start Destination"
          value={startDest}
          onChange={(e) => setStartDest(e.target.value)}
        />
        </div>
        <div>
        <label>To</label>
        <input
          type="text"
          placeholder="End Destination"
          value={endDest}
          onChange={(e) => setEndDest(e.target.value)}
        />
        </div>
        <div>
        <label>Depart</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        </div>
        <div>
        <label>Return</label>
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />
        </div>
        <button type="submit">Search Flights</button>
      </form>

      <div className='flight-data'>
      {flightData && flightData.map( (flight) => (
        <div key={flight.id} className='flight-item'>
          <div className='main-flight-content'>
            <div className='flight-carrier'>{flight.legs[0].carriers[0].name}</div>
            <div className='flight-details-top'>
              <div className='flight-origin-and-time'>
                <h2>{new Date(flight.legs[0].departure).toLocaleTimeString()}</h2>
                <h2>{flight.legs[0].origin.display_code}</h2>
              </div>
              <div className='flight-duration-and-arrow'>
                <h4>{formatDuration(flight.legs[0].duration)}</h4>
                <FaArrowRight className='arrow-right'/>
              </div>
              <div className='flight-destination-and-time'>
                <h2>{new Date(flight.legs[0].arrival).toLocaleTimeString()}</h2>
                <h2>{flight.legs[0].destination.display_code}</h2>
              </div>
            </div>
            <div className='flight-details-bottom'>
              <div className='flight-origin-and-time'>
                <h2>{new Date(flight.legs[1].departure).toLocaleTimeString()}</h2>
                <h2>{flight.legs[1].origin.display_code}</h2>
              </div>
              <div className='flight-duration-and-arrow'>
                <h4>{formatDuration(flight.legs[1].duration)}</h4>
                <FaArrowLeft className='arrow-left'/>
              </div>
              <div className='flight-destination-and-time'>
                <h2>{new Date(flight.legs[1].arrival).toLocaleTimeString()}</h2>
                <h2>{flight.legs[1].destination.display_code}</h2>
              </div>
            </div>
          </div>
          <div className='right-flight-container'>
            <h1>${flight.price.amount}</h1>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}


export default FlightsPage;
