import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  SelectChangeEvent,
  Autocomplete,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { ScheduleMass, DayOfWeek, createMassSchedule } from "../../api/schedules";
import { retrieveAllBuses } from "../../api/buses";
import Bus from "../../types/Bus.type";
import User from "../../types/User.type";
import { retrieveAllCleaners } from "../../api/staff";
import Checklist from "../../types/Checklist.type";
import { retrieveAllChecklists } from "../../api/checklists";
import { useNavigate } from "react-router-dom";

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

// TODO: Fix me
const MassSchedule = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [cleaners, setCleaners] = useState<User[]>([]);
  const [cleaningChecklists, setCleaningChecklists] = useState<Checklist[]>([]);
  const navigate = useNavigate();

  const [formState, setFormState] = useState<ScheduleMass>({
    interval: "weekly",
    start_date: new Date(),
    end_date: new Date(),
    time: new Date(),
    cleaning_checklist: 0,
    cleaners: [],
    buses: [],
    days_of_week: [],
    days_of_month: []
  });

  useEffect(() => {
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

  const handleChangeType = (event: SelectChangeEvent<"weekly" | "monthly">) => {
    setFormState({ ...formState, interval: event.target.value as "weekly" | "monthly", days_of_month: [], days_of_week: [] });
  };

  const handleDaySelection = (day: number | string) => {
    if (formState.interval === "monthly") {
      const updatedDays = formState.days_of_month?.includes(day as number)
        ? formState.days_of_month.filter((d) => d !== day)
        : [...(formState.days_of_month || []), day as number];
      setFormState({ ...formState, days_of_month: updatedDays });
    } else {
      const updatedDays = formState.days_of_week?.includes(day as DayOfWeek)
        ? formState.days_of_week.filter((d) => d !== day)
        : [...(formState.days_of_week|| []), day as DayOfWeek];
      setFormState({ ...formState, days_of_week: updatedDays });
    }
  };

  const handleSubmit = () => {
    createMassSchedule(formState)
      .then(result => {
        navigate("/schedules");
        console.log("Mass Schedule Created:", result)
      })
      .catch(error => console.error(error));
  }

  return (
    <Container>
      <Typography variant="h4" mb={2}>
        Mass Scheduling
      </Typography>
      <Stack spacing={2}>
        {/* Dropdown for Weekly or Monthly */}
        <FormControl fullWidth>
          <InputLabel id="schedule-type-label">Schedule Type</InputLabel>
          <Select
            labelId="schedule-type-label"
            value={formState.interval}
            onChange={handleChangeType}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>

        {formState.interval === "monthly" && (
          <TextField
            label="Days of the Month (e.g., 1, 2, 3, 5)"
            fullWidth
            defaultValue={formState.days_of_month?.join(", ") || ""}
            onBlur={(e) => {
              const input = e.target.value;
              const parsedDays = input
                .split(",") // Split the input by commas
                .map((day) => parseInt(day.trim(), 10)) // Trim and parse each value
                .filter((day) => !isNaN(day) && day >= 1 && day <= 31); // Filter out invalid values
              setFormState((prev) => ({
                ...prev,
                days_of_month: parsedDays,
              }));
            }}
            helperText="Enter days as a comma-separated list (1-31). Invalid numbers will be ignored."
          />
        )}

        {formState.interval === "weekly" && (
          <FormGroup row>
            {daysOfWeek.map((day) => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    checked={formState.days_of_week?.includes(day as DayOfWeek)}
                    onChange={() => handleDaySelection(day)}
                  />
                }
                label={day}
              />
            ))}
          </FormGroup>
        )}

        <Stack direction="row" spacing={2}>
          <DatePicker
            label="Start Date"
            value={formState.start_date}
            onChange={(date) => setFormState({ ...formState, start_date: date ? date : new Date() })}
            sx={{ width: "50%" }}
          />
          <DatePicker
            label="End Date"
            value={formState.end_date}
            onChange={(date) => setFormState({ ...formState, end_date: date ? date : new Date() })}
            sx={{ width: "50%" }}
          />
        </Stack>

        <TimePicker
          label="Time of Day"
          value={formState.time}
          onChange={(time) => setFormState({ ...formState, time: time ? time : new Date() })}
        />

        <Autocomplete 
          multiple
          options={buses}
          getOptionLabel={(option) => option.number_plate}
          value={buses.filter(bus => formState.buses.includes(bus.id))}
          onChange={(_, value) => setFormState({ ...formState, buses: value.map(bus => bus.id) })}
          renderInput={(params) => <TextField {...params} label="Bus" />}
        />

        <Autocomplete
          multiple
          options={cleaners}
          getOptionLabel={(option) => option.name}
          value={cleaners.filter(cleaner => formState.cleaners.includes(cleaner.id))}
          onChange={(_, value) => setFormState({ ...formState, cleaners: value.map(cleaner => cleaner.id) })}
          renderInput={(params) => <TextField {...params} label="Cleaners" />}
        />

        <Autocomplete
          options={cleaningChecklists}
          getOptionLabel={(option) => option.title}
          value={cleaningChecklists.find(checklist => checklist.id === formState.cleaning_checklist) || null}
          onChange={(_, value) => setFormState({ ...formState, cleaning_checklist: value ? value.id : 0 })}
          renderInput={(params) => <TextField {...params} label="Cleaning Checklist" />}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Schedule
        </Button>
      </Stack>
    </Container>
  );
};

export default MassSchedule;
