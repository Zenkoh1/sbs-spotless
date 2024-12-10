import { Container, Typography, Stack, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from "@mui/material";
import { useParams } from "react-router-dom";
import Searchbar from "../../components/Searchbar";
import { useEffect, useState } from "react";
import Bus from "../../types/Bus.type";
import { Edit } from "@mui/icons-material";

const ViewBusModel = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => setBuses([
    {id: "1", model: "SBS123", year: "2021", licensePlate: "SBS123", seats: 40, color: "red", imageUrl: "https://picsum.photos/200", description: "Bus description"}, 
    {id: "2", model: "SBS234", year: "2021", licensePlate: "SBS123", seats: 40, color: "red", imageUrl: "https://picsum.photos/200", description: "Bus description"},
  ]), []);

  return (
    <Container>
      <Stack direction="row" spacing={4}>
        <img src="https://picsum.photos/400" width={400} height={400} alt="Bus"/>
        <Box>
          <Typography variant="h5">
            Bus Model {id}
          </Typography>
          <Typography>
            Other bus details
          </Typography>

          <Button variant="outlined" color="secondary">
            Edit Cleaning Steps
          </Button>
        </Box>
      </Stack>

      <Box>
        <Typography variant="h5">
          Buses with this model
        </Typography>
        <Searchbar onSearch={(query: string) => {console.log(`Searched for ${query}`)}}/>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>License Plate</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Seats</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buses.map((bus, index) => (
              <TableRow key={index}>
                <TableCell>{bus.licensePlate}</TableCell>
                <TableCell>{bus.model}</TableCell>
                <TableCell>{bus.year}</TableCell>
                <TableCell>{bus.seats}</TableCell>
                <IconButton>
                  <Edit />
                </IconButton>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  )
}

export default ViewBusModel;