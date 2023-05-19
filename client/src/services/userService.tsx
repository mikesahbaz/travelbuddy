import axios from "axios";
import { config } from "../config/config";
import { RegisterForm } from "../interfaces/registerFormInterface";

export const registerUser = async (formData: RegisterForm) => {
  try {
    const response = await axios.post(`${config.backend.serverURL}/users/create`, formData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${config.backend.serverURL}/users/get`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
