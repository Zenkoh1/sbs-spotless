import { Box, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Checklist(props: {
  bus_number: string;
  locations: string[];
}) {
    function handleClick() {
        // set the react context`

        // navigate to the image scanning page
        

    }
  return (
    <Box>
      <Typography variant="h5">Checklist for {props.bus_number}</Typography>
      <Stack>
        {props.locations &&
          props.locations.map((loc) => (
            <Button key={loc} onClick={handleClick}>
              <Typography variant="h6">{loc}</Typography>
            </Button>
          ))}
      </Stack>
    </Box>
  );
}
