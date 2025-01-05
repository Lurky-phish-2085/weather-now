import axios from "axios";
import { Location, WeatherData } from "../types";
import {
  PrecipitationUnits,
  TemperatureUnits,
  TimeFormats,
  WindSpeedUnits,
} from "./enums";

type WeatherUnitOptions = {
  temperatureUnit?: TemperatureUnits;
  windSpeedUnit?: WindSpeedUnits;
  precipitationUnit?: PrecipitationUnits;
  timeFormat?: TimeFormats;
};

const API_URL =
  "https://api.open-meteo.com/v1/forecast?" +
  "current=" +
  "temperature_2m,relative_humidity_2m,wind_speed_10m," +
  "apparent_temperature,is_day,precipitation,weather_code" +
  "&forecast_days=8" +
  "&daily=" +
  "weather_code,temperature_2m_max,temperature_2m_min," +
  "apparent_temperature_max,apparent_temperature_min," +
  "precipitation_probability_max,wind_speed_10m_max" +
  "&hourly=" +
  "temperature_2m" +
  "&timezone=auto";

const WEATHER_UNITS_DEFAULTS: WeatherUnitOptions = {
  temperatureUnit: TemperatureUnits.CELSIUS,
  windSpeedUnit: WindSpeedUnits.KILOMETERS_PER_HOUR,
  precipitationUnit: PrecipitationUnits.MILLIMETER,
  timeFormat: TimeFormats.ISO8601,
};

export const getWeatherForecast = async (
  location: Location,
  options = WEATHER_UNITS_DEFAULTS
): Promise<WeatherData> => {
  const longitude = `&longitude=${location.lon}`;
  const latitude = `&latitude=${location.lat}`;
  const temperatureUnit = `&temperature_unit=${
    options.temperatureUnit || WEATHER_UNITS_DEFAULTS.temperatureUnit
  }`;
  const windSpeedUnit = `&wind_speed_unit=${
    options.windSpeedUnit || WEATHER_UNITS_DEFAULTS.windSpeedUnit
  }`;
  const precipitationUnit = `&precipitation_unit=${
    options.precipitationUnit || WEATHER_UNITS_DEFAULTS.precipitationUnit
  }`;

  const response = await axios.get(
    `${API_URL}` +
      `${longitude}` +
      `${latitude}` +
      `${temperatureUnit}` +
      `${windSpeedUnit}` +
      `${precipitationUnit}`
  );

  return response.data;
};
