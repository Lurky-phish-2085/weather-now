import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezonePlug from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isEmpty from "lodash.isempty";
import { useEffect } from "react";
import { useAppContext } from "../Contexts/hooks";
import { getCapitalCityOf } from "../api/countryApi";
import { searchLocations } from "../api/geocodingApi";
import { getCountryByIP } from "../api/ipToCountryApi";
import { getWeatherForecast } from "../api/weatherApi";
import { getWMOCodeInterpretation } from "../api/wmoInterpretApi";
import SkeletonScreen from "./SkeletonScreen";

dayjs.extend(utc);
dayjs.extend(timezonePlug);
dayjs.extend(customParseFormat);

function WeatherForecast() {
  const { location, selectLocation, temperatureUnit } = useAppContext();

  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery({
    queryKey: ["weather-forecast-fetch", location],
    queryFn: () => getWeatherForecast(location, { temperatureUnit }),
    enabled: !isEmpty(location),
  });
  const wmoCodeInterpretation = useQuery({
    queryKey: ["wmo-code-interpretation", data?.current.weather_code],
    queryFn: () =>
      getWMOCodeInterpretation(data ? data?.current.weather_code : -1),
    enabled: data && !isEmpty(data),
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

  return (
    <>
      {isEmpty(location) || isLoading ? <SkeletonScreen /> : <></>}
      {data ? (
        <ForecastOverview
          locationName={location.display_name}
          date={dayjs.utc(data.current.time)}
          timezone={data.timezone}
          temp={data.current.temperature_2m}
          feelsLikeTemp={data.current.apparent_temperature}
          interpretation={
            wmoCodeInterpretation.data?.[data.current.is_day ? "day" : "night"]
              .description
          }
          interpretationImgSource={
            wmoCodeInterpretation.data?.[data.current.is_day ? "day" : "night"]
              .image
          }
          interpretationImgAlt={
            wmoCodeInterpretation.data?.[data.current.is_day ? "day" : "night"]
              .description
          }
          precipitation={data.current.precipitation}
          humidity={data.current.relative_humidity_2m}
          windSpeed={data.current.wind_speed_10m}
          units={{
            tempUnit: data.current_units.temperature_2m,
            speedUnit: data.current_units.wind_speed_10m,
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
}

type ForecastOverviewProps = {
  locationName: string;
  date: Dayjs;
  timezone: string;
  temp: number;
  feelsLikeTemp: number;
  interpretation: string | undefined;
  interpretationImgSource: string | undefined;
  interpretationImgAlt?: string | undefined;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  units: {
    tempUnit: string;
    speedUnit: string;
  };
};

function ForecastOverview({
  locationName,
  date,
  timezone,
  temp,
  feelsLikeTemp,
  interpretation,
  interpretationImgSource,
  interpretationImgAlt = "",
  precipitation,
  humidity,
  windSpeed,
  units,
}: ForecastOverviewProps) {
  const timeNow = dayjs().tz(timezone).format();

  const displayDate = date.isSame(timeNow, "day")
    ? "NOW"
    : date.format("MM/DD");

  const dayAndTime = date.format("dddd h:mm A");

  return (
    <div className="page bottom active">
      <div className="grid">
        <div className="s6">
          <h4>{locationName}</h4>
        </div>
        <div className="s6 right-align middle-align">
          <div>
            <h4>{displayDate}</h4>
            <div>{dayAndTime}</div>
          </div>
        </div>
      </div>
      <hr className="small" />
      <div className="grid">
        <div className="s6">
          <h1>
            {temp}
            <span>&thinsp;</span>
            {units.tempUnit}
          </h1>
          <div>
            <div>
              Feels Like:<span>&nbsp;</span>
              {feelsLikeTemp}
              <span>&thinsp;</span>
              {units.tempUnit}
            </div>
          </div>
          <div>
            <div>
              Precipitation:<span>&nbsp;</span>
              {precipitation}%
            </div>
          </div>
          <div>
            <div>
              Humidity:<span>&nbsp;</span>
              {humidity}%
            </div>
          </div>
          <div>
            <div>
              Wind Speed:<span>&nbsp;</span>
              {windSpeed}
              <span>&thinsp;</span>
              {units.speedUnit}
            </div>
          </div>
        </div>
        <div className="s6 right-align">
          <h4>{interpretation}</h4>
          <img src={interpretationImgSource} alt={interpretationImgAlt} />
        </div>
      </div>
    </div>
  );
}

export default WeatherForecast;
