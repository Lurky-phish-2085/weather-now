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
