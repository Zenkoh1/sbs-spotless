import { useEffect, useState } from "react";
import {
  retrieveAllChecklistStepsByScheduleId,
  retrieveScheduleById,
} from "../../api/schedules";
import { useParams } from "react-router-dom";
import Schedule from "../../types/Schedule.type";
import { Step } from "../../types/Step.type";
import { BACKEND_URL } from "../../constants";

const createFileFromURL = async (url: string, filename: string) => {
  const response = await fetch(url);
  const blob = await response.blob(); // Get the image data as a Blob
  const file = new File([blob], filename, { type: blob.type }); // Create a File object from the Blob
  return file;
};

const ViewSchedule = () => {
  const { id } = useParams<{ id: string }>();
  const [schedule, setSchedule] = useState<Schedule>();
  const [steps, setSteps] = useState<Step[]>([]);
  useEffect(() => {
    retrieveScheduleById(parseInt(id!))
      .then((result) => {
        setSchedule(result);
      })
      .then(() => {
        retrieveAllChecklistStepsByScheduleId(parseInt(id!))
          .then((result) => {
            setSteps(result);
            console.log("steps", result);
          })
          .catch((error) => console.error(error));
      });
  },[]);
  return (
    <div>
      <h1>View Schedule</h1>
      {steps.map((step) => (
        <div>
          <h2>{step.cleaning_checklist_item.title}</h2>
          {step.images.map((image) => (
            <img
              src={`${BACKEND_URL?.replace("/api/staff/", "")}${image.image}`}
              style={{ width: "100px", height: "100px" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ViewSchedule;
