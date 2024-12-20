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
  "https://api.open-meteo.com/v1/forecast?&current=temperature_2m,is_day&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min";

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
  const timezone = `&timezone=${Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone.replace("/", "%2F")}`;

  const response = await axios.get(
    `${API_URL}${longitude}${latitude}${timezone}${temperatureUnit}${windSpeedUnit}${precipitationUnit}`
  );

  return response.data;
};
