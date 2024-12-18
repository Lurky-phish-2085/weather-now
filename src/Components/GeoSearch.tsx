import { useQuery, useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import { searchLocations } from "../api/geocodingApi";
import { Location } from "../types";

type GeoSearchProps = {
  onSearch: ({ display_name, lon, lat }: Location) => void;
};

function GeoSearch({ onSearch }: GeoSearchProps) {
  const [location, setLocation] = useState("");

  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["location-search", location],
    queryFn: () => searchLocations(location),
  });

  const updateLocation = useMemo(
    () =>
      debounce((value: string) => {
        queryClient.invalidateQueries({
          queryKey: ["location-search", value],
        });
      }, 1000),
    []
  );

  useEffect(() => {
    if (!location) return;
    updateLocation(location);
  }, [location]);

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          onChange={(e) => {
            setLocation(e.target.value.trim());
          }}
        />
      </div>
      {!location ? (
        <p>Type to search!</p>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>
          There's an error... Please try again later.
        </p>
      ) : data?.length === 0 ? (
        <p>No search results...</p>
      ) : (
        data?.map((location, index) => (
          <LocationButton
            key={index}
            name={location.display_name}
            coords={{ lat: location.lat, lon: location.lon }}
            onClick={() => onSearch(location)}
          />
        ))
      )}
    </>
  );
}

type LocationButtonProps = {
  name: string;
  coords: { lon: string; lat: string };
  onClick?: (name: { lon: string; lat: string }) => void;
};

function LocationButton({ name, coords, onClick }: LocationButtonProps) {
  return (
    <>
      <button onClick={() => onClick && onClick(coords)}>{name}</button>
    </>
  );
}

export default GeoSearch;
