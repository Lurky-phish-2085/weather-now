import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezonePlug from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isEmpty from "lodash.isempty";
import { useEffect, useState } from "react";
import { useAppContext } from "../Contexts/hooks";
import { getCapitalCityOf } from "../api/countryApi";
import { TemperatureUnits } from "../api/enums";
import { searchLocations } from "../api/geocodingApi";
import { getCountryByIP } from "../api/ipToCountryApi";
import { getWeatherForecast } from "../api/weatherApi";
import { ForecastOverviewData } from "../types";
import DailyForecasts from "./DailyForecasts";
import ForecastOverview from "./ForecastOverview";
import SkeletonScreen from "./SkeletonScreen";

dayjs.extend(utc);
dayjs.extend(timezonePlug);
dayjs.extend(customParseFormat);

function WeatherForecast() {
  const { location, selectLocation, temperatureUnit } = useAppContext();

  const [currentOverview, setCurrentOverview] = useState(
    {} as ForecastOverviewData
  );
  const [selectedOverview, setSelectedOverview] = useState(
    {} as ForecastOverviewData
  );
  const [dailyForecastOverview, setDailyForecastOverview] = useState(
    [] as ForecastOverviewData[]
  );

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

    const tempUnitSymbol =
      temperatureUnit === TemperatureUnits.CELSIUS ? "°C" : "°F";

    if (data.current_units.temperature_2m !== tempUnitSymbol) {
      queryClient.invalidateQueries({
        queryKey: ["weather-forecast-fetch", location],
      });
    }

    setSelectedOverview({} as ForecastOverviewData);
    setCurrentOverview({
      locationName: location.display_name,
      date: dayjs.utc(data.current.time),
      timezone: data.timezone,
      isDay: data.current.is_day,
      temperature: data.current.temperature_2m,
      temperatureMax: 0,
      temperatureMin: 0,
      feelsLikeTemp: data.current.apparent_temperature,
      feelsLikeTempMax: 0,
      feelsLikeTempMin: 0,
      wmoCode: data.current.weather_code,
      precipitation: data.current.precipitation,
      precipitationMax: 0,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windSpeedMax: 0,
      units: {
        tempUnit: data.current_units.temperature_2m,
        speedUnit: data.current_units.wind_speed_10m,
      },
    });
    setDailyForecastOverview(
      data.daily.time.map((date, index) => {
        return {
          locationName: location.display_name,
          date: dayjs.utc(date),
          timezone: data.timezone,
          isDay: 1,
          temperature: data.daily.temperature_2m_max[index],
          temperatureMax: data.daily.temperature_2m_max[index],
          temperatureMin: data.daily.temperature_2m_min[index],
          feelsLikeTemp: data.daily.apparent_temperature_max[index],
          feelsLikeTempMax: data.daily.apparent_temperature_max[index],
          feelsLikeTempMin: data.daily.apparent_temperature_min[index],
          wmoCode: data.daily.weather_code[index],
          precipitation: data.daily.precipitation_probability_max[index],
          precipitationMax: data.daily.precipitation_probability_max[index],
          humidity: 0,
          windSpeed: data.daily.wind_speed_10m_max[index],
          windSpeedMax: data.daily.wind_speed_10m_max[index],
          units: {
            tempUnit: data.current_units.temperature_2m,
            speedUnit: data.current_units.wind_speed_10m,
          },
        } as ForecastOverviewData;
      })
    );
  }, [data, location, temperatureUnit]);

  const handleDailyForecastSelect = (selected: ForecastOverviewData) => {
    if (selected.date.isSame(currentOverview.date, "day")) {
      setSelectedOverview({} as ForecastOverviewData);
      return;
    }

    setSelectedOverview(selected);
  };

  return (
    <>
      {isEmpty(location) || isEmpty(currentOverview) || isLoading ? (
        <SkeletonScreen />
      ) : (
        <></>
      )}
      {data && !isEmpty(currentOverview) ? (
        <>
          {isEmpty(selectedOverview) ? (
            <ForecastOverview data={currentOverview} />
          ) : (
            <ForecastOverview data={selectedOverview} />
          )}
          <DailyForecasts
            onSelect={(forecast) => handleDailyForecastSelect(forecast)}
            selected={currentOverview}
            data={dailyForecastOverview}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default WeatherForecast;
