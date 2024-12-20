import axios from "axios";
import { Location, WeatherData } from "../types";

type GetWeatherForecastOptions = {
  temperatureUnit?: "celsius" | "fahrenheit";
  windSpeedUnit?: "kmh" | "ms" | "mph" | "kn";
  precipitationUnit?: "mm" | "inch";
  timeFormat?: "iso8601" | "unixtime";
};

const GET_WEATHER_FORECAST_DEFAULT_OPTIONS: GetWeatherForecastOptions = {
  temperatureUnit: "celsius",
  windSpeedUnit: "kmh",
  precipitationUnit: "mm",
  timeFormat: "iso8601",
};

const API_URL =
  "https://api.open-meteo.com/v1/forecast?&current=temperature_2m,is_day&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min";

export const getWeatherForecast = async (
  location: Location,
  options = GET_WEATHER_FORECAST_DEFAULT_OPTIONS
): Promise<WeatherData> => {
  const longitude = `&longitude=${location.lon}`;
  const latitude = `&latitude=${location.lat}`;
  const temperatureUnit = `&temperature_unit=${
    options.temperatureUnit ||
    GET_WEATHER_FORECAST_DEFAULT_OPTIONS.temperatureUnit
  }`;
  const windSpeedUnit = `&wind_speed_unit=${
    options.windSpeedUnit || GET_WEATHER_FORECAST_DEFAULT_OPTIONS.windSpeedUnit
  }`;
  const precipitationUnit = `&precipitation_unit=${
    options.precipitationUnit ||
    GET_WEATHER_FORECAST_DEFAULT_OPTIONS.precipitationUnit
  }`;
  const timezone = `&timezone=${Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone.replace("/", "%2F")}`;

  const response = await axios.get(
    `${API_URL}${longitude}${latitude}${timezone}${temperatureUnit}${windSpeedUnit}${precipitationUnit}`
  );

  return response.data;
};
