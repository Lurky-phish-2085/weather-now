import "beercss";
import "material-dynamic-colors";
import Header from "./Components/Header";
import { AppContextProvider } from "./Contexts/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from "./Components/Main";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <AppContextProvider>
        <QueryClientProvider client={queryClient}>
          <Header />
          <Main />
        </QueryClientProvider>
      </AppContextProvider>
    </>
  );
}

export default App;
