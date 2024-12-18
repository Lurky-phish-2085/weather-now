import axios from "axios";
import { Location, WeatherData } from "../types";

const API_URL =
  "https://api.open-meteo.com/v1/forecast?&current=temperature_2m,is_day&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min";

export const getWeatherForecast = async (
  location: Location
): Promise<WeatherData> => {
  const longitude = `&longitude=${location.lon}`;
  const latitude = `&latitude=${location.lat}`;
  const timezone = `&timezone=${Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone.replace("/", "%2F")}`;

  const response = await axios.get(
    `${API_URL}${longitude}${latitude}${timezone}`
  );

  return response.data;
};
