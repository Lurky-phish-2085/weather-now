import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getWeatherForecast } from "../api/weatherApi";
import { Location } from "../types";

type ContentProps = {
  place: Location;
};

function Content({ place }: ContentProps) {
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["weather-data", place],
    queryFn: () => getWeatherForecast(place),
    enabled: !!place.display_name,
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["weather-data", place],
    });
  }, [place]);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : !data || error ? (
        <p>Search and choose a location to start!</p>
      ) : (
        <textarea
          rows={25}
          cols={100}
          value={JSON.stringify(data, null, 2)}
          readOnly
        />
      )}
    </>
  );
}

export default Content;
