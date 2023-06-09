import React, { useEffect, useState } from 'react';
import './flightsPage.css';
import NavBar from '../NavBar/NavBar';
import { auth } from '../../firebase';
import { FaArrowRight, FaArrowLeft, FaHeart } from 'react-icons/fa';
import { useParams } from 'react-router';
import { toggleFavoriteFlight } from '../../services/flightService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useQuery, useMutation } from '@tanstack/react-query';
import { formatDuration, timeToMinutes, formatDate } from '../../utils/helperFunctions';


const FlightsPage: React.FC = () => {
  const [startDest, setStartDest] = useState('');
  const [endDest, setEndDest] = useState('');
  const [startDate, setStartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [startDestCode, setStartDestCode] = useState('');
  const [endDestCode, setEndDestCode] = useState('');
  const [startData, setStartData] = useState<any>({ data: []});
  const [endData, setEndData] = useState<any>({ data: []});
  const [isLoading, setIsLoading] = useState(false);
  const { tripId } = useParams();

  const handleBookingClick = (startPlaceId: string, endPlaceId: string, departureTime: number, returnTime: number) => {
    window.open(`https://www.skyscanner.com/transport/flights/${startPlaceId}/${endPlaceId}/${formatDate(startDate)}/${formatDate(returnDate)}/?adultsv2=1&cabinclass=economy&childrenv2=&departure-times=${departureTime}-${departureTime + 30},${returnTime}-${returnTime + 30}`)
  }

  const handleFavoriteClick = async (flight: any) => {
    console.log(startDestCode);
    console.log(flight.price);
    const flightFormData = {
      itineraryId: flight.id,
      price: flight.price,
      legs: flight.legs
    }
    try {
      if (typeof tripId === 'string') {
        const data = await toggleFavoriteFlight(tripId, flightFormData);
        toast.success('Flight was favorited!', {
          className: 'toast-success',
          position: toast.POSITION.TOP_CENTER
        });
        console.log('flight was favorited: ', data);
      }
    } catch (error) {
      console.error('Error favoriting the flight', error);
      toast.error('Error favoriting the flight', {
        className: 'toast-error',
        position: toast.POSITION.TOP_CENTER
      });
    }
  }

  const fetchFlights = async ({startDest, endDest, startDate, returnDate}: any) => {
    setIsLoading(true);

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
    setStartData(startData);

    const endResponse = await fetch(url + endDest, options);
    const endData = await endResponse.json();
    setEndData(endData);

    if (startData.data[0]?.PlaceId && endData.data[0]?.PlaceId) {
      const flightSearchUrl = `https://skyscanner50.p.rapidapi.com/api/v1/searchFlights?origin=${startData.data[0]?.PlaceId}&destination=${endData.data[0]?.PlaceId}&date=${startDate}&returnDate=${returnDate}&adults=1&currency=USD`

      const flightRes = await fetch(flightSearchUrl, options);
      const flightData = await flightRes.json();
      setIsLoading(false);
      return flightData.data.slice(0, 20)
    } else {
      console.log('CODES ARE NOT SET');
      return [];
    }
  } catch (error) {
    console.error('error fetching the airport codes', error);
    return [];
  }
  };

  const flightQuery = useQuery(
    ['flights', { startDest, endDest, startDate, returnDate}],
    async ({ queryKey }) => {
      const [, params] = queryKey;
      return await fetchFlights(params);
    },
    { enabled: false },
  )

  const handleSubmitFlightSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    flightQuery.refetch();
  }

  const flightData = flightQuery.data || [];
  

  return (
    <div className='flight-page-container'>
      <ToastContainer />
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
        {isLoading && <div>Searching for flights...</div>}
      {flightData && flightData.map( (flight: any) => (
        <div key={flight.id} className='flight-item'>
          <div className='main-flight-content'>
            <h2 className='flight-carrier'>{flight.legs[0].carriers[0].name}</h2>
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
            <FaHeart className='favorite-button' onClick={() => handleFavoriteClick(flight)} />
            <h1>${flight.price.amount}</h1>
            <button className='visit-flight-btn' onClick={() => handleBookingClick(
              startData.data[0]?.PlaceId,
              endData.data[0]?.PlaceId,
              timeToMinutes(new Date(flight.legs[0].departure).toLocaleTimeString()),
              timeToMinutes(new Date(flight.legs[1].departure).toLocaleTimeString())
            )}>Book</button>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}


export default FlightsPage;
