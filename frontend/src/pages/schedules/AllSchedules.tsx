import { useEffect, useState } from "react";
import Schedule from "../../types/Schedule.type";
import { createSingleSchedule, retrieveAllSchedules, ScheduleSingle } from "../../api/schedules";
import { Box, Card, Chip, Fab, Icon, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { format, subDays, addDays } from "date-fns";
import Bus from "../../types/Bus.type";
import { retrieveAllBuses } from "../../api/buses";
import { useNavigate } from "react-router-dom";
import SingleScheduleForm from "./SingleScheduleForm";
import { Add, ArrowBack, ArrowForward, Link, List as ListIcon } from "@mui/icons-material";
import Checklist from "../../types/Checklist.type";
import User from "../../types/User.type";
import { retrieveAllChecklists } from "../../api/checklists";
import { retrieveAllCleaners } from "../../api/staff";

const AllSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [buses, setBuses] = useState<Bus[]>([]);
  const [cleaners, setCleaners] = useState<User[]>([]);
  const [cleaningChecklists, setCleaningChecklists] = useState<Checklist[]>([]);

  const [singleScheduleForm, setSingleScheduleForm] = useState<{isOpen: boolean, bus: Bus | null, datetime: Date}>({ isOpen: false, bus: null, datetime: new Date() });

  const navigate = useNavigate();

  useEffect(() => {
    retrieveAllSchedules()
      .then(result => setSchedules(result))
      .catch(error => console.error(error));
    retrieveAllBuses()
      .then(result => setBuses(result))
      .catch(error => console.error(error));
    retrieveAllCleaners()
      .then(result => setCleaners(result))
      .catch(error => console.error(error));
    retrieveAllChecklists()
      .then(result => setCleaningChecklists(result))
      .catch(error => console.error(error));
  }, []);

  const handleScheduleSingle = (values: ScheduleSingle) => {
    createSingleSchedule(values)
      .then(result => {
        setSchedules([ ...schedules, result ]);
        setSingleScheduleForm({ ...singleScheduleForm, isOpen: false });
      })
      .catch(error => console.error(error))
  }

  // TODO: Add "View details" button to view/edit the schedule details
  // TODO: Add "Delete" button to delete the schedule

  // Helper: Group schedules by bus and day
  const getWeeklySchedule = () => {
    const days = Array.from({ length: 5 }, (_, i) => {
      const date = addDays(startDate, i);
      return {
        date,
        formatted: format(date, "yyyy-MM-dd"),
      };
    });

    const busesWithSchedules: Record<number, Record<string, Schedule[]>> = {};

    buses.forEach(bus => {
      busesWithSchedules[bus.id] = {};
      days.forEach(day => {
        busesWithSchedules[bus.id][day.formatted] = [];
      });
    });

    schedules.forEach(schedule => {
      const busId = schedule.bus;
      const dayKey = format(new Date(schedule.datetime), "yyyy-MM-dd");

      if (busesWithSchedules[busId]) {
        if (!busesWithSchedules[busId][dayKey]) {
          busesWithSchedules[busId][dayKey] = [];
        }
        busesWithSchedules[busId][dayKey] = [...busesWithSchedules[busId][dayKey], schedule];
      }
    });

    return { days, busesWithSchedules };
  };

  const { days, busesWithSchedules } = getWeeklySchedule();

  return (
    <Box>
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
            <TableCell sx={{width: "100px"}}>Bus</TableCell>
            {days.map(day => (
              <TableCell key={day.formatted} sx={{ textAlign: "center"}}>
                {format(day.date, "EEE, MMM d")}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(busesWithSchedules).map(([busId, scheduleByDay]) => (
            <TableRow key={busId}>
              <TableCell sx={{width: "100px"}}>{buses.find(bus => bus.id === parseInt(busId))?.number_plate}</TableCell>
              {days.map(day => (
                <TableCell key={day.formatted} width="17%">
                  <Stack spacing={2} alignItems="center">
                    {scheduleByDay[day.formatted].map(schedule => (
                      <Card sx={{ bgcolor: "primary.main", padding: "16px", color: "white", width: "80%"}} onClick={() => navigate(`/schedules/${schedule.id}`)}>
                        <Typography variant="body1">{format(new Date(schedule.datetime), "HH:mm")}, {cleaningChecklists.find(c => c.id === schedule.cleaning_checklist)?.title || ""}</Typography>
                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                          {schedule.cleaners.map(cleaner => (
                            <Chip label={cleaners.find(c => c.id === cleaner)?.name} variant="outlined" sx={{color: "white"}}/>
                          ))}
                        </Stack>
                      </Card>
                    ))}
                    <IconButton onClick={() => setSingleScheduleForm({ isOpen: true, bus: buses.filter(b => b.id === parseInt(busId))[0], datetime: day.date })}>
                      <Add />
                    </IconButton>
                  </Stack>
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
          cleaners={cleaners}
          cleaningChecklists={cleaningChecklists}
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
        <ListIcon /> 
      </Fab>
    </Box>
  );
};

export default AllSchedules;