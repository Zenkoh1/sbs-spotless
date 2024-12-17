import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../App";
import Checklist from "../components/Checklist";
import useAPI from "../api/useAPI";
import { CleaningChecklistItems_BackendType } from "../types/CleaningSchedule.type";

export default function Buspage() {
  const { bus_id } = useParams();
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cleanDetails, setCleanDetails] =
    useState<CleaningChecklistItems_BackendType[]>(); // to implement when object shape is confirmed (details such as where needs to be cleaned)

  const { fetchAPI, loading, data } = useAPI<
    CleaningChecklistItems_BackendType[]
  >(`getbus/${bus_id}/cleaningchecklist`);

  useEffect(() => {
    if (!isAuth) {
      console.log("Not authenticated");
      navigate("/login");
    }
    // fetchAPI();
    const sampleData: CleaningChecklistItems_BackendType[] = [
      {
        id: 1,
        title: "Driver's seat",
        description: "Clean the driver's seat with a wet cloth",
      },
      {
        id: 2,
        title: "Passenger's seat",
        description: "Clean the passenger's seat with a wet cloth",
      },
      {
        id: 3,
        title: "Floor",
        description: "Clean the floor with a mop",
      },
    ];
    setCleanDetails(sampleData);
  }, [isAuth]);

  return (
    <div>
      <h1>{bus_id}</h1>
      <Checklist bus_number={bus_id!} checklist={cleanDetails!} />
    </div>
  );
}
