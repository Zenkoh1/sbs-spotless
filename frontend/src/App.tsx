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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import Login from "./pages/misc/Login";
import HomePage from "./pages/misc/HomePage";
import Layout from "./components/Layout";
import AllBusModels from "./pages/bus models/AllBusModels";
import AllBuses from "./pages/bus models/AllBuses";
import AllChecklists from "./pages/checklist/AllChecklists";
import ViewChecklist from "./pages/checklist/ViewChecklist";
import AllCleaners from "./pages/cleaners/AllCleaners";
import AllSchedules from "./pages/schedules/AllSchedules";
import MassSchedule from "./pages/schedules/MassSchedule";
import NotFound from "./pages/misc/NotFound";

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
        setIsAuth(false);
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={{ isAuth, setIsAuth }}>
          <div className="App">
            <title>Spotless</title>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />

                <Route path="/busModels" element={<AllBusModels />} />
                <Route path="/buses" element={<AllBuses />} />
                <Route path="/checklists" element={<AllChecklists />} />
                <Route path="/checklists/:id" element={<ViewChecklist />} />
                <Route path="/cleaners" element={<AllCleaners />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </div>
      </AuthContext.Provider>
    </ThemeProvider>
                  <Route path="/busModels" element={<AllBusModels />} />
                  <Route path="/buses" element={<AllBuses />} />
                  <Route path="/checklists" element={<AllChecklists />} />
                  <Route path="/checklists/:id" element={<ViewChecklist />} />

                  <Route path="/schedules" element={<AllSchedules />} />
                  <Route path="/schedules/massCreate" element={<MassSchedule />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </div>
        </AuthContext.Provider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
