export type Coordinates = {
  longitude: string;
  latitude: string;
};

export type Location = {
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
    is_day: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    is_day: number;
  };
};
