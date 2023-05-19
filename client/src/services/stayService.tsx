import axios from "axios";
import { config } from "../config/config";

export const toggleFavoriteStay = async (tripId: string, stayFormData: any) => {
  try {
    const response = await axios.put(`${config.backend.serverURL}/stays/${tripId}/favorite`, stayFormData);
    return response.data;
  } catch (error) {
    console.error('Error in toggling favorite Stay', error);
    throw error;
  }
}
