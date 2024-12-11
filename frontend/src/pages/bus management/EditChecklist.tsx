import { useEffect, useState } from "react";
import ChecklistItem from "../../types/ChecklistItem.type";
import { Avatar, Box, Button, Container, List, ListItem, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

const EditChecklist = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  useEffect(() => {
    setChecklistItems([
      {
        id: 1,
        title: "Check for trash",
        description: "Check for trash in the bus and remove it",
        image: null,
      },
      {
        id: 2,
        title: "Check for lost items",
        description: "Check for lost items in the bus and keep them in the lost and found",
        image: null,
      },
    ]);
  }, []);

  return (
    <Container>
      <Typography variant="h4">
        Edit Cleaning Steps Checklist
      </Typography>
      <List>
        {checklistItems?.map((checklistItem, index) => (
          <ListItem 
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            {checklistItem.image && <Avatar src={URL.createObjectURL(checklistItem.image)} variant="square" alt="Checklist item" />}
            <Box>
              <Typography variant="h5">{checklistItem.title}</Typography>
              <Typography>{checklistItem.description}</Typography>
            </Box>
          </ListItem>
        ))}
      </List>
      <Button 
        variant="contained"
        startIcon={<Add />}
      >
        Add new item
      </Button>
    </Container>
  )
}

export default EditChecklist;