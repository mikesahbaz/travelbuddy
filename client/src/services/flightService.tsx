import axios from "axios";
import { ILeg } from "../interfaces/tripInterface";

export const toggleFavoriteFlight = async (tripId: string, flightFormData: any) => {
  try {
    const response = await axios.put(`http://localhost:3001/flights/${tripId}/favorite`, flightFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}