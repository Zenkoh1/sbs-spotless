import { Box, Button, Dialog, DialogContent, DialogTitle, Fab, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Bus from "../../types/Bus.type";
import { Add } from "@mui/icons-material";
import { retrieveAllBuses, editBus, createBus, deleteBus } from "../../api/buses";
import Table from "../../components/Table";

const COLUMNS: { key: keyof Bus; label: string; sortable?: boolean }[] = [
  { key: "id", label: "ID", sortable: false },
  { key: "number_plate", label: "License Plate", sortable: true },
  { key: "bus_model", label: "Bus Model", sortable: true },
  { key: "created_at", label: "Created At", sortable: true },
];

type ModalState = 
  { type: "view" | "edit"; bus: Bus } | 
  { type: "create"; bus: null } | 
  null;

const AllBuses = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [modalState, setModalState] = useState<ModalState>(null);

  const fetchBuses = () => {
    retrieveAllBuses()
      .then(result => setBuses(result))
      .catch(error => console.error(error));
  }

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleSave = (bus: Bus) => {
    if (modalState?.type === "edit") {
      editBus(bus)
        .then(result => {
          const updatedBuses = buses.map(model => model.id === result.id ? result : model);
          setBuses(updatedBuses);
          setModalState(null);
        })
        .catch(error => console.error(error));
    } else if (modalState?.type === "create") {
      createBus(bus)
        .then(result => {
          const updatedBuses = [...buses, result];
          setBuses(updatedBuses);
          setModalState(null);
        })
        .catch(error => console.error(error));
    }
  }

  const handleDelete = (busId: number) => {
    deleteBus(busId)
      .then(() => {
        const updatedBuses = buses.filter(model => model.id !== busId);
        setBuses(updatedBuses);
        setModalState(null);
      })
      .catch(error => console.error(error));
  }

  return (
    <Box>
      <Table
        columns={COLUMNS}
        data={buses}
        onRowClick={(row) => setModalState({ type: "view", bus: row })}
      />
      <BusModal
        modalState={modalState}
        setModalState={setModalState}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={() => setModalState(null)}
      />
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={() => {setModalState({ type: "create", bus: null})}}
      >
        <Add /> 
      </Fab>
    </Box>
  );
}

const BusModal = ({
  modalState,
  onClose,
  onSave,
  onDelete,
  setModalState,
}: {
  modalState: ModalState;
  onClose: () => void;
  onSave: (bus: Bus) => void;
  onDelete: (busId: number) => void;
  setModalState: (modalState: ModalState) => void;
}) => {
  if (!modalState) return null;

  const { type, bus } = modalState;

  if (type === "view") {
    if (!bus) return null;
    return (
      <Dialog onClose={onClose} open>
        <DialogTitle>{bus.number_plate}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <strong>ID:</strong> {bus.id}
          </Typography>
          <Typography variant="body1">
            <strong>License Plate:</strong> {bus.number_plate}
          </Typography>
          <Typography variant="body1">
            <strong>Bus model:</strong> {bus.bus_model}
          </Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <Button variant="contained" color="primary" onClick={() => onDelete(bus.id)}>
              Delete
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setModalState({ type: "edit", bus })}>
              Edit
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog onClose={onClose} open>
      <DialogTitle>{type === "edit" ? "Edit Bus Model" : "Create Bus Model"}</DialogTitle>
      <DialogContent>
        <BusForm
          initialValues={bus || { id: 0, number_plate: "", bus_model: 0 }}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

const BusForm = ({
  initialValues,
  onSubmit,
  onCancel,
}: {
  initialValues: Bus;
  onSubmit: (busModel: Bus) => void;
  onCancel: () => void;
}) => {
  const [formState, setFormState] = useState(initialValues);

  const handleChange = (field: keyof Bus) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setFormState({ ...formState, [field]: event.target.value });

  return (
    <>
      <TextField
        label="Number Plate"
        fullWidth
        margin="normal"
        value={formState.number_plate}
        onChange={handleChange("number_plate")}
      />
      <TextField
        label="Bus Model"
        fullWidth
        margin="normal"
        value={formState.bus_model}
        onChange={handleChange("bus_model")}
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
export default AllBuses;