import { Box, Button, Dialog, DialogContent, DialogTitle, Fab, Stack, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import UserType from "../../types/User.type";
import { Add, UploadFile } from "@mui/icons-material";
import { getCleaners, registerCleaner } from "../../api/cleaners";
import Table from "../../components/Table";

const COLUMNS: { key: keyof UserType; label: string; sortable?: boolean }[] = [
  { key: "id", label: "ID", sortable: false },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
];

const AllCleaners = () => {
  const [cleaners, setCleaners] = useState<UserType[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchCleaners = () => {
    getCleaners()
      .then((result) => setCleaners(result))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchCleaners();
  }, []);

  const handleSave = (cleaner: Omit<UserType, "id">) => {
    const cleanerWithPassword = {
      ...cleaner,
      password: cleaner.password ?? "", // default to an empty string if password is undefined
    };
  
    registerCleaner(cleanerWithPassword)
      .then((result) => {
        const updatedCleaners = [...cleaners, result as UserType];
        setCleaners(updatedCleaners);
        setCreateModalOpen(false);
      })
      .catch((error) => console.error(error));
  };

  return (
    <Box>
      <Table
        columns={COLUMNS}
        data={cleaners}
        onRowClick={() => {}}
      />
      <CreateCleanerModal
        isOpen={createModalOpen}
        onSave={handleSave}
        onClose={() => setCreateModalOpen(false)}
      />
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 80,
        }}
        onClick={() => {
          setCreateModalOpen(true);
        }}
      >
        <Add />
      </Fab>
      <Fab color="primary" aria-label="upload" sx={{ position: 'fixed', bottom: 16, right: 16 }} component="label">
        <UploadFile />
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => console.log("Attempt to upload csv file")}
        />
      </Fab>
    </Box>
  );
};

const CreateCleanerModal = ({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cleaner: Omit<UserType, "id">) => void;
}) => {
  if (!isOpen) return null;

  return (
    <Dialog onClose={onClose} open>
      <DialogTitle>Create Cleaner</DialogTitle>
      <DialogContent>
        <CleanerForm
          initialValues={{ name: "", email: "", password: "", admin: false }}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

const CleanerForm = ({
  initialValues,
  onSubmit,
  onCancel,
}: {
  initialValues: Omit<UserType, "id">;
  onSubmit: (cleaner: Omit<UserType, "id">) => void;
  onCancel: () => void;
}) => {
  const [formState, setFormState] = useState(initialValues);

  const handleChange = (field: keyof Omit<UserType, "id">) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) =>
    setFormState({ ...formState, [field]: event.target.value });

  return (
    <>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={formState.name}
        onChange={handleChange("name")}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={formState.email}
        onChange={handleChange("email")}
      />
      <TextField
        label="Password"
        fullWidth
        margin="normal"
        type="password"
        value={formState.password}
        onChange={handleChange("password")}
      />
      <Stack direction="row" spacing={2} mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSubmit(formState)}
        >
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Stack>
    </>
  );
};

export default AllCleaners;