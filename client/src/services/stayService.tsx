import axios from "axios";
//import { IStay } from "../interfaces/tripInterface";

export const toggleFavoriteStay = async (tripId: string, stayFormData: any) => {
  try {
<<<<<<< HEAD
    const response = await axios.put(`http://localhost:3001/stays/${tripId}/favorite`, propertyId);
=======
    const response = await axios.put(`http://localhost:3001/stays/${tripId}/favorite`, stayFormData);
>>>>>>> new-mike-b
    return response.data;
  } catch (error) {
    console.error('Error in toggling favorite Stay', error);
    throw error;
  }
}