import { Box, Button, Dialog, DialogContent, DialogTitle, Fab, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Checklist from "../../types/Checklist.type";
import { Add, Create } from "@mui/icons-material";
import { retrieveAllChecklists, editChecklist, createChecklist, deleteChecklist } from "../../api/checklists";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";

const COLUMNS: { key: keyof Checklist; label: string; sortable?: boolean }[] = [
  { key: "id", label: "ID", sortable: false },
  { key: "title", label: "Title", sortable: true },
  { key: "description", label: "Description", sortable: true },
  { key: "created_at", label: "Created At", sortable: true },
];

const AllChecklists = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchChecklists = () => {
    retrieveAllChecklists()
      .then(result => setChecklists(result))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const handleSave = (checklist: Checklist) => {
    createChecklist(checklist)
      .then(result => {
        const updatedChecklists = [...checklists, result];
        setChecklists(updatedChecklists);
        setCreateModalOpen(false);
      })
      .catch(error => console.error(error));
  };

  return (
    <Box>
      <Table
        columns={COLUMNS}
        data={checklists}
        onRowClick={(row) => navigate(`/checklists/${row.id}`)}
      />
      <CreateChecklistModal
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
          right: 16,
        }}
        onClick={() => { setCreateModalOpen(true); }}
      >
        <Add /> 
      </Fab>
    </Box>
  );
};

const CreateChecklistModal = ({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (checklist: Checklist) => void;
}) => {
  if (!isOpen) return null;

  return (
    <Dialog onClose={onClose} open>
      <DialogTitle>Create Checklist</DialogTitle>
      <DialogContent>
        <ChecklistForm
          initialValues={{ id: 0, title: "", description: "" }}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}

const ChecklistForm = ({
  initialValues,
  onSubmit,
  onCancel,
}: {
  initialValues: Checklist;
  onSubmit: (checklist: Checklist) => void;
  onCancel: () => void;
}) => {
  const [formState, setFormState] = useState(initialValues);

  const handleChange = (field: keyof Checklist) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setFormState({ ...formState, [field]: event.target.value });

  return (
    <>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={formState.title}
        onChange={handleChange("title")}
      />
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        value={formState.description}
        onChange={handleChange("description")}
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

export default AllChecklists;
