import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createChecklistItem, deleteChecklist, deleteChecklistItem, editChecklistItemOrder, retrieveChecklistById, retrieveChecklistItems as retrieveChecklistItems } from "../../api/checklists";
import { CircularProgress, Container, Paper, TableContainer, Typography, Table as MUITable, TableHead, TableRow, TableCell, Table, TableBody, Fab, DialogTitle, DialogContent, TextField, Checkbox, Button, Dialog, Stack, IconButton, Box } from "@mui/material";
import ChecklistItem from "../../types/ChecklistItem.type";
import Checklist from "../../types/Checklist.type";
import { Add, ArrowDownward, ArrowUpward, Delete } from "@mui/icons-material";
import { getImagePreview } from "../../util/imageHelper";

const ViewChecklist = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [checklistSteps, setChecklistSteps] = useState<ChecklistItem[]>([]);

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState({ isOpen: false, checklistItem: null });

  useEffect(() => {
    if (!id) return;
    retrieveChecklistById(parseInt(id))
      .then(result => setChecklist(result))
      .catch(error => console.error(error));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    retrieveChecklistItems(parseInt(id))
      .then(result => setChecklistSteps(result))
      .catch(error => console.error(error));
  }, [id]);

  const handleDeleteChecklist = () => {
    if (!id) return;
    deleteChecklist(parseInt(id))
      .then(() => navigate("/checklists"));
  }

  const handleCreateItem = (values: ChecklistItem) => {
    if (!id) return;
    createChecklistItem(parseInt(id), values)
      .then(result => {
        setChecklistSteps([...checklistSteps, result]);
        setCreateModalIsOpen(false);
      })
      .catch(error => console.error(error));
  }

  const handleEdit = (values: ChecklistItem) => {
    if (!id) return;
  }

  const handleIncreaseOrder = (id: number) => {
    if (!id) return;
    editChecklistItemOrder(id, checklistSteps.find(step => step.id === id)?.order || 0 + 1)
      .then(() => {
        setChecklistSteps(checklistSteps.map(step => step.id === id ? { ...step, order: step.order + 1 } : step));
      });
  }

  const handleDecreaseOrder = (id: number) => {
    editChecklistItemOrder(id, checklistSteps.find(step => step.id === id)?.order || 0 - 1)
      .then(() => {
        setChecklistSteps(checklistSteps.map(step => step.id === id ? { ...step, order: step.order - 1 } : step));
      });
  }

  const handleDeleteItem = (id: number) => {
    deleteChecklistItem(id)
      .then(() => {
        setChecklistSteps(checklistSteps.filter(step => step.id !== id));
      });
  }

  if (!checklist) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container>
      <Box>
        <Typography variant="h4">{checklist.title}</Typography>
        <Typography variant="body1">{checklist.description}</Typography>
      </Box>
      <ChecklistTable 
        checklistSteps={checklistSteps} 
        handleIncreaseOrder={handleIncreaseOrder} 
        handleDecreaseOrder={handleDecreaseOrder} 
        handleDeleteItem={handleDeleteItem}
      />
      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 80 }} onClick={() => setCreateModalIsOpen(true)}>
        <Add />
      </Fab>
      <Fab color="primary" aria-label="delete" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleDeleteChecklist}>
        <Delete />
      </Fab>
      <ChecklistItemForm
        initialValues={{ id: 0, order: checklistSteps.length > 0 ? Math.max(...checklistSteps.map(step => step.order)) + 1 : 1, title: "", description: "", is_image_required: false, image: "", cleaning_checklist: parseInt(id || "0") }}
        open={createModalIsOpen}
        onSubmit={handleCreateItem}
        onCancel={() => setCreateModalIsOpen(false)}
        onClose={() => setCreateModalIsOpen(false)}
      /> 
      <ChecklistItemForm
        initialValues={editModalIsOpen.checklistItem || { id: 0, order: 0, title: "", description: "", is_image_required: false, image: "", cleaning_checklist: parseInt(id || "0") }}
        open={editModalIsOpen.isOpen}
        onSubmit={handleEdit}
        onCancel={() => setEditModalIsOpen({ isOpen: false, checklistItem: null })}
        onClose={() => setEditModalIsOpen({ isOpen: false, checklistItem: null })}
      />

    </Container>
  )
}

const ChecklistTable = ({ checklistSteps, handleIncreaseOrder, handleDecreaseOrder, handleDeleteItem } : { checklistSteps: ChecklistItem[], handleIncreaseOrder: (id: number) => void, handleDecreaseOrder: (id: number) => void, handleDeleteItem: (id: number) => void }) => {
  return (
    <TableContainer component={Paper} sx={{mt: 4}}>
      <MUITable>
        <TableHead>
          <TableRow>
            <TableCell sx={{width:"5%"}}>Order</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Image required?</TableCell>
            <TableCell sx={{width:"20%"}}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {checklistSteps.sort((a, b) => a.order - b.order).map((step, index) => (
            <TableRow key={index}>
              <TableCell sx={{width:"5%"}}>{step.order}</TableCell>
              <TableCell>{step.title}</TableCell>
              <TableCell>
                <Typography variant="body2">{step.description}</Typography>
                <img src={getImagePreview(step.image)} alt={step.title} style={{ width: 100, height: 100 }} />
              </TableCell>
              <TableCell>
                <Checkbox checked={step.is_image_required} />
              </TableCell>
              <TableCell sx={{width:"20%"}}>
                <IconButton onClick={() => handleDecreaseOrder(step.id)}>
                  <ArrowUpward />
                </IconButton>
                <IconButton onClick={() => handleIncreaseOrder(step.id)}>
                  <ArrowDownward />
                </IconButton>
                <IconButton onClick={() => handleDeleteItem(step.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </MUITable>
    </TableContainer>
  )
}

const ChecklistItemForm = ({
  initialValues,
  onSubmit,
  onCancel,
  onClose,
  open,
}: {
  initialValues: ChecklistItem;
  onSubmit: (values: ChecklistItem) => void;
  onCancel: () => void;
  onClose: () => void;
  open: boolean
}) => {
  const [formState, setFormState] = useState<ChecklistItem>(initialValues);

  useEffect(() => {
    setFormState(initialValues);
  }, [initialValues]);

  const handleChange = (field: keyof ChecklistItem) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [field]: event.target.value });
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Create Checklist Item</DialogTitle>
      <DialogContent>
        {formState.image && <img src={getImagePreview(formState.image)} alt="checklist item" style={{ width: "100%" }} />}
        {!formState.image && (
          <Button variant="contained" component="label">
            Upload Image
            <input 
              type="file" 
              hidden 
              accept="image/*"
              onChange={(event) => setFormState({ ...formState, image: event.target.files?.[0] || null })}
            />
          </Button>
        )}
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
        <Typography>
          Is image required?
        </Typography>
        <Checkbox
          checked={formState.is_image_required}
          onChange={(event) => setFormState({ ...formState, is_image_required: event.target.checked })}
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
      </DialogContent>
    </Dialog>
  )
}

export default ViewChecklist;