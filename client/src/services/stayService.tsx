import axios from "axios";
import { config } from "../config/config";
import { StayForm } from "../interfaces/stayInterface";

// Update a stay (PATCH)
export const toggleFavoriteStay = async (tripId: string, stayFormData: StayForm) => {
  try {
    const response = await axios.patch(`${config.backend.serverURL}/stays/${tripId}/favorite`, stayFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
