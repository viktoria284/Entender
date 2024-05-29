import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfileToken } from "../Models/User";

const api = "https://localhost:7044/api/";

export const loginAPI = async (username: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "Auth/login", {
      username: username,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const registerAPI = async (
  email: string,
  username: string,
  password: string
) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "Auth/register", {
      email: email,
      username: username,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};