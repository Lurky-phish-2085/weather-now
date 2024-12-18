import axios from "axios";
import { Location } from "../types";

const API_URL = `https://nominatim.openstreetmap.org/search?format=json`;

export const searchLocations = async (search: string): Promise<Location[]> => {
  const query = `&q=${search}`;
  const response = await axios.get<Location[]>(`${API_URL}${query}`);

  return response.data;
};
