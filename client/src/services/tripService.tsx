import axios from "axios";
import { config } from "../config/config";
import { TripForm } from "../interfaces/tripInterface";

// Create a trip (POST)
export const createTrip = async (formData: TripForm) => {
  try {
    const response = await axios.post(`${config.backend.serverURL}/trips/create`, formData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get trip by TripID (GET)
export const getAllTripsByUserId = async (userId: string) => {
  try {
    const response = await axios.get(`${config.backend.serverURL}/trips/tripsbyuserid/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get all trips by userEmail (GET)
export const getAllTripsByUserEmail = async (userEmail: string) => {
  try {
    const response = await axios.get(`${config.backend.serverURL}/trips/mytrips/${userEmail}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
