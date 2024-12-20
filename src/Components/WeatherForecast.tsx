import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAppContext } from "../Contexts/hooks";
import { getWeatherForecast } from "../api/weatherApi";
import isEmpty from "lodash.isempty";

function WeatherForecast() {
  const { location, temperatureUnit } = useAppContext();

  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery({
    queryKey: ["weather-forecast-fetch", location],
    queryFn: () => getWeatherForecast(location, { temperatureUnit }),
    enabled: !isEmpty(location),
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["weather-forecast-fetch", location],
    });
  }, [location, temperatureUnit, queryClient]);

  return (
    <>
      {isEmpty(location) ? (
        <p>Use the search bar first to get started!</p>
      ) : isLoading ? (
        <progress />
      ) : (
        <></>
      )}
      {data ? (
        <>
          <p>
            <strong>Weather at: {location.display_name}</strong>
          </p>
          <p>
            <strong>NOW:</strong>
          </p>
          <hr />
          <p>
            <strong>
              TEMP: {data.current.temperature_2m}
              {data.current_units.temperature_2m}
            </strong>
          </p>

          <p>
            <strong>
              Feels like: {data.current.apparent_temperature}
              {data.current_units.apparent_temperature}
            </strong>
          </p>

          <p>
            <strong>WMO Code: {data.current.weather_code}</strong>
          </p>
          <p>
            <strong>
              Precip: {data.current.precipitation}
              {data.current_units.precipitation}
            </strong>
          </p>
          <p>
            <strong>
              Humidity: {data.current.relative_humidity_2m}
              {data.current_units.relative_humidity_2m}
            </strong>
          </p>
          <p>
            <strong>
              Wind Speed: {data.current.wind_speed_10m}
              <span>&thinsp;</span>
              {data.current_units.wind_speed_10m}
            </strong>
          </p>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default WeatherForecast;
