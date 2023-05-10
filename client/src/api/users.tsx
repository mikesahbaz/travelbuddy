import axios from "axios";
import { RegisterForm } from "../interfaces/registerFormInterface";

export const registerUser = async (formData: RegisterForm) => {
  try {
    const response = await axios.post('http://localhost:3001/users/createUser', formData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};