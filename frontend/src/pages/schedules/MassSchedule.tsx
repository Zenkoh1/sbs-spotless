import { Container } from "@mui/material";
import { useState } from "react";
import { ScheduleMass } from "../../api/schedules";

const MassSchedule = () => {
  const [formState, setFormState] = useState<ScheduleMass>();

  /*
  const handleChange = (field: keyof ScheduleMass) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setFormState({ ...formState, [field]: event.target.value });
  */

  return (
    <Container>
      Dropdown to select between "Monthly" or "Weekly"
    </Container>
  )
}

export default MassSchedule;