import "beercss";
import "material-dynamic-colors";
import Header from "./Components/Header";
import { AppContextProvider } from "./Contexts/AppContext";

function App() {
  return (
    <>
      <AppContextProvider>
        <Header />
      </AppContextProvider>
    </>
  );
}

export default App;
