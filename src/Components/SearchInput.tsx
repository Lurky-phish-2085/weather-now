import { useQuery, useQueryClient } from "@tanstack/react-query";
import "beercss";
import debounce from "lodash.debounce";
import isEmpty from "lodash.isempty";
import "material-dynamic-colors";
import { ChangeEvent, useMemo, useState } from "react";
import { searchLocations } from "../api/geocodingApi";
import { useAppContext } from "../Contexts/hooks";
import { Location } from "../types";

function SearchInput() {
  const { selectLocation, searches, clearSearches } = useAppContext();

  const [searchInputOpen, setSearchInputOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [clearSearchDialogOpen, setClearSearchDialogOpen] = useState(false);

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
    setInputValue("");
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
            {isEmpty(inputValue) && !isEmpty(searches) ? (
              <>
                <div className="center-align padding">
                  <div className="row">
                    <h6 className="small max">Recent Searches</h6>
                    <button
                      className="transparent circle"
                      onClick={() => setClearSearchDialogOpen(true)}
                    >
                      <i className="large red-text">clear_all</i>
                    </button>
                  </div>
                </div>
                {searches.map((location) => (
                  <SearchInputItem
                    key={location.place_id}
                    onClick={() => handleLocationSelect(location)}
                    displayName={location.display_name}
                    latitude={location.lat}
                    longitude={location.lon}
                  />
                ))}
              </>
            ) : data ? (
              data.map((location) => (
                <SearchInputItem
                  key={location.place_id}
                  onClick={() => handleLocationSelect(location)}
                  displayName={location.display_name}
                  latitude={location.lat}
                  longitude={location.lon}
                />
              ))
            ) : (
              <></>
            )}
          </menu>
        </button>
      )}
      {clearSearchDialogOpen ? (
        <dialog className="active">
          <h5>Clear Searches?</h5>
          <div>This action cannot be undone.</div>
          <nav className="right-align no-space">
            <button className="transparent link">Cancel</button>
            <button
              onClick={() => {
                clearSearches();
                setClearSearchDialogOpen(false);
              }}
              className="transparent link"
            >
              Confirm
            </button>
          </nav>
        </dialog>
      ) : (
        <></>
      )}
    </>
  );
}

type SearchInputItemProps = {
  displayName: string;
  latitude: string | number;
  longitude: string | number;
  onClick?: () => void;
};

function SearchInputItem({
  displayName,
  latitude,
  longitude,
  onClick,
}: SearchInputItemProps) {
  return (
    <a onClick={() => onClick && onClick()} className="row">
      <i>location_on</i>
      <div className="column">
        <strong>{displayName}</strong>
        <div>latitude: {latitude}</div>
        <div>longitude: {longitude}</div>
      </div>
    </a>
  );
}

export default SearchInput;
