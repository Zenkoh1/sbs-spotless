import { Button, Box } from "@mui/material";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FormTextField from "../../components/FormTextField";
import { loginUser } from "../../api/sessionManager";
import { AuthContext } from "../../App";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuth } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    loginUser({ email, password })
      .then(() => {
        navigate("/");
        setIsAuth(true);
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data);
      });
  };

  return (
    <Box width="50vw" display="inline-block">
      <form autoComplete="off" onSubmit={handleSubmit}>
        <img src="/sbs-transit-vector-logo.svg" alt="SBS Logo" style={{ width: "300px" }}/>
        <h2>Login to Operator Dashboard</h2>
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
