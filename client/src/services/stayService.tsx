import axios from "axios";
//import { IStay } from "../interfaces/tripInterface";

export const toggleFavoriteStay = async (tripId: string, propertyId: number) => {
  try {
    const response = await axios.put(`http://localhost:3001/flights/${tripId}/favorite`, propertyId);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}