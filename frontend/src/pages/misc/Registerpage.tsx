import { Button, Box } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormTextField from "../../components/FormTextField";
import { loginUser, registerUser } from "../../api/sessionManager";
import { AuthContext } from "../../App";

/* -------------------------------------- */
/* This file is not used, user should not */
/* be able to self register. This is kept */
/* for reference                          */
/* -------------------------------------- */

const Registerpage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const { setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    registerUser({ email, password, name: username })
      .then(() => {
        loginUser({ email, password }).then(() => {
          navigate("/");
          setIsAuth(true);
          alert("User registered successfully");
        });
      })
      .catch((error) => {
        alert("Error registering user, check if email is unique");
      });
  };
  

  return (
    <Box width="50vw" display="inline-block">
      <form autoComplete="off" onSubmit={handleSubmit}>
        <h2>Registration Form</h2>
        <FormTextField
          input={username}
          setInput={setUsername}
          label="Username"
        />
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
        <FormTextField
          input={confirmPassword}
          setInput={setConfirmPassword}
          type="password"
          label="Confirm Password"
          error={confirmPasswordError !== ""}
          helperText={confirmPasswordError}
        />
        <Button variant="outlined" color="secondary" type="submit">
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Registerpage;
