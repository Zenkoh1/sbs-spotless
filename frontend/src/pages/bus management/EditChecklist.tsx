import { useState } from "react";
import ChecklistItem from "../../types/ChecklistItem.type";
import { Container, Typography } from "@mui/material";

const EditChecklist = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  return (
    <Container>
      <Typography variant="h4">
        Edit Cleaning Steps Checklist
      </Typography>
    </Container>
  )
}

export default EditChecklist;