import axios from "axios";
//import { IStay } from "../interfaces/tripInterface";

export const toggleFavoriteStay = async (tripId: string, propertyId: any) => {
  try {
    const response = await axios.put(`http://localhost:3001/stays/${tripId}/favorite`, propertyId);
    return response.data;
  } catch (error) {
    console.error('Error in toggling favorite Stay', error);
    throw error;
  }
}