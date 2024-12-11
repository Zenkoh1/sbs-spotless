import { useEffect, useState } from "react";
import Table from "../../components/Table";
import BusModel from "../../types/BusModel.type";
import { editBusModel, retrieveAllBusModels, createBusModel, deleteBusModel } from "../../api/busManagement";
import { Button, Dialog, DialogContent, DialogTitle, Fab, Stack, TextField, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

const AllBusModels = () => {
  const [busModels, setBusModels] = useState<BusModel[]>([]);
  const [viewDetailsModal, setViewDetailsModal] = useState<{open: boolean, busModel: BusModel | null}>({ open: false, busModel: null });
  const [editDetailsModal, setEditDetailsModal] = useState<{open: boolean, busModel: BusModel | null}>({ open: false, busModel: null });
  const [createBusModelModal, setCreateBusModelModal] = useState<boolean>(false);

  const COLUMNS: { key: keyof BusModel; label: string; sortable?: boolean }[] = [
    { key: "id", label: "ID", sortable: false },
    { key: "name", label: "Name", sortable: true },
    { key: "description", label: "Description", sortable: false },
    { key: "created_at", label: "Created At", sortable: true },
  ]

  const handleRowClick = (row: BusModel) => {
    setViewDetailsModal({ open: true, busModel: row });
  }

  const handleEdit = (busModel: BusModel) => {
    editBusModel(busModel)
      .then(result => {
        const updatedBusModels = busModels.map(model => model.id === result.id ? result : model);
        setBusModels(updatedBusModels);
        setEditDetailsModal({ open: false, busModel: null });
      })
      .catch(error => console.error(error));
  }

  const handleCreate = (busModel: BusModel) => {
    createBusModel(busModel)
      .then(result => {
        const updatedBusModels = [...busModels, result];
        setBusModels(updatedBusModels);
        setEditDetailsModal({ open: false, busModel: null });
      })
      .catch(error => console.error(error));
  }

  const handleDelete = (busModelId: number) => {
    deleteBusModel(busModelId)
      .then(() => {
        const updatedBusModels = busModels.filter(model => model.id !== busModelId);
        setBusModels(updatedBusModels);
        setViewDetailsModal({ open: false, busModel: null });
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    retrieveAllBusModels()
      .then(result => setBusModels(result))
      .catch(error => {
        setBusModels([
          {
            id: 1,
            name: "Bus Model 1",
            image: null,
            description: "This is a bus model",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 2,
            name: "Bus Model 2",
            image: null,
            description: "This is another bus model",
            created_at: new Date(),
            updated_at: new Date(),
          }
        ])
      });
  }, []);

  return (
    <>
      <Table
        data={busModels}
        columns={COLUMNS}
        onRowClick={handleRowClick}
      />
      <BusModelDetailsModal 
        onClose={() => setViewDetailsModal({ open: false, busModel: null })} 
        open={viewDetailsModal.open} 
        busModel={viewDetailsModal.busModel} 
        onEdit={() => {
          setEditDetailsModal({ open: true, busModel: viewDetailsModal.busModel })
          setViewDetailsModal({ ...viewDetailsModal, open: false })
        }}
        onDelete={handleDelete}
      />
      <EditBusModelModal
        onClose={() => setEditDetailsModal({ open: false, busModel: null })}
        open={editDetailsModal.open}
        busModel={editDetailsModal.busModel}
        onSave={handleEdit}
      />
      {/* Uses same component as Edit */}
      <EditBusModelModal
        onClose={() => setCreateBusModelModal(false)}
        open={createBusModelModal}
        busModel={null}
        onSave={handleCreate}
      />

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={() => {setCreateBusModelModal(true)}}
      >
        <Add /> 
      </Fab>
    </>
  )
}

const BusModelDetailsModal = ({ onClose, open, busModel, onEdit, onDelete }: { onClose: () => void, open: boolean, busModel: BusModel | null, onEdit: () => void, onDelete: (busId: number) => void }) => {
  if (!busModel) return null;

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{busModel.name}</DialogTitle>
      <DialogContent>
        <img src={busModel.image ? URL.createObjectURL(busModel.image) : "defaultImagePath"} alt={busModel.name} />
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
          <Button variant="contained" color="primary" onClick={() => onDelete(busModel.id)}>Delete</Button>
          <Button variant="contained" color="secondary" onClick={onEdit}>Edit</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

const EditBusModelModal = ({ onClose, open, busModel, onSave }: { onClose: () => void, open: boolean, busModel: BusModel | null, onSave: (busModel: BusModel) => void }) => {
  const [name, setName] = useState(busModel?.name || "");
  const [description, setDescription] = useState(busModel?.description || "");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (busModel) {
      setName(busModel.name);
      setDescription(busModel.description);
      setImage(busModel.image);
    } else {
      setName("");
      setDescription("");
      setImage(null);
    }
  }, [busModel]);


  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Edit Bus Model</DialogTitle>
      <DialogContent>
        {image && <img src={URL.createObjectURL(image)} alt="bus model" width="100%" />}
        {!image && 
          <Button variant="contained" component="label">
            Upload image
            <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          </Button>
        }

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" color="primary" onClick={() => onSave({
            id: busModel?.id || 0,
            name,
            description,
            image,
          })}>Save</Button>
          <Button variant="contained" color="secondary" onClick={onClose}>Cancel</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default AllBusModels;