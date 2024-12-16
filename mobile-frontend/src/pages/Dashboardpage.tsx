import React, { Suspense, useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import {
  CircularProgress,
  Typography,
  Stack,
  Box,
  AppBar,
  Tabs,
  Tab,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import useAPI from "../api/useAPI";
import {
  CleaningSchedule_Backend_Type,
  CleaningSchedule_Frontend_Type,
} from "../types/CleaningSchedule.type";

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

  const { fetchAPI, loading, data } =
    useAPI<CleaningSchedule_Backend_Type[]>(`cleaning_schedules`);
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<CleaningSchedule_Frontend_Type[]>(
    []
  );

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
    fetchAPI();
    if (!loading) {
      const groupedSchedules: CleaningSchedule_Frontend_Type[] = [];
      data!.forEach((schedule) => {
        const datetime = new Date(schedule.datetime);
        const existingGroup = groupedSchedules.find(
          (group) => group.datetime.getTime() === datetime.getTime()
        );
        if (existingGroup) {
          existingGroup.schedules.push(schedule);
        } else {
          groupedSchedules.push({
            datetime,
            schedules: [schedule],
          });
        }
      });
      groupedSchedules.sort(
        (a, b) => a.datetime.getTime() - b.datetime.getTime()
      );
      setSchedules(groupedSchedules);
      // console.log(groupedSchedules);
    }
  }, [isAuth, loading]);

  return (
    <Box sx={{ width: "100%" }}>
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
            <Tab label="All Schedules" {...a11yProps(1)} />
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0} dir={theme.direction}>
          <TodaySchedule schedules={schedules} />
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
          <AllSchedules schedules={schedules} />
        </TabPanel>
      </Box>
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

function TodaySchedule(props: { schedules: CleaningSchedule_Frontend_Type[] }) {
  const { schedules } = props;
  const navigate = useNavigate();
  const todaySchedules = schedules.find(
    (item) =>
      getStartOfDay(item.datetime).getTime() ===
      getStartOfDay(new Date()).getTime()
  );
  return (
    <Stack spacing={3}>
      <Typography variant="h5">Today's Schedule</Typography>
      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Bus Plate Numbers</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todaySchedules && todaySchedules.schedules.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>No schedules for today</TableCell>
              </TableRow>
            )}
            {todaySchedules &&
              todaySchedules.schedules.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.datetime}</TableCell>
                  <TableCell>Bus {item.bus.number_plate}</TableCell>
                  <TableCell>
                    {item.status != "COMPLETED" && (
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(
                            `/checklist/${item.id}/${item.bus.number_plate}`
                          )
                        }
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}

function AllSchedules(props: { schedules: CleaningSchedule_Frontend_Type[] }) {
  const { schedules } = props;
  return (
    <Stack spacing={3}>
      <Typography variant="h5">All Schedules</Typography>
      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Bus Number Plates</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {schedules.map((item) => (
              <TableRow key={item.datetime.getTime()}>
                <TableCell>{item.datetime.toDateString()}</TableCell>
                <TableCell>
                  {item.schedules
                    .map((schedule) => `${schedule.bus.number_plate}`)
                    .join(", ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}

export default Dashboardpage;
