import axios from "axios";
import { TripForm } from "../interfaces/tripInterface";

export const getAllTripsByUserEmail = async (userEmail: string) => {
  try {
    const response = await axios.get(`http://localhost:3001/trips/mytrips/${userEmail}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getAllTripsByUserId = async (userId: string) => {
  try {
    const response = await axios.get(`http://localhost:3001/trips/tripsbyuserid/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const createTrip = async (formData: TripForm) => {
  try {
    const response = await axios.post('http://localhost:3001/trips/create', formData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
