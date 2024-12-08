import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

type FormTextFieldProps = TextFieldProps & {
  setInput: React.Dispatch<React.SetStateAction<string>>;
  input: string;
};

/* This component is a text field for forms for the Login and Register pages*/
const FormTextField = ({
  setInput,
  input,
  ...restProps
}: FormTextFieldProps) => {
  return (
    <TextField
      onChange={(e) => setInput(e.target.value)}
      required
      variant="outlined"
      type="text"
      sx={{ mb: 3 }}
      fullWidth
      value={input}
      {...restProps}
    />
  );
};

export default FormTextField;
