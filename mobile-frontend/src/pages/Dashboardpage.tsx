import {
  CircularProgress,
  Typography,
  Stack,
  Box,
  Button,
  AppBar,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";

import useAPI from "../api/useAPI";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import { getID } from "../api/sessionManager";
import { BusType } from "../types/Bus.type";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { useBuses } from "../context/busContext";
import {
  CleaningSchedule_BackendType,
  Status,
} from "../types/CleaningSchedule.type";

const sampleData: CleaningSchedule_BackendType[] = [
  {
    id: 1,
    user_id: 1,
    date: "2024-12-14",
    bus_ids: [1],
    status: Status.ASSIGNED,
  },
  {
    id: 2,
    user_id: 1,
    date: "2024-12-15",
    bus_ids: [1],
    status: Status.ASSIGNED,
  },
  {
    id: 3,
    user_id: 1,
    date: "2024-12-16",
    bus_ids: [1],
    status: Status.ASSIGNED,
  },
  {
    id: 4,
    user_id: 1,
    date: "2024-12-17",
    bus_ids: [1],
    status: Status.ASSIGNED,
  },
];

const getStartOfDay = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

const Dashboardpage = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box display="inline-block" width="100vw">
      <Typography variant="h4">DASHBOARD</Typography>
      <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="dashboard-tabs"
          >
            <Tab label="Today's Schedule" {...a11yProps(0)} />
            <Tab label="All Schedule" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <TodaySchedule />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <AllSchedules />
        </TabPanel>
      </Box>
      <Outlet />
    </Box>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

function TodaySchedule() {
  // Get today's schedule
  const { fetchAPI, loading, data } = useAPI<CleaningSchedule_BackendType[]>(
    `gettodayschedule`,
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  const [scheduleItem, setScheduleItem] = useState<
    CleaningSchedule_BackendType[]
  >([]);
  const isAuth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
    // fetchAPI();

    setScheduleItem([sampleData[0]]);
  }, [isAuth]);

  return (
    <Stack>
      <Typography>Today's schedule</Typography>
      <Stack>
        {scheduleItem.map((item) => {
          return (
            <>
              <Typography>{item.date.toString()}</Typography>
              <Stack>
                {item.bus_ids.map((bus_id) => {
                  return (
                    <Button
                      key={bus_id}
                      onClick={() => navigate(`/bus/${bus_id}`)}
                    >
                      {bus_id}
                    </Button>
                  );
                })}
              </Stack>
            </>
          );
        })}
      </Stack>
    </Stack>
  );
}

function AllSchedules() {
  // Get all schedules
  const { fetchAPI, loading, data } = useAPI<CleaningSchedule_BackendType[]>(
    `getschedules`,
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  const [scheduleItem, setScheduleItem] = useState<
    CleaningSchedule_BackendType[]
  >([]);
  const isAuth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
    // fetchAPI();

    setScheduleItem(sampleData);
  }, [isAuth]);
  return (
    <Stack>
      <Typography>All schedules</Typography>
      <Stack>
        {sampleData.map((item) => {
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
        })}
      </Stack>
    </Stack>
  );
}

export default Dashboardpage;

/**
 * <Suspense
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
              const itemDate = new Date(item.date);
              if (itemDate > today && itemDate < tomorrow) {
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
              } else if (itemDate > today) {
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
 */
