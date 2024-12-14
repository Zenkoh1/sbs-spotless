import { Box, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { CleaningChecklistItems_BackendType } from "../types/CleaningSchedule.type";

export default function Checklist(props: {
  bus_number: string;
  checklist: CleaningChecklistItems_BackendType[];
}) {
  return (
    <Box>
      <Typography variant="h5">Checklist for {props.bus_number}</Typography>
      <Stack>
        {props.checklist &&
          props.checklist.map((item) => (
            <Button key={item.id} component={RouterLink} to={`scan/${item.id}`}>
              <Typography variant="h6">{item.title}</Typography>
            </Button>
          ))}
      </Stack>
    </Box>
  );
}
