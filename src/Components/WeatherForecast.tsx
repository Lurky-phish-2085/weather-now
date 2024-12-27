import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import isEmpty from "lodash.isempty";
import { useEffect } from "react";
import { useAppContext } from "../Contexts/hooks";
import { getCapitalCityOf } from "../api/countryApi";
import { searchLocations } from "../api/geocodingApi";
import { getCountryByIP } from "../api/ipToCountryApi";
import { getWeatherForecast } from "../api/weatherApi";
import { getWMOCodeInterpretation } from "../api/wmoInterpretApi";

function WeatherForecast() {
  const { location, selectLocation, temperatureUnit } = useAppContext();

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

  const countryOfIP = useQuery({
    queryKey: ["ip-to-country"],
    queryFn: () => getCountryByIP(),
    enabled: isEmpty(location),
  });
  const initialLocation = useMutation({
    mutationFn: searchLocations,
    onSuccess: (data) => {
      const userIPCountry = data[0];
      selectLocation(userIPCountry);
      queryClient.removeQueries({ queryKey: ["ip-to-country"] });
    },
  });

  useEffect(() => {
    const setInitialLocation = async (countryName: string) => {
      const capitalCity = await getCapitalCityOf(countryName);
      initialLocation.mutate(
        `${capitalCity ? capitalCity : ""} ${countryName}`
      );
    };
    if (!isEmpty(location)) return;
    if (!countryOfIP.data) return;

    setInitialLocation(countryOfIP.data.country);
  }, [countryOfIP.data]);

  const wmoCodeInterpretation = useQuery({
    queryKey: ["wmo-code-interpretation", data?.current.weather_code],
    queryFn: () =>
      getWMOCodeInterpretation(data ? data?.current.weather_code : -1),
    enabled: data && !isEmpty(data),
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["wmo-code-interpretation", data?.current.weather_code],
    });
  }, [location, data]);

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
          <div className="grid">
            <div className="s6">
              <h4>Weather at:</h4>
              <div className="large-text">{location.display_name}</div>
            </div>
            <div className="s6 right-align">
              <h4>NOW</h4>
            </div>
          </div>
          <hr className="small" />
          <div className="grid">
            <div className="s6">
              <h1>
                {data.current.temperature_2m}
                <span>&thinsp;</span>
                {data.current_units.temperature_2m}
              </h1>
              <div>
                <div>
                  Feels Like: {data.current.apparent_temperature}
                  {data.current_units.apparent_temperature}
                </div>
                <div>
                  Precipitation: {data.current.precipitation}
                  <span>&thinsp;</span>
                  {data.current_units.precipitation}
                </div>
                <div>
                  Humidity: {data.current.relative_humidity_2m}
                  {data.current_units.relative_humidity_2m}
                </div>
                <div>
                  Wind Speed: {data.current.wind_speed_10m}
                  <span>&thinsp;</span>
                  {data.current_units.wind_speed_10m}
                </div>
              </div>
            </div>
            <div className="s6 right-align">
              <h4>
                {
                  wmoCodeInterpretation.data?.[
                    data.current.is_day ? "day" : "night"
                  ].description
                }
              </h4>
              <img
                src={
                  wmoCodeInterpretation.data?.[
                    data.current.is_day ? "day" : "night"
                  ].image
                }
                alt={
                  wmoCodeInterpretation.data?.[
                    data.current.is_day ? "day" : "night"
                  ].description
                }
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default WeatherForecast;
