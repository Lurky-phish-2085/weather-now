import axios from "axios";

const API_URL = "https://api.country.is/";

export const getIPCountry = async (ip: string = "") => {
  const response = await axios.get(`${API_URL}${ip}`);

  return response.data;
};
