import axios from "axios";
import { config } from "../config/config";
import { FlightForm } from "../interfaces/flightInterface";

// Update a flight (PATCH)
export const toggleFavoriteFlight = async (tripId: string, flightFormData: FlightForm) => {
  try {
    const response = await axios.patch(`${config.backend.serverURL}/flights/${tripId}/favorite`, flightFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
