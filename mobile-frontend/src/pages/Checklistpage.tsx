import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../App";
import Checklist from "../components/Checklist";
import useAPI from "../api/useAPI";
import {
  CleaningChecklistStep_Backend_Type,
  CleaningSchedule_Backend_Type,
} from "../types/CleaningSchedule.type";
import { Badge, Button, Typography } from "@mui/material";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { PriorityHigh } from "@mui/icons-material";

export default function Checklistpage() {
  const { schedule_id, number_plate } = useParams();
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cleanDetails, setCleanDetails] =
    useState<CleaningChecklistStep_Backend_Type[]>(); // to implement when object shape is confirmed (details such as where needs to be cleaned)

  const { fetchAPI, loading, data } = useAPI<
    CleaningChecklistStep_Backend_Type[]
  >(`cleaning_schedules/${schedule_id}/checklist_steps`);

  const [schedule, setSchedule] = useState<CleaningSchedule_Backend_Type>();

  useEffect(() => {
    if (!isAuth) {
      console.log("Not authenticated");
      navigate("/login");
    }
    try {
      const fetchSchedule = async () => {
        const scheduleResponse = await axios.get(
          `${BACKEND_URL}cleaning_schedules/${schedule_id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setSchedule(scheduleResponse.data);
      };
      fetchSchedule();
    } catch (error) {
      console.error(error);
    }
    fetchAPI();
    if (!loading) {
      console.log(data);
      setCleanDetails(data!);
    }
  }, [isAuth, loading]);

  const handleSubmit = async () => {
    try {
      const updateStatusResponse = await axios.patch(
        `${BACKEND_URL}cleaning_schedules/${schedule_id}/`,
        {
          status: "COMPLETED",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (updateStatusResponse.status === 200) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [surveyResults, setSurveyResults] = useState<number>(0);
  const getSurveyResults = async () => {
    try {
      const surveyResponse = await axios.get(
        `${process.env.REACT_SURVEY_BACKEND_URL}/survey/bus/${schedule?.bus.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Typography variant="h5">{number_plate}'s Checklist</Typography>

        <Button>
          <Badge
            badgeContent={surveyResults}
            color="error"
            overlap="rectangular"
            showZero
          >
            <PriorityHigh style={{ color: "black" }} />
          </Badge>
        </Button>
      </div>
      <Checklist checklist={cleanDetails!} />
      <Button
        style={{ marginTop: 10 }}
        variant={
          cleanDetails?.every((step) => step.status === "COMPLETE")
            ? "contained"
            : "outlined"
        }
        disabled={
          !cleanDetails?.every((step) => step.status === "COMPLETE") || loading
        }
        onClick={handleSubmit}
      >
        Complete Checklist
      </Button>
    </div>
  );
}
