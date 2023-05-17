import React, { useState } from 'react';
import { useParams } from 'react-router';
import './airbnbsPage.css';
import NavBar from '../NavBar/NavBar';
import { Carousel } from 'react-responsive-carousel';
import { FaHeart, FaStar } from 'react-icons/fa';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { toggleFavoriteStay } from '../../services/stayService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MdPlace } from 'react-icons/md';

const AirbnbsPage: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [guests, setGuests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [idData, setIdData] = useState<any>({ data: []});
  // const [airbnbData, setAirbnbData] = useState<any[] | null>(null);
  const { tripId } = useParams();

  const handleFavoriteClick = async (airbnb: any) => {
    const stayFormData = {
      propertyId: airbnb.id,
      images: airbnb.images,
      listingName: airbnb.listingName,
      avgRating: airbnb.avgRating,
      publicAddress: airbnb.publicAddress,
      listingBedLabel: airbnb.listingBedLabel,
      listingBathroomLabel: airbnb.listingBathroomLabel,
      listingGuestLabel: airbnb.listingGuestLabel,
      price: airbnb.price,
    }
    try {
      if (typeof tripId === 'string') {
        const data = await toggleFavoriteStay(tripId, stayFormData);
        toast.success('Airbnb was favorited!', {
          className: 'toast-success',
          position: toast.POSITION.TOP_CENTER
        });
        console.log('Airbnb was favorited: ', data);
      }
    } catch (error) {
      console.error('Error in favoriting the airbnb', error);
      toast.error('Error favoriting the airbnb', {
        className: 'toast-error',
        position: toast.POSITION.TOP_CENTER
      });
    }
  }

  const fetchStays = async ({destination, checkIn, checkOut, priceMin, priceMax, guests}: any) => {
    setIsLoading(true);

    const url = `https://airbnb19.p.rapidapi.com/api/v1/searchDestination?query=`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY as string,
        'X-RapidAPI-Host': 'airbnb19.p.rapidapi.com'
      }
    };
    try {
      const idResponse = await fetch(url + destination, options);
      const resIdData = await idResponse.json();
      setIdData(resIdData);
      console.log(resIdData);

      await new Promise(resolve => setTimeout(resolve, 1500));

      if (resIdData.data[0]?.id) {
        const airbnbSearchUrl = `https://airbnb19.p.rapidapi.com/api/v1/searchPropertyByPlace?id=${resIdData.data[0]?.id}&totalRecords=20&currency=USD&adults=${guests}&checkin=${checkIn}&checkout=${checkOut}&priceMin=${priceMin}&priceMax=${priceMax}`;
        const airbnbRes = await fetch(airbnbSearchUrl, options);
        const airbnbData = await airbnbRes.json();
        console.log(airbnbData);
        setIsLoading(false);
        return airbnbData.data || [];

      } else {
        console.log('ID IS NOT SET');
        return [];
      }
    } catch (error) {
      console.error('Error fetching airbnb data', error);
      return [];
    }
  }

  const airbnbQuery = useQuery(
    ['airbnbs', { destination, checkIn, checkOut, priceMin, priceMax, guests }],
    async ({ queryKey }) => {
      const [, params] = queryKey;
      return await fetchStays(params);
    },
    {enabled: false }
  );

  const handleSubmitSearchForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    airbnbQuery.refetch();
  }
  
  const airbnbData = airbnbQuery.data || [];

  return (
    <div>
    <NavBar />
    <div className='airbnbs-page-container'>
      <ToastContainer />
    <form onSubmit={handleSubmitSearchForm} className='search-form'>
        <label>
          Destination:
          <input type="text" value={destination} onChange={e => setDestination(e.target.value)} required />
        </label>
        <label>
          Check-in:
          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required />
        </label>
        <label>
          Check-out:
          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required />
        </label>
        <label>
          Min price:
          <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} required />
        </label>
        <label>
          Max price:
          <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} required />
        </label>
        <label>
          Guests:
          <input type="number" value={guests} onChange={e => setGuests(e.target.value)} required />
        </label>
        <button type="submit">Search Stays</button>
      </form>
    </div>
      <div className='stays-data'>
        {isLoading && <div>Searching for stays...</div>}
        {airbnbData && airbnbData.map( (airbnb: any) => (
          <div className='airbnb-item' key={airbnb.id}>
            <div className='favorite-button' onClick={() => handleFavoriteClick(airbnb)}>
              <FaHeart />
            </div>
            <Carousel className='carousel'>
              {airbnb.images.map( (image: string) => (
                <div className='slide'>
                  <img src={image} alt='airbnb' />
                </div>
              ))}
            </Carousel>
            <h2>{airbnb.listingName}</h2>
            {airbnb.avgRating !== null && <p><FaStar className='rating-star'/> {airbnb.avgRating}</p>}
            <p>{airbnb.publicAddress}</p>
            <p>{airbnb.listingBedLabel} - {airbnb.listingBathroomLabel} - {airbnb.listingGuestLabel}</p>
            <p>{airbnb.price} per night</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AirbnbsPage;