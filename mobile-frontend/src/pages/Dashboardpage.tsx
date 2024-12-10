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

  const [scheduleItem, setScheduleItem] = useState<CleaningScheduleType[]>([]);

  useEffect(() => {
    if (!isAuth) {
      console.log("Not authenticated");
      navigate("/login");
    }

    console.log("Fetching schedule");

    const rawData: CleaningScheduleBackendType[] = sampleData;

    // Group bus IDs by date
    const map = new Map<string, number[]>();
    for (let i = 0; i < rawData.length; i++) {
      const schedule = rawData[i];
      if (map.has(schedule.date)) {
        map.get(schedule.date)?.push(schedule.bus_id);
      } else {
        map.set(schedule.date, [schedule.bus_id]);
      }
    }

    console.log(map);

    const formattedData: CleaningScheduleType[] = [];
    for (const date of map.keys()) {
      formattedData.push({
        id: 0,
        user_id: 0,
        status: false,
        date: new Date(date),
        bus_ids: map.get(date) || [],
      });
    }

    console.log(formattedData);

    // Update the state with the transformed data
    setScheduleItem(formattedData);
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
          <Typography variant="h5">Schedule</Typography>
          <Stack>
            {scheduleItem.map((item) => {
              const today = getStartOfDay(new Date());
              const tomorrow = new Date(
                new Date().setDate(today.getDate() + 1)
              );
              if (item.date > today && item.date < tomorrow) {
                return (
                  <>
                    <Typography>{item.date.toString()}</Typography>
                    <Stack>
                      {item.bus_ids.map((bus_id) => {
                        return (
                          <Button
                            key={bus_id}
                            onClick={() => navigate(`bus/${bus_id}`)}
                          >
                            {bus_id}
                          </Button>
                        );
                      })}
                    </Stack>
                  </>
                );
              } else if (item.date > today) {
                return (
                  <>
                    <Typography>{item.date.toString()}</Typography>
                    <Stack>
                      {item.bus_ids.map((bus_id) => {
                        return (
                          <Button key={bus_id} disabled>
                            {bus_id}
                          </Button>
                        );
                      })}
                    </Stack>
                  </>
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
