import { Dayjs } from "dayjs";

export type Coordinates = {
  longitude: string;
  latitude: string;
};

export type Location = {
  place_id: number;
  display_name: string;
  lon: string;
  lat: string;
};

export type WeatherData = {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    is_day: string;
    precipitation: string;
    weather_code: string;
    wind_speed_10m: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily_units: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    apparent_temperature_max: string;
    apparent_temperature_min: string;
    precipitation_probability_max: string;
    wind_speed_10m_max: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
  };
};

export type CountryIPData = {
  country: string;
  ip: string;
};

export type CountryData = {
  name: string;
  capitalCity: string;
  code: string;
};

export type WMOCodeInterpretation = {
  day: {
    description: string;
    image: string;
  };
  night: {
    description: string;
    image: string;
  };
};

export type ForecastOverviewData = {
  locationName: string;
  date: Dayjs;
  timezone: string;
  temperature: number;
  temperatureMax: number;
  temperatureMin: number;
  feelsLikeTemp: number;
  feelsLikeTempMax: number;
  feelsLikeTempMin: number;
  wmoCode: number;
  isDay: number;
  precipitation: number;
  precipitationMax: number;
  humidity: number;
  windSpeed: number;
  windSpeedMax: number;
  units: {
    tempUnit: string;
    speedUnit: string;
  };
};
