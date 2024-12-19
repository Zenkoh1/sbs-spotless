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
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  Routes,
  Route,
  BrowserRouter,
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";
import { logoutUser, getName, loginUserWithToken } from "./api/sessionManager";
import Dashboardpage from "./pages/Dashboardpage";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import Checklistpage from "./pages/Checklistpage";
import { BusProvider } from "./context/busContext";
import Scanpage from "./pages/Scanpage";
import { Logout } from "@mui/icons-material";

type AuthContextType = {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  setIsAuth: () => {},
});

function App() {
  useEffect(() => {
    document.title = "Spotless";
  }, []);

  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");

  // Handling the login with token
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token") || "";
    loginUserWithToken(accessToken)
      .then(() => setIsAuth(true))
      .catch(() => {
        setIsAuth(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuth]);

  // Create the theme
  let theme = createTheme({
    palette: {
      primary: {
        main: "#d93b20",
      },
      secondary: {
        main: "#5d1e79",
      },
    },
    typography: {
      fontFamily: '"Roboto", sans-serif',
      h5: {
        fontWeight: 600,
        letterSpacing: 1.5,
      },
      h6: {
        fontWeight: 500,
      },
    },
  });
  theme = responsiveFontSizes(theme);

  // Loading screen
  if (loading)
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh", width: "100%" }}
      >
        <CircularProgress size={60} />
      </Stack>
    );

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <BusProvider>
          <div className="App">
            <BrowserRouter>
              <AppBar position="sticky" elevation={2}>
                <Toolbar
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: isMobile ? "10px" : "20px",
                  }}
                >
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Typography
                      sx={{
                        textDecoration: "none",
                        fontWeight: "bold",
                        letterSpacing: 2,
                      }}
                      variant="h5"
                      color="inherit"
                      component={RouterLink}
                      to="/dashboard"
                    >
                      Spotless
                    </Typography>
                  </Stack>

                  <div>
                    {isAuth ? (
                      <Stack spacing={2} direction="row" alignItems="center">
                        <Typography variant="h6" color="inherit">
                          Welcome {getName()}!
                        </Typography>
                        <IconButton
                          color="inherit"
                          component={RouterLink}
                          to={`/login`}
                          onClick={() => {
                            logoutUser()
                              .then(() => setIsAuth(false))
                              .catch(() => {
                                alert("Error logging out, refresh the page!");
                              });
                          }}
                        >
                          <Logout />
                        </IconButton>
                      </Stack>
                    ) : (
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
                    )}
                  </div>
                </Toolbar>
              </AppBar>

              <Routes>
                <Route path="/" element={<Loginpage />} /> {/* Home route */}
                <Route path="/dashboard" element={<Dashboardpage />} />
                <Route
                  path="/checklist/:schedule_id/:number_plate"
                  element={<Checklistpage />}
                />
                <Route path="/login" element={<Loginpage />} />
                <Route path="/register" element={<Registerpage />} />
                <Route
                  path="/checklist/:schedule_id/:number_plate/scan/:step_id"
                  element={<Scanpage />}
                />
              </Routes>
            </BrowserRouter>
          </div>
        </BusProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
