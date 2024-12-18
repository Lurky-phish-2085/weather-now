import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import GeoSearch from "./Components/GeoSearch";
import Content from "./Components/Content";
import { useState } from "react";
import { Location } from "./types";

const queryClient = new QueryClient();

function App() {
  const [location, setLocation] = useState({} as Location);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <h1>Search</h1>
        <GeoSearch
          onSearch={(location) => {
            setLocation(location);
          }}
        />
        <h1>Weather Data</h1>
        <Content place={location} />
      </QueryClientProvider>
    </>
  );
}

export default App;
