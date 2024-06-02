import "./App.css";
import { ThemeProvider } from "@mui/system";
import theme from "./styles/theme";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NavDrawer from "./components/NavDrawer";
import Content from "./HomePage/Content";

function App() {
  // Check if the user is authenticated by checking for a session item
  const isAuthenticated = () => {
    return sessionStorage.getItem("user") !== null;
  };

  // Create a ProtectedRoute component
  const ProtectedRoute = ({ element }) => {
    if (isAuthenticated()) {
      return element;
    } else {
      return <Navigate to="/" replace />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Content />} />
          <Route
            path="/*" // Catch all other paths
            element={<ProtectedRoute element={<NavDrawer />} />}
          />
          <Route
            element={
              <Navigate to={isAuthenticated() ? "/dashboard" : "/"} replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
