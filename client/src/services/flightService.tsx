import axios from "axios";
import { config } from "../config/config";

export const toggleFavoriteFlight = async (tripId: string, flightFormData: any) => {
  try {
    const response = await axios.put(`${config.backend.serverURL}/flights/${tripId}/favorite`, flightFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
