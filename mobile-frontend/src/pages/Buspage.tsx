import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../App";
import Checklist from "../components/Checklist";
import useAPI from "../api/useAPI";

export default function Buspage() {
  const { id } = useParams();
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cleanDetails, setCleanDetails] = useState<string[]>(); // to implement when object shape is confirmed (details such as where needs to be cleaned)

  const { fetchAPI, loading, data } = useAPI<string[]>(`getbus/${id}`);

  useEffect(() => {
    if (!isAuth) {
      console.log("Not authenticated");
      navigate("/login");
    }
    // setCleanDetails(data!);
    const sampleData = [
      "Driver's seat",
      "Passenger's seat",
      "Windows",
      "Floor",
    ];
    setCleanDetails(sampleData);
  }, [isAuth]);

  return (
    <div>
      <h1>{id}</h1>
      <Checklist bus_number={id!} locations={cleanDetails!} />
    </div>
  );
}
