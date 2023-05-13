import axios from "axios";
import { IActivity } from "../interfaces/tripInterface";

export const toggleFavoriteActivity = async (tripId: string, backendFormData: any) => {
  try {
    const response = await axios.put(`http://localhost:3001/activities/${tripId}/favorite`,backendFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const SearchPlace_SkyScanner = async (query: string) => {
  const options = {
    method: 'GET',
    url: 'https://skyscanner50.p.rapidapi.com/api/v1/searchPlace',
    params: { query: query },
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY as string,
      'X-RapidAPI-Host': 'skyscanner50.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const SearchHotel_SkyScanner = async (entityId: string, checkIn: string, checkOut: string) => {
  const options = {
    method: 'GET',
    url: 'https://skyscanner50.p.rapidapi.com/api/v1/searchHotel',
    params: {
      entityId: entityId,
      checkin: checkIn,
      checkout: checkOut
    },
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY as string,
      'X-RapidAPI-Host': 'skyscanner50.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const SearchThingToDo_SkyScanner = async (entityId: string, lng: string, lat: string) => {
  const options = {
    method: 'GET',
    url: 'https://skyscanner50.p.rapidapi.com/api/v1/getThingsToDo',
    params: {
      entityId: '27544008',
      lat: lat,
      lng: lng
    },
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY as string,
      'X-RapidAPI-Host': 'skyscanner50.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}