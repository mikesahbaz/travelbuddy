import axios from "axios";

export const getAllTrips = async (userId: string) => {
  try {
    const response = await axios.get(`http://localhost:3001/trips/mytrips/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}