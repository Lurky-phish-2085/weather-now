import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "beercss";
import "material-dynamic-colors";
import Header from "./Components/Header";
import Main from "./Components/Main";
import AppContextProvider from "./Contexts/AppContextProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <AppContextProvider>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Main />
      </QueryClientProvider>
    </AppContextProvider>
  );
}

export default App;
