import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezonePlug from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isEmpty from "lodash.isempty";
import { getWMOCodeInterpretation } from "../api/wmoInterpretApi";
import { ForecastOverviewData } from "../types";

dayjs.extend(utc);
dayjs.extend(timezonePlug);
dayjs.extend(customParseFormat);

type ForecastOverviewProps = {
  data: ForecastOverviewData;
};

function ForecastOverview({ data }: ForecastOverviewProps) {
  const {
    locationName,
    date,
    timezone,
    temperature,
    feelsLikeTemp,
    wmoCode,
    isDay,
    precipitation,
    humidity,
    windSpeed,
    units,
  } = data;

  const isDateEqual = (date1: Dayjs, date2: Dayjs) =>
    date1.format("YYYY-MM-DD") === date2.format("YYYY-MM-DD");

  const timeNow = dayjs().tz(timezone);

  const displayDate = isDateEqual(date, timeNow)
    ? "NOW"
    : date.format("MMM  DD");

  const dayAndTime = isDateEqual(date, timeNow)
    ? date.format("dddd h:mm A")
    : date.format("dddd");

  const wmoCodeInterpretation = useQuery({
    queryKey: ["wmo-code-interpretation", wmoCode],
    queryFn: () => getWMOCodeInterpretation(wmoCode),
    enabled: data && !isEmpty(data),
  });

  const timePeriod = isDay ? "day" : "night";
  const interpretation = wmoCodeInterpretation.data?.[timePeriod].description;
  const interpretationImg = wmoCodeInterpretation.data?.[timePeriod].image;
  const interpretationImgAlt = interpretation;

  return (
    <div className="page bottom active">
      <div className="grid">
        <div className="s6 middle-align">
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
            {temperature}
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
          <img src={interpretationImg} alt={interpretationImgAlt} />
        </div>
      </div>
    </div>
  );
}

export default ForecastOverview;
