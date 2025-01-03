import {
  Typography,
  Box,
  Container,
  Grid2,
  Paper,
  Stack,
  Autocomplete,
  TextField,
  Button,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Avatar,
  Card,
  Rating,
  Icon,
} from "@mui/material";
import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import Bus from "../../types/Bus.type";
import { retrieveAllBuses } from "../../api/buses";
import { DateTimePicker } from "@mui/x-date-pickers";
import Schedule from "../../types/Schedule.type";
import User from "../../types/User.type";
import { retrieveAllCleaners } from "../../api/staff";
import { retrieveAllSchedules } from "../../api/schedules";
import { PieChart as SimplePieChart } from "react-minimal-pie-chart";
import { Info, InfoOutlined } from "@mui/icons-material";

const Homepage = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [cleaners, setCleaners] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    retrieveAllBuses()
      .then(result => setBuses(result))
      .catch(error => console.error(error));
    retrieveAllCleaners()
      .then(result => setCleaners(result))
      .catch(error => console.error(error));
    retrieveAllSchedules()
      .then(result => setSchedules(result.filter(r => isSameDay(r.datetime, new Date()))))
      .catch(error => console.error(error))
  }, []);

  return (
    <Container>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr", // Two columns: 3 parts for main content, 1 part for sidebar
          gridTemplateRows: "auto auto", // Two rows: adjust height automatically
          gap: "16px",
        }}
      >
        <Box sx={{ gridColumn: "1 / span 1", gridRow: "1 / span 1"}}>
          <BusCleanlinessQuery buses={buses} />
        </Box>
        <Box sx={{ gridColumn: "1 / span 1", gridRow: "2 / span 1" }}>
          <LiveBusStatus buses={buses} cleaners={cleaners} schedules={schedules} />
        </Box>
        <Box sx={{ gridColumn: "2 / span 1", gridRow: "1 / span 2", height: "100%" }}>
          <PieChart schedules={schedules} />
        </Box>
      </Box>
    </Container>
  );
};

const BusCleanlinessQuery = ({ buses } : { buses: Bus[] }) => {
  const [cleaninessQueryFormState, setCleanlinessQueryFormState] = useState<{ bus: number, time: Date }>({ bus: buses[0] ? buses[0].id : 0, time: new Date() });
  const [cleanlinessQueryResult, setCleanlinessQueryResult] = useState<number | null>(null);

  return (
    <Card component={Paper} sx={{ padding: "24px" }}>
      <Typography variant="h6" textAlign="start" gutterBottom>Bus cleanliness</Typography>
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        <Autocomplete
          options={buses}
          getOptionLabel={(option) => option.number_plate}
          value={buses.find(bus => bus.id === cleaninessQueryFormState.bus)}
          onChange={(_, value) => setCleanlinessQueryFormState({ ...cleaninessQueryFormState, bus: value?.id || 0 }) }
          renderInput={params => <TextField {...params} label="Bus" />}
          sx={{ flexGrow: 1 }}
        />
        <DateTimePicker
          label="Query Time"
          value={cleaninessQueryFormState.time}
          onChange={date => setCleanlinessQueryFormState({...cleaninessQueryFormState, time: date || new Date()})}
          sx={{ width: "300px", maxWidth: "auto" }}
        />
        <Button variant="contained" onClick={() => setCleanlinessQueryResult(Math.random() * 10)}>
          Check
        </Button>
      </Stack>
      {cleanlinessQueryResult && (
        <Stack mt={2} direction="row" alignItems="center" spacing={2}>
          <Icon>
            <InfoOutlined />
          </Icon>
          <Typography variant="body1">
            Cleanliness results for bus {buses.find(b => b.id === cleaninessQueryFormState.bus)?.number_plate}:
          </Typography>
          <Rating value={cleanlinessQueryResult} readOnly/>
        </Stack>
      )}
    </Card>
  )
}

const LiveBusStatus = ({ schedules, buses, cleaners } : { schedules : Schedule[], buses: Bus[], cleaners: User[] }) => {
  return (
    <Container component={Paper} sx={{ padding: "24px" }}>
      <Typography variant="h6" textAlign="start" gutterBottom>Live Bus Status</Typography>
      {
        schedules.length === 0 ? (
          <Typography variant="body1">
            No cleanings scheduled yet
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    No.
                  </TableCell>
                  <TableCell>
                    Bus
                  </TableCell>
                  <TableCell>
                    Cleaners
                  </TableCell>
                  <TableCell>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  schedules.map((schedule, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{buses.find(b => b.id === schedule.bus)?.number_plate}</TableCell>
                      <TableCell>
                        <Stack direction="column" spacing={2}>
                          {schedule.cleaners.map(cleaner => (
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar sx={{ width: "32px", height: "32px"}}>
                                {cleaners.find(c => c.id === cleaner)?.name.charAt(0)}
                              </Avatar>
                              <Typography variant="body1">
                                {cleaners.find(c => c.id === cleaner)?.name}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{width: "16px", height: "16px", borderRadius: "16px", backgroundColor: schedule.status === "ASSIGNED" ? "red" : "green" }}/>
                          <Typography variant="body1">
                            {schedule.status === "ASSIGNED" ? "Not yet cleaned" : "Cleaned"}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        )
      }
    </Container>
  )
}

const PieChart = ({ schedules } : { schedules : Schedule[] }) => {
  return (
    <Container component={Paper} sx={{ padding: "24px", height: "100%" }}>
      <Typography variant="h6" textAlign="start" gutterBottom>Current Cleaning Status</Typography>
      {
        schedules.length === 0 ? (
          <Typography variant="body1">
            No cleanings scheduled yet
          </Typography>
        ) : (
          <>
            <SimplePieChart
              data={[
                { color: "red", value: schedules.filter(s => s.status === "ASSIGNED").length },
                { color: "green", value: schedules.filter(s => s.status === "COMPLETED").length },
              ]}
              lineWidth={20}
              style={{ height: "auto"}}
            />
            <Stack spacing={1} mt={2}>
              <Stack direction="row" alignContent="space-between" width="100%">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{width: "16px", height: "16px", borderRadius: "16px", backgroundColor: "red" }}/>
                  <Typography variant="body1">Not yet cleaned</Typography>
                </Stack>
                <Typography variant="body1" ml="auto">{Math.round(schedules.filter(s => s.status === "ASSIGNED").length / schedules.length * 100)}%</Typography>
              </Stack>
              <Stack direction="row" alignContent="space-between" width="100%">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{width: "16px", height: "16px", borderRadius: "16px", backgroundColor: "green" }}/>
                  <Typography variant="body1">Cleaned</Typography>
                </Stack>
                <Typography variant="body1" ml="auto">{Math.round(schedules.filter(s => s.status === "COMPLETED").length / schedules.length * 100)}%</Typography>
              </Stack>
            </Stack>
          </>
        )
      }
    </Container>
  )
}

export default Homepage;
