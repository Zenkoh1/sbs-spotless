import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";
import {
  AppBar,
  Button,
  Toolbar,
  Stack,
  Typography,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";
import {
  Routes,
  Route,
  BrowserRouter,
  Link as RouterLink,
} from "react-router-dom";
import { logoutUser, getName, loginUserWithToken } from "./api/sessionManager";
import Homepage from "./pages/Homepage";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

type AuthContextType = {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType>({isAuth: false, setIsAuth: () => {}});

function App() {
  useEffect(() => {
    document.title = "Spotless";
  }, []);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token") || "";
    loginUserWithToken(accessToken)
      .then(() => setIsAuth(true))
      .catch(() => {
        setIsAuth(false);
      }).finally(() => {
        setLoading(false);
      });
  }, [isAuth]);

  // Should be in a separate file if you want to really customize the theme
  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  if (loading)
    return (
      <Stack alignItems="center">
        <CircularProgress />
      </Stack>
    );

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <div className="App">
          <BrowserRouter>
            <AppBar position="static" elevation={0}>
              <Toolbar
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Stack spacing={2} direction="row" alignItems="center">
                  <Typography
                    sx={{ textDecoration: "none", fontWeight: "bold" }}
                    variant="h5"
                    color="inherit"
                    component={RouterLink}
                    to="/"
                  >
                    Spotless
                  </Typography>
                  {isAuth && (
                    <Typography variant="h6">Welcome {getName()}!</Typography>
                  )}
                </Stack>
                <div>
                  {!isAuth ? (
                    <Stack spacing={2} direction="row">
                      <Button
                        className="Button"
                        variant="contained"
                        color="secondary"
                        component={RouterLink}
                        to="/login"
                      >
                        Login
                      </Button>
                      <Button
                        className="Button"
                        variant="contained"
                        color="secondary"
                        component={RouterLink}
                        to="/register"
                      >
                        Register
                      </Button>
                    </Stack>
                  ) : (
                    <Stack spacing={2} direction="row">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          logoutUser()
                            .then(() => setIsAuth(false))
                            .catch(() => {
                              alert("Error logging out, refresh the page!");
                            });
                        }}
                      >
                        Logout
                      </Button>
                    </Stack>
                  )}
                </div>
              </Toolbar>
            </AppBar>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Loginpage />} />
              <Route path="/register" element={<Registerpage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
