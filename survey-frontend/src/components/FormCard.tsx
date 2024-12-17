import { Card, CardContent, Typography, Divider, Box } from "@mui/material";
import { ReactNode } from "react";

interface FormCardProps {
  title: string;
  required?: boolean;
  children: ReactNode;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  children,
  required = false,
}) => {
  return (
    <Card sx={{ mt: 2, mb: 0 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={"bold"} textAlign="left">
          {title} {required && <span style={{ color: "red" }}>*</span>}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ mt: 2 }}>{children}</Box>
      </CardContent>
    </Card>
  );
};

export default FormCard;
