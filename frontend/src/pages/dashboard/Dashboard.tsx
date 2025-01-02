import {
  Typography,
  Box,
  Container,
  Grid2,
  Paper,
  Stack,
  Autocomplete,
  TextField,
  Button,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Avatar,
  Card,
  Rating,
  Icon,
} from "@mui/material";
import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import Bus from "../../types/Bus.type";
import { retrieveAllBuses } from "../../api/buses";
import { DateTimePicker } from "@mui/x-date-pickers";
import Schedule from "../../types/Schedule.type";
import User from "../../types/User.type";
import { retrieveAllCleaners } from "../../api/staff";
import { retrieveAllSchedules } from "../../api/schedules";
import { PieChart as SimplePieChart } from "react-minimal-pie-chart";
import { Info, InfoOutlined } from "@mui/icons-material";
import { LineChart, BarChart } from "@mui/x-charts";

const FAKE_DATA = [
  { date: new Date("2024-01-01"), rating: 7 },
  { date: new Date("2024-02-01"), rating: 6 },
  { date: new Date("2024-03-01"), rating: 8 },
  { date: new Date("2024-04-01"), rating: 9 },
  { date: new Date("2024-05-01"), rating: 7 },
  { date: new Date("2024-06-01"), rating: 8 },
  { date: new Date("2024-07-01"), rating: 9 },
  { date: new Date("2024-08-01"), rating: 8 },
  { date: new Date("2024-09-01"), rating: 7 },
  { date: new Date("2024-10-01"), rating: 6 },
  { date: new Date("2024-11-01"), rating: 8 },
  { date: new Date("2024-12-01"), rating: 9 },
];

const FAKE_DATA_CLEANING_TIME = [
  { hours: 1.9, number_plate: "SBS1325X" },
  { hours: 1.8, number_plate: "SBS1333X" },
  { hours: 1.8, number_plate: "SBS1324Z" },
  { hours: 1.7, number_plate: "SBS1328Z" },
  { hours: 1.6, number_plate: "SBS1322Z" },
  { hours: 1.5, number_plate: "SBS1323X" },

  { hours: 1.4, number_plate: "SBS1326Z" },
  { hours: 1.4, number_plate: "SBS1327X" },

  { hours: 1.3, number_plate: "SBS1329X" },
  { hours: 1.3, number_plate: "SBS1330Z" },
  { hours: 1.2, number_plate: "SBS1331X" },
  { hours: 1.1, number_plate: "SBS1332Z" },
];
const ChartGrid = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Grid2 size={6}>
    <Card sx={{ pt: 2 }}>
      <Typography variant="h5">{title}</Typography>
      <Box p={2} height={300}>
        {children}
      </Box>
    </Card>
  </Grid2>
);

const Dashboard = () => {
  return (
    <Container>
      <Grid2 container spacing={3}>
        <ChartGrid title="Average Bus Survey Rating">
          <LineChart
            dataset={FAKE_DATA}
            xAxis={[
              {
                dataKey: "date",
                valueFormatter: (value) =>
                  new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "numeric",
                  }).format(value),
              },
            ]}
            series={[
              {
                dataKey: "rating",
                type: "line",
              },
            ]}
            yAxis={[
              {
                domainLimit: (min, max) => ({
                  min: 0,
                  max: 10,
                }),
              },
            ]}
          />
        </ChartGrid>
        <ChartGrid title="Average Cleaning Time (Top 10)">
          <BarChart
            dataset={FAKE_DATA_CLEANING_TIME}
            layout="horizontal"
            margin={{ left: 75 }}
            xAxis={[
              {
                domainLimit: (min, max) => ({
                  min: 0,
                  max: 2,
                }),
              },
            ]}
            series={[
              {
                dataKey: "hours",
              },
            ]}
            yAxis={[
              {
                dataKey: "number_plate",
                valueFormatter: (value) => value,
                scaleType: "band",
                labelStyle: { fontSize: 5 },
              },
            ]}
          ></BarChart>
        </ChartGrid>
      </Grid2>
    </Container>
  );
};

export default Dashboard;
