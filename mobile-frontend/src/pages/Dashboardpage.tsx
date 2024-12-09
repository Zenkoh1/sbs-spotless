import {
  CircularProgress,
  Typography,
  Stack,
  Box,
  Button,
} from "@mui/material";

import useAPI from "../api/useAPI";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import { getID } from "../api/sessionManager";
import BusType from "../types/Bus.type";
import { Link as RouterLink, Outlet } from "react-router-dom";

const Dashboardpage = () => {
  // This doenst actually do anything now
  // I'll leave it here for reference
  const { fetchAPI, loading, data } = useAPI<BusType[]>(`getbuses`, {
    headers: {
      "content-type": "application/json",
    },
  });

  const [buses, setBuses] = useState<BusType[]>([]);

  const { isAuth } = useContext(AuthContext);

  useEffect(() => {
    if (isAuth) {
      console.log("Fetching buses");
      // get all the buses to be cleaned today
      // fetchAPI();
      setBuses(data!);
      const sampleData = [
        {
          id: 1,
          bus_number: "KCB 123",
        },
        {
          id: 2,
          bus_number: "KCB 124",
        },
        {
          id: 3,
          bus_number: "KCB 125",
        },
      ];
      setBuses(sampleData);
    }
  }, [isAuth]);

  return (
    <Box display="inline-block" width="75vw">
      <Typography variant="h4">DASHBOARD</Typography>
      <Suspense
        fallback={
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        }
      >
        <Box>
          <Typography variant="h5">Buses to be cleaned today</Typography>
          <Stack>
            {buses.map((bus) => (
              <Button key={bus.id} component={RouterLink} to={`bus/${bus.id}`}>
                <Typography>{bus.bus_number}</Typography>
              </Button>
            ))}
          </Stack>
        </Box>
      </Suspense>
      <Outlet />
    </Box>
  );
};

export default Dashboardpage;
