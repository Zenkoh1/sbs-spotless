import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Link as RouterLink } from "react-router-dom";
import { CleaningChecklistStep_Backend_Type } from "../types/CleaningSchedule.type";

export default function Checklist(props: {
  checklist: CleaningChecklistStep_Backend_Type[];
}) {
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Check</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.checklist &&
              props.checklist.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.cleaning_checklist_item.title}</TableCell>
                  <TableCell>
                    {item.status === "IN_PROGRESS" && (
                      <CircularProgress size={24} color="warning" />
                    )}
                    {item.status === "COMPLETE" && (
                      <CheckCircleIcon color="success" />
                    )}
                    {item.status === "INCOMPLETE" && (
                      <CancelIcon color="error" />
                    )}
                  </TableCell>
                  <TableCell>
                    {item.status !== "COMPLETE" && (
                      <Link
                        component={RouterLink}
                        to={`scan/${item.id}`}
                        underline="hover"
                        color="primary"
                      >
                        Scan
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
