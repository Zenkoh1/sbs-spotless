import { useEffect, useState } from "react";
import Schedule from "../../types/Schedule.type";
import { createSingleSchedule, retrieveAllSchedules, ScheduleSingle } from "../../api/schedules";
import { Box, Button, Fab, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { format, subDays, addDays } from "date-fns";
import Bus from "../../types/Bus.type";
import { retrieveAllBuses } from "../../api/buses";
import { useNavigate } from "react-router-dom";
import SingleScheduleForm from "./SingleScheduleForm";
import { ArrowBack, ArrowForward, List } from "@mui/icons-material";

const AllSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [buses, setBuses] = useState<Bus[]>([]);

  const [singleScheduleForm, setSingleScheduleForm] = useState<{isOpen: boolean, bus: Bus | null, datetime: Date}>({ isOpen: false, bus: null, datetime: new Date() });

  const navigate = useNavigate();

  useEffect(() => {
    retrieveAllSchedules()
      .then(result => setSchedules(result))
      .catch(error => console.error(error));
    retrieveAllBuses()
      .then(result => setBuses(result))
      .catch(error => console.error(error));
  }, []);

  const handleScheduleSingle = (values: ScheduleSingle) => {
    createSingleSchedule(values)
      .then(result => {
        setSchedules([ ...schedules, result ]);
      })
      .catch(error => console.error(error))
  }

  // TODO: Add "Schedule now" button to schedule a bus for a specific day
  // TODO: Add "View details" button to view/edit the schedule details
  // TODO: Add "Delete" button to delete the schedule
  // TODO: Add mass schedule option

  // Helper: Group schedules by bus and day
  const getWeeklySchedule = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startDate, i);
      return {
        date,
        formatted: format(date, "yyyy-MM-dd"),
      };
    });

    const busesWithSchedules: Record<number, Record<string, Schedule | null>> = {};

    buses.forEach(bus => {
      busesWithSchedules[bus.id] = {};
      days.forEach(day => {
        busesWithSchedules[bus.id][day.formatted] = null;
      });
    });

    schedules.forEach(schedule => {
      const busId = schedule.bus;
      const dayKey = format(new Date(schedule.datetime), "yyyy-MM-dd");

      if (busesWithSchedules[busId]) {
        busesWithSchedules[busId][dayKey] = schedule;
      }
    });

    return { days, busesWithSchedules };
  };

  const { days, busesWithSchedules } = getWeeklySchedule();

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Weekly Cleaning Schedule
      </Typography>
      <Stack direction="row">
        <IconButton onClick={() => setStartDate(subDays(startDate, 7))}>
          <ArrowBack />
        </IconButton>
        <IconButton onClick={() => setStartDate(addDays(startDate, 7))}>
          <ArrowForward />
        </IconButton>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Bus</TableCell>
            {days.map(day => (
              <TableCell key={day.formatted}>
                {format(day.date, "EEE, MMM d")}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(busesWithSchedules).map(([busId, scheduleByDay]) => (
            <TableRow key={busId}>
              <TableCell>{buses.find(bus => bus.id === parseInt(busId))?.number_plate}</TableCell>
              {days.map(day => (
                <TableCell key={day.formatted}>
                  {scheduleByDay[day.formatted] ? (
                    <>
                      <Typography variant="body2">
                        Status: {scheduleByDay[day.formatted]?.status}
                      </Typography>
                      <Typography variant="body2">
                        Cleaners: {scheduleByDay[day.formatted]?.cleaners.join(", ") || "None"}
                      </Typography>
                    </>
                  ) : (
                    <Button 
                      onClick={() => setSingleScheduleForm({ isOpen: true, bus: buses.filter(b => b.id === parseInt(busId))[0], datetime: day.date })}
                      variant="contained"
                    >
                      Schedule
                    </Button>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {
        singleScheduleForm.bus && 
        <SingleScheduleForm 
          bus={singleScheduleForm.bus}
          datetime={singleScheduleForm.datetime} 
          onCancel={() => setSingleScheduleForm({ ...singleScheduleForm, isOpen: false })}
          onClose={() => setSingleScheduleForm({ ...singleScheduleForm, isOpen: false })}
          onSubmit={handleScheduleSingle}
          open={singleScheduleForm.isOpen}
        />
      }

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={() => {navigate("massCreate")}}
      >
        <List /> 
      </Fab>
    </Box>
  );
};

export default AllSchedules;