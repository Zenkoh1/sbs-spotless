import { Button, Box, Typography } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormTextField from "../components/FormTextField";
import { loginUser } from "../api/sessionManager";
import { AuthContext } from "../App";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { setIsAuth } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsSmallScreen(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    checkScreenWidth(); // Check screen width on component mount
    window.addEventListener("resize", checkScreenWidth); // Add resize listener

    return () => {
      window.removeEventListener("resize", checkScreenWidth); // Clean up listener on unmount
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    loginUser({ email, password })
      .then(() => {
        navigate("/dashboard");
        setIsAuth(true);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
  };

  if (!isSmallScreen) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h5" gutterBottom>
          Please use a mobile device to login
        </Typography>
        <img
          src="/sbs-transit-vector-logo.svg"
          alt="SBS Transit Logo"
          style={{ width: "200px", height: "auto", marginTop: "20px" }}
        />
      </Box>
    );
  }

  return (
    <Box width="50vw" display="inline-block">
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Box textAlign="center" mb={4}>
          <img
            src="/sbs-transit-vector-logo.svg"
            alt="SBS Transit Logo"
            style={{ width: "200px", height: "auto" }}
          />
        </Box>
        <h2>Login Form</h2>
        <FormTextField
          input={email}
          setInput={setEmail}
          type="email"
          label="Email"
        />
        <FormTextField
          input={password}
          setInput={setPassword}
          type="password"
          label="Password"
        />
        <Button variant="outlined" color="secondary" type="submit">
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Loginpage;
