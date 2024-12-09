import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import {
  Stack,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";
import {
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { loginUserWithToken } from "./api/sessionManager";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

import Login from "./pages/Login";
import Registerpage from "./pages/Registerpage";
import HomePage from "./pages/HomePage";
import { Navbar } from "./components/Navbar";

type AuthContextType = {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType>({isAuth: false, setIsAuth: () => {}});

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token") || "";
    loginUserWithToken(accessToken)
      .then(() => setIsAuth(true))
      .catch(() => {
        setIsAuth(true); // FIXME: Set to true for testing
      }).finally(() => {
        setLoading(false);
      });
  }, [isAuth]);

  // Should be in a separate file if you want to really customize the theme
  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  if (loading) {
    return (
      <Stack alignItems="center">
        <title>Loading...</title>
        <CircularProgress />
      </Stack>
    );
  }

  if (!isAuth) {
    return (
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={{ isAuth, setIsAuth }}>
          <div className="App">
            <title>Login</title>
            <BrowserRouter>
              <Login />
            </BrowserRouter>
          </div>
      </AuthContext.Provider>
    </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <div className="App">
          <title>Spotless</title>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
