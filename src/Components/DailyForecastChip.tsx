import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezonePlug from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isEmpty from "lodash.isempty";
import { getWMOCodeInterpretation } from "../api/wmoInterpretApi";
import { ForecastOverviewData } from "../types";

dayjs.extend(utc);
dayjs.extend(timezonePlug);
dayjs.extend(customParseFormat);

type DailyForecastChipProps = {
  data: ForecastOverviewData;
  selected?: boolean;
  onClick: (forecast: ForecastOverviewData) => void;
};

function DailyForecastChip({
  data,
  selected = false,
  onClick,
}: DailyForecastChipProps) {
  const { date, wmoCode, isDay, temperatureMax, temperatureMin, units } = data;

  const displayDateLarge = date.format("ddd");
  const displayDateMedium = date.format("ddd MMM, D");
  const displayDateSmall = date.format("ddd MM/DD");

  const wmoCodeInterpretation = useQuery({
    queryKey: ["wmo-code-interpretation", wmoCode],
    queryFn: () => getWMOCodeInterpretation(wmoCode),
    enabled: data && !isEmpty(data),
  });

  const timePeriod = isDay ? "day" : "night";
  const interpretation = wmoCodeInterpretation.data?.[timePeriod].description;
  const interpretationImg = wmoCodeInterpretation.data?.[timePeriod].image;
  const interpretationImgAlt = interpretation;

  const tempMax = `${temperatureMax}${units.tempUnit}`;
  const tempMin = `${temperatureMin}${units.tempUnit}`;

  const handleClick = () => {
    onClick(data);
  };

  return (
    <div className="page bottom active">
      <article className="l center-align middle-align">
        <a onClick={handleClick}>
          <div>
            <h6>{displayDateLarge}</h6>
            <img
              style={{ width: 64, height: 64 }}
              src={interpretationImg}
              alt={interpretationImgAlt}
            />
            <div className="large-text">
              <strong>{tempMax}</strong> / {tempMin}
            </div>
          </div>
        </a>
      </article>
      <article className="m">
        <a onClick={handleClick}>
          <div className="grid">
            <div className="s6 center-align middle-align">
              <h6 className="medium">{displayDateMedium}</h6>
            </div>
            <div className="s2 center-align middle-align">
              <img src={interpretationImg} alt={interpretationImgAlt} />
            </div>
            <div className="s2 center-align middle-align">
              <div>
                <div className="medium-text">
                  <strong>{tempMax}</strong>
                </div>
                <div className="medium-text">{tempMin}</div>
              </div>
            </div>
            <div className="s2 middle-align">
              <div className="large-text">{interpretation}</div>
            </div>
          </div>
        </a>
      </article>
      <article className="s">
        <a onClick={handleClick}>
          <div className="grid">
            <div className="s4 middle-align">
              <h6 className="medium">{displayDateSmall}</h6>
            </div>
            <div className="s2 middle-align">
              <img src={interpretationImg} alt={interpretationImgAlt} />
            </div>
            <div className="s4 center-align middle-align">
              <div>
                <div className="large-text">
                  <strong>{tempMax}</strong>
                </div>
                <div className="large-text">{tempMin}</div>
              </div>
            </div>
            <div className="s1 center-align middle-align">
              <div className="large-padding">
                <h6 className="large">{interpretation}</h6>
              </div>
            </div>
          </div>
        </a>
      </article>
    </div>
  );
}

export default DailyForecastChip;
