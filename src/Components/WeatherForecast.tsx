import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezonePlug from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isEmpty from "lodash.isempty";
import { useEffect, useState } from "react";
import { useAppContext } from "../Contexts/hooks";
import { getCapitalCityOf } from "../api/countryApi";
import { searchLocations } from "../api/geocodingApi";
import { getCountryByIP } from "../api/ipToCountryApi";
import { getWeatherForecast } from "../api/weatherApi";
import { ForecastOverviewData } from "../types";
import ForecastOverview from "./ForecastOverview";
import SkeletonScreen from "./SkeletonScreen";

dayjs.extend(utc);
dayjs.extend(timezonePlug);
dayjs.extend(customParseFormat);

function WeatherForecast() {
  const { location, selectLocation, temperatureUnit } = useAppContext();

  const [overview, setOverview] = useState({} as ForecastOverviewData);

  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery({
    queryKey: ["weather-forecast-fetch", location],
    queryFn: () => getWeatherForecast(location, { temperatureUnit }),
    enabled: !isEmpty(location),
  });

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

  useEffect(() => {
    if (isEmpty(location) || !data) {
      return;
    }

    setOverview({
      locationName: location.display_name,
      date: dayjs.utc(data.current.time),
      timezone: data.timezone,
      isDay: data.current.is_day,
      temperature: data.current.temperature_2m,
      feelsLikeTemp: data.current.apparent_temperature,
      wmoCode: data.current.weather_code,
      precipitation: data.current.precipitation,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      units: {
        tempUnit: data.current_units.temperature_2m,
        speedUnit: data.current_units.wind_speed_10m,
      },
    });
  }, [data, location]);

  return (
    <>
      {isEmpty(location) || isEmpty(overview) || isLoading ? (
        <SkeletonScreen />
      ) : (
        <></>
      )}
      {data && !isEmpty(overview) ? (
        <ForecastOverview data={overview} />
      ) : (
        <></>
      )}
    </>
  );
}

export default WeatherForecast;
