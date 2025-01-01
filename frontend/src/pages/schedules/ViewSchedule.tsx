import { useEffect, useState } from "react";
import {
  retrieveAllChecklistStepsByScheduleId,
  retrieveScheduleById,
} from "../../api/schedules";
import { useParams } from "react-router-dom";
import Schedule from "../../types/Schedule.type";
import { Step } from "../../types/Step.type";
import Bus from "../../types/Bus.type";
import { retrieveAllBuses } from "../../api/buses";
import { Card, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import { getImagePreview } from "../../util/imageHelper";
import { format } from "date-fns";
import Checklist from "../../types/Checklist.type";
import { retrieveAllChecklists } from "../../api/checklists";
import { retrieveAllCleaners } from "../../api/staff";
import User from "../../types/User.type";

const ViewSchedule = () => {
  const { id } = useParams<{ id: string }>();
  const [schedule, setSchedule] = useState<Schedule>();
  const [steps, setSteps] = useState<Step[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [cleaners, setCleaners] = useState<User[]>([]);

  useEffect(() => {
    retrieveScheduleById(parseInt(id!))
      .then((result) => {
        setSchedule(result);
      })
      .then(() => {
        retrieveAllChecklistStepsByScheduleId(parseInt(id!))
          .then((result) => {
            setSteps(result);
          })
          .catch((error) => console.error(error));
      });
    retrieveAllBuses()
      .then(result => setBuses(result))
      .catch(error => console.error(error));
    retrieveAllChecklists()
      .then(result => setChecklists(result))
      .catch(error => console.error(error));
    retrieveAllCleaners()
      .then(result => setCleaners(result))
      .catch(error => console.error(error));
  },[id]);
  return (
    <Container sx={{textAlign: "start"}}>
      <Typography variant="h5">Viewing Schedule Info for {buses.find(bus => bus.id === schedule?.bus)?.number_plate}</Typography>
      <Typography variant="body1">
        <strong>Time</strong>: {format(schedule?.datetime || new Date(), "dd-MM-yyyy HH:mm")} <br />
        <strong>Cleaning Checklist</strong>: {checklists.find(c => c.id === schedule?.cleaning_checklist)?.title} <br />
        <strong>Assigned Cleaners</strong>: {schedule?.cleaners.map(cleaner => cleaners.find(c => cleaner === c.id)?.name).join(", ")}

      </Typography>
      <Stack spacing={2} mt={2}>
        {steps.map((step) => (
          <Card component={Paper} sx={{padding: "16px"}}>
            <Typography variant="h6">{step.cleaning_checklist_item.title}</Typography>
            {step.images.map(image => 
              <img src={getImagePreview(image.image)} />
            )}
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default ViewSchedule;
