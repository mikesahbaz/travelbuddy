import axios from "axios";
import { config } from "../config/config";
import { ActivityForm } from "../interfaces/activityInterface";

// Update an activity (PATCH)
export const toggleFavoriteActivity = async (tripId: string, activityFormData: ActivityForm) => {
  try {
    const response = await axios.patch(`${config.backend.serverURL}/activities/${tripId}/favorite`, activityFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const SearchPlace_SkyScanner = async (query: string) => {
  const options = {
    method: 'GET',
    url: `${config.skyscanner.apiURL}/searchPlace`,
    params: { query: query },
    headers: {
      'X-RapidAPI-Key': config.rapid.apiKey,
      'X-RapidAPI-Host': config.skyscanner.apiHost
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
    url: `${config.skyscanner.apiURL}/searchHotel`,
    params: {
      entityId: entityId,
      checkin: checkIn,
      checkout: checkOut
    },
    headers: {
      'X-RapidAPI-Key': config.rapid.apiKey,
      'X-RapidAPI-Host': config.skyscanner.apiHost
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
    url: `${config.skyscanner.apiURL}/getThingsToDo`,
    params: {
      entityId: entityId,
      lat: lat,
      lng: lng
    },
    headers: {
      'X-RapidAPI-Key': config.rapid.apiKey,
      'X-RapidAPI-Host': config.skyscanner.apiHost
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
