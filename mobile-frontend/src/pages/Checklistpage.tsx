import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../App";
import Checklist from "../components/Checklist";
import useAPI from "../api/useAPI";
import { CleaningChecklistStep_Backend_Type } from "../types/CleaningSchedule.type";
import { Button } from "@mui/material";
import axios from "axios";
import { BACKEND_URL } from "../constants";

export default function Checklistpage() {
  const { schedule_id, number_plate } = useParams();
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cleanDetails, setCleanDetails] =
    useState<CleaningChecklistStep_Backend_Type[]>(); // to implement when object shape is confirmed (details such as where needs to be cleaned)

  const { fetchAPI, loading, data } = useAPI<
    CleaningChecklistStep_Backend_Type[]
  >(`cleaning_schedules/${schedule_id}/checklist_steps`);

  useEffect(() => {
    if (!isAuth) {
      console.log("Not authenticated");
      navigate("/login");
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

  return (
    <div style={{ marginTop: 10 }}>
      <Checklist number_plate={number_plate!} checklist={cleanDetails!} />
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
