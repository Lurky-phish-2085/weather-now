import "beercss";
import "material-dynamic-colors";
import Header from "./Components/Header";
import { AppContextProvider } from "./Contexts/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <AppContextProvider>
        <QueryClientProvider client={queryClient}>
          <Header />
        </QueryClientProvider>
      </AppContextProvider>
    </>
  );
}

export default App;
