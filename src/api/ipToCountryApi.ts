import axios from "axios";
import { CountryIPData } from "../types";

const API_URL = "https://api.country.is/";

export const getCountryByIP = async (
  ip: string = ""
): Promise<CountryIPData> => {
  const response = await axios.get(`${API_URL}${ip}`);

  return response.data;
};
