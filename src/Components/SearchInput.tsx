import { useQuery, useQueryClient } from "@tanstack/react-query";
import "beercss";
import debounce from "lodash.debounce";
import "material-dynamic-colors";
import { ChangeEvent, useMemo, useState } from "react";
import { searchLocations } from "../api/geocodingApi";
import { Location } from "../types";
import { useAppContext } from "../Contexts/AppContext";

function SearchInput() {
  const { selectLocation } = useAppContext();

  const [searchInputOpen, setSearchInputOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery({
    queryKey: ["location-search", inputValue],
    queryFn: () => searchLocations(inputValue),
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

  const handleOpen = () => setSearchInputOpen(true);
  const handleClose = () => setSearchInputOpen(false);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    updateLocation(inputValue);
  };
  const handleClearInput = () => setInputValue("");
  const handleLocationSelect = (location: Location) => {
    selectLocation(location);
    handleClose();
  };

  return (
    <>
      {!searchInputOpen ? (
        <button className="circle transparent active" onClick={handleOpen}>
          <i>search</i>
        </button>
      ) : (
        <button className="circle transparent">
          <menu className="max active">
            <div className="field large prefix suffix no-margin fixed">
              <a onClick={handleClose}>
                <i>arrow_back</i>
              </a>
              <input
                onChange={handleInputChange}
                placeholder="Type to start searching for locations!"
                value={inputValue}
              />
              <nav className="row"></nav>
              <a onClick={handleClearInput}>
                <i>close</i>
              </a>
            </div>
            {isLoading ? (
              <div className="center-align middle-align">
                <progress />
              </div>
            ) : (
              <></>
            )}
            {data ? (
              data.map((location, index) => (
                <a
                  onClick={() => handleLocationSelect(location)}
                  key={index}
                  className="row"
                >
                  <i>location_on</i>
                  <div className="column">
                    <strong>{location.display_name}</strong>
                    <div>latitude: {location.lat}</div>
                    <div>longitude: {location.lon}</div>
                  </div>
                </a>
              ))
            ) : (
              <></>
            )}
          </menu>
        </button>
      )}
    </>
  );
}

export default SearchInput;
