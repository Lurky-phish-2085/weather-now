import { ForecastOverviewData } from "../types";
import DailyForecastChip from "./DailyForecastChip";

type DailyForecastsProps = {
  data: ForecastOverviewData[];
  onSelect: (forecast: ForecastOverviewData) => void;
};

function DailyForecasts({ data, onSelect }: DailyForecastsProps) {
  return (
    <div className="grid">
      {data.map((forecast, index) => (
        <>
          {index === 6 && <div className="l l4"></div>}
          <div key={index} className="s12 m6 l2">
            <DailyForecastChip
              onClick={() => onSelect(forecast)}
              data={forecast}
            />
          </div>
          {index === 8 && <div className="l l4"></div>}
        </>
      ))}
    </div>
  );
}

export default DailyForecasts;
