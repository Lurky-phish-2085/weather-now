import { Dayjs } from "dayjs";
import { useState } from "react";
import { ForecastOverviewData } from "../types";
import DailyForecastChip from "./DailyForecastChip";

type DailyForecastsProps = {
  data: ForecastOverviewData[];
  onSelect: (forecast: ForecastOverviewData) => void;
};

function DailyForecasts({ data, onSelect }: DailyForecastsProps) {
  const [selectedForecast, setSelectedForecast] = useState(
    {} as ForecastOverviewData
  );

  const isDateEqualTo = (date: Dayjs): boolean => {
    if (!selectedForecast.date) {
      return false;
    }

    return selectedForecast.date.isSame(date, "day");
  };

  const handleClick = (forecast: ForecastOverviewData) => {
    onSelect(forecast);
    setSelectedForecast(forecast);
  };

  return (
    <div className="grid">
      {data.map((forecast, index) => (
        <>
          {index === 6 && <div className="l l4"></div>}
          <div key={index} className="s12 m6 l2">
            <DailyForecastChip
              onClick={() => handleClick(forecast)}
              data={forecast}
              selected={isDateEqualTo(forecast.date)}
            />
          </div>
          {index === 8 && <div className="l l4"></div>}
        </>
      ))}
    </div>
  );
}

export default DailyForecasts;
