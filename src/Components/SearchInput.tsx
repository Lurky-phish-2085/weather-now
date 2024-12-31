import { useQuery, useQueryClient } from "@tanstack/react-query";
import "beercss";
import debounce from "lodash.debounce";
import isEmpty from "lodash.isempty";
import "material-dynamic-colors";
import { ChangeEvent, useMemo, useState } from "react";
import { searchLocations } from "../api/geocodingApi";
import { useAppContext } from "../Contexts/hooks";
import { Location } from "../types";
import Modal from "./Modal";

function SearchInput() {
  const { selectLocation, searches, clearSearches } = useAppContext();

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

  const clearInput = () => setInputValue("");
  const closeMenu = () => {
    ui("#menu");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    updateLocation(inputValue);
  };
  const handleLocationSelect = (location: Location) => {
    selectLocation(location);
    closeMenu();
    setTimeout(() => {
      clearInput();
    }, 500);
  };

  return (
    <>
      <button className="circle transparent">
        <i>search</i>
        <menu id="menu" className="max">
          <div className="field large prefix suffix no-margin fixed">
            <a onClick={closeMenu}>
              <i>arrow_back</i>
            </a>
            <input
              onChange={handleInputChange}
              placeholder="Type to start searching for locations!"
              value={inputValue}
            />
            <a onClick={clearInput}>
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
            <RecentSearchesMenu
              searches={searches}
              onSelect={(location) => handleLocationSelect(location)}
              onClear={() => setClearSearchDialogOpen(true)}
            />
          ) : data ? (
            <SearchResultsMenu
              results={data}
              onSelect={(location) => handleLocationSelect(location)}
            />
          ) : (
            <></>
          )}
        </menu>
      </button>
      <Modal
        id="clear-recent-searches-modal"
        header="Clear recent searches?"
        onClose={(confirmed) => {
          setClearSearchDialogOpen(false);
          if (confirmed) clearSearches();
        }}
        open={clearSearchDialogOpen}
      >
        <div>This action cannot be undone.</div>
      </Modal>
    </>
  );
}

type RecentSearchesMenuProps = {
  searches: Location[];
  onClear: () => void;
  onSelect: (location: Location) => void;
};

function RecentSearchesMenu({
  searches,
  onClear,
  onSelect,
}: RecentSearchesMenuProps) {
  return (
    <>
      <div className="center-align padding">
        <div className="row">
          <h6 className="small max">Recent Searches</h6>
          <button className="transparent circle" onClick={onClear}>
            <i className="large red-text">clear_all</i>
          </button>
        </div>
      </div>
      {searches.map((location) => (
        <SearchMenuItem
          key={location.place_id}
          onClick={() => onSelect(location)}
          displayName={location.display_name}
          latitude={location.lat}
          longitude={location.lon}
        />
      ))}
    </>
  );
}

type SearchResultsMenuProps = {
  results: Location[];
  onSelect: (location: Location) => void;
};

function SearchResultsMenu({ results, onSelect }: SearchResultsMenuProps) {
  return (
    <>
      {results.map((location) => (
        <SearchMenuItem
          key={location.place_id}
          onClick={() => onSelect(location)}
          displayName={location.display_name}
          latitude={location.lat}
          longitude={location.lon}
        />
      ))}
    </>
  );
}

type SearchMenuItemProps = {
  displayName: string;
  latitude: string | number;
  longitude: string | number;
  onClick?: () => void;
};

function SearchMenuItem({
  displayName,
  latitude,
  longitude,
  onClick,
}: SearchMenuItemProps) {
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
