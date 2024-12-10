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
import { BusType } from "../types/Bus.type";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { useBuses } from "../context/busContext";
import {
  CleaningScheduleBackendType,
  CleaningScheduleType,
} from "../types/CleaningSchedule.type";

const sampleData: CleaningScheduleBackendType[] = [
  {
    id: 1,
    user_id: 1,
    bus_id: 1,
    date: "2024-12-10",
    status: false,
  },
  {
    id: 2,
    user_id: 1,
    bus_id: 2,
    date: "2024-12-10",
    status: false,
  },
  {
    id: 3,
    user_id: 1,
    bus_id: 3,
    date: "2024-12-11",
    status: false,
  },
  {
    id: 4,
    user_id: 1,
    bus_id: 4,
    date: "2024-12-12",
    status: false,
  },
];

const getStartOfDay = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

const Dashboardpage = () => {
  const navigate = useNavigate();
  const { isAuth } = useContext(AuthContext);
  const { fetchAPI, loading, data } = useAPI<CleaningScheduleBackendType[]>(
    `getschedule`,
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );

  // const { buses, setBuses, markBus } = useBuses();
  const [schedule, setSchedule] = useState<CleaningScheduleType[]>([]);

  useEffect(() => {
    if (!isAuth) {
      console.log("Not authenticated");
      navigate("/login");
    }
    console.log("Fetching schedule");
    // fetchAPI();

    setSchedule(
      sampleData.map((schedule) => ({
        ...schedule,
        date: new Date(schedule.date),
      }))
    );
  }, [isAuth]);

  // should display a schedule of buses to be cleaned in each day
  // example:
  // 10 dec 2024 (today)
  // KCB 123 clickable
  // KCB 124 clickable
  // 11 dec 2024
  // KCB 125 not clickable
  // KCB 126 not clickable

  // only show buses to be cleaned today and in the future
  // blank out the buses not to be cleaned today

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
          <Typography variant="h5">Schedule</Typography>
          <Stack>
            {schedule.map((schedule) => {
              const today = getStartOfDay(new Date());
              const tomorrow = new Date(
                new Date().setDate(today.getDate() + 1)
              );
              if (schedule.date > today && schedule.date < tomorrow) {
                return (
                  <Button
                    key={schedule.bus_id}
                    onClick={() => navigate(`/bus/${schedule.bus_id}`)}
                  >
                    {schedule.bus_id}
                  </Button>
                );
              } else if (schedule.date > today) {
                return (
                  <Button
                    key={schedule.bus_id}
                    disabled
                    // onClick={() => navigate(`/bus/${schedule.bus_id}`)}
                  >
                    {schedule.bus_id}
                  </Button>
                );
              }
            })}
          </Stack>
        </Box>
      </Suspense>
      <Outlet />
    </Box>
  );
};

export default Dashboardpage;
