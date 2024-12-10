import { useEffect, useContext } from "react";
import UploadImageComponent from "../components/UploadImageComponent";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";

export default function Scanpage() {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      console.log("User is not authenticated, redirecting to login page");
      navigate("/login");
    }
  }, [isAuth]);

  return (
    <Stack>
      <h1>Scanpage</h1>
      <img src="https://via.placeholder.com/150" alt="placeholder" />{" "}
      {/* image to show the angle cleaner has to take */}
      <UploadImageComponent />
    </Stack>
  );
}
