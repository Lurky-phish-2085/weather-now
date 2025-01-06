import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
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

  const [currentWeatherOverview, setCurrentWeatherOverview] = useState(
    {} as ForecastOverviewData
  );
  const [selectedDayOverview, setSelectedDayOverview] = useState(
    {} as ForecastOverviewData
  );
  const [forecastOverviewDisplay, setForecastOverviewDisplay] = useState(
    currentWeatherOverview
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

    setSelectedDayOverview({} as ForecastOverviewData);

    const currentPrecipProbability = (): number => {
      const currentTime = dayjs.utc(data.current.time);
      const index = data.hourly.time.findIndex((time) =>
        dayjs.utc(time).isSame(currentTime, "hour")
      );

      return data.hourly.precipitation_probability[index];
    };

    const currentWeatherForecast = {
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
      precipitation: currentPrecipProbability(),
      precipitationMax: 0,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windSpeedMax: 0,
      units: {
        tempUnit: data.current_units.temperature_2m,
        speedUnit: data.current_units.wind_speed_10m,
      },
    };
    setCurrentWeatherOverview(currentWeatherForecast);
    setForecastOverviewDisplay(currentWeatherForecast);

    const maxHumidity = (date: Dayjs): number => {
      const hourlyHumidityIndices: number[] = data.hourly.time
        .map((time, index) => {
          return dayjs.utc(time).isSame(date, "date") ? index : -1;
        })
        .filter((index) => index !== -1);

      const hourlyHumidity: number[] = hourlyHumidityIndices.map(
        (hourIndex) => {
          return data.hourly.relative_humidity_2m[hourIndex];
        }
      );

      return Math.max(...hourlyHumidity);
    };
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
          humidity: maxHumidity(dayjs.tz(date, data.timezone)),
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
    if (selected.date.isSame(currentWeatherOverview.date, "day")) {
      setForecastOverviewDisplay(currentWeatherOverview);
      return;
    }

    setSelectedDayOverview(selected);
    setForecastOverviewDisplay(selected);
  };

  return (
    <>
      {selectedDayOverview ? <></> : <></>}
      {isEmpty(location) || isEmpty(currentWeatherOverview) || isLoading ? (
        <SkeletonScreen />
      ) : (
        <></>
      )}
      {data && !isEmpty(currentWeatherOverview) ? (
        <>
          <ForecastOverview data={forecastOverviewDisplay} />
          <DailyForecasts
            onSelect={(forecast) => handleDailyForecastSelect(forecast)}
            selected={forecastOverviewDisplay}
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
