import { useEffect, useState } from "react";
import Table from "../../components/Table";
import BusModel from "../../types/BusModel.type";
import { editBusModel, retrieveAllBusModels, createBusModel, deleteBusModel } from "../../api/busModels";
import { Box, Button, Dialog, DialogContent, DialogTitle, Fab, Stack, TextField, Typography } from "@mui/material";
import { Add, UploadFile } from "@mui/icons-material";
import { getImagePreview } from "../../util/imageHelper";
import { format } from "date-fns";

const COLUMNS: { key: keyof BusModel; label: string; sortable?: boolean }[] = [
  { key: "id", label: "ID", sortable: false },
  { key: "name", label: "Name", sortable: true },
  { key: "description", label: "Description", sortable: false },
  { key: "created_at", label: "Created At", sortable: true },
];

type ModalState = 
  { type: "view" | "edit"; busModel: BusModel } | 
  { type: "create"; busModel: null } | 
  null;

const AllBusModels = () => {
  const [busModels, setBusModels] = useState<BusModel[]>([]);
  const [modalState, setModalState] = useState<ModalState>(null);

  const fetchBusModels = () => {
    retrieveAllBusModels()
      .then(result => setBusModels(result))
      .catch(error => console.error(error));
  }

  useEffect(() => {
    fetchBusModels();
  }, []);

  const handleSave = (busModel: BusModel) => {
    if (modalState?.type === "edit") {
      editBusModel(busModel)
        .then(result => {
          const updatedBusModels = busModels.map(model => model.id === result.id ? result : model);
          setBusModels(updatedBusModels);
          setModalState(null);
        })
        .catch(error => console.error(error));
    } else if (modalState?.type === "create") {
      createBusModel(busModel)
        .then(result => {
          const updatedBusModels = [...busModels, result];
          setBusModels(updatedBusModels);
          setModalState(null);
        })
        .catch(error => console.error(error));
    }
  }

  const handleDelete = (busModelId: number) => {
    deleteBusModel(busModelId)
      .then(() => {
        const updatedBusModels = busModels.filter(model => model.id !== busModelId);
        setBusModels(updatedBusModels);
        setModalState(null);
      })
      .catch(error => console.error(error));
  }

  return (
    <Box>
      <Table
        data={busModels}
        columns={COLUMNS}
        onRowClick={(row) => setModalState({ type: "view", busModel: row })}
      />
      <Typography variant="body2" mt={2}>
        Last updated: {busModels.length > 0 ? format(busModels.map(model => model.updated_at).sort().reverse()[0] || new Date(), "yyyy-MM-dd HH:mm").toString() : "never"}
      </Typography>
      <BusModelModal
        modalState={modalState}
        onClose={() => setModalState(null)}
        onSave={handleSave}
        onDelete={handleDelete}
        setModalState={setModalState}
      />
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 80,
        }}
        onClick={() => {setModalState({ type: "create", busModel: null})}}
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
  )
}

const BusModelModal = ({
  modalState,
  onClose,
  onSave,
  onDelete,
  setModalState,
}: {
  modalState: ModalState;
  onClose: () => void;
  onSave: (busModel: BusModel) => void;
  onDelete: (busId: number) => void;
  setModalState: (modalState: ModalState) => void;
}) => {
  if (!modalState) return null;

  const { type, busModel } = modalState;

  if (type === "view") {
    if (!busModel) return null;
    return (
      <Dialog onClose={onClose} open>
        <DialogTitle textAlign="center">Viewing Bus Model {busModel.name}</DialogTitle>
        <DialogContent>
          <img src={getImagePreview(busModel.image)} alt={busModel.name} style={{ width: "80%", marginLeft: "10%", marginBottom: "16px"}} />
          <Typography variant="body1">
            <strong>ID:</strong> {busModel.id}
          </Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {busModel.name}
          </Typography>
          <Typography variant="body1">
            <strong>Description:</strong> {busModel.description}
          </Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <Button variant="contained" color="primary" onClick={() => onDelete(busModel.id)}>
              Delete
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setModalState({ type: "edit", busModel })}>
              Edit
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog onClose={onClose} open>
      <DialogTitle textAlign="center">{type === "edit" ? "Edit Bus Model" : "Create Bus Model"}</DialogTitle>
      <DialogContent>
        <BusModelForm
          initialValues={busModel || { id: 0, name: "", description: "", image: null }}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

const BusModelForm = ({
  initialValues,
  onSubmit,
  onCancel,
}: {
  initialValues: BusModel;
  onSubmit: (busModel: BusModel) => void;
  onCancel: () => void;
}) => {
  const [formState, setFormState] = useState(initialValues);

  const handleChange = (field: keyof BusModel) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setFormState({ ...formState, [field]: event.target.value });

  return (
    <>
      {formState.image && (
        <img src={getImagePreview(formState.image)} alt="bus model" style={{ width: "80%", marginLeft: "10%", marginBottom: "16px"}}/>
      )}
      {!formState.image && (
        <Button variant="outlined" component="label" fullWidth>
          Upload image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setFormState({ ...formState, image: e.target.files?.[0] || null })}
          />
        </Button>
      )}
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={formState.name}
        onChange={handleChange("name")}
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

export default AllBusModels;