import { Button, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ScheduleSingle } from "../../api/schedules";
import Bus from "../../types/Bus.type";

const SingleScheduleForm = ({
  datetime,
  bus,
  onCancel,
  onClose,
  onSubmit,
  open
}: {
  datetime: Date,
  bus: Bus,
  onCancel: () => void,
  onClose: () => void
  onSubmit: (values: ScheduleSingle) => void,
  open: boolean
}) => {
  const [formState, setFormState] = useState<ScheduleSingle>({ datetime, bus: bus.id, cleaners: [], cleaning_checklist: 0 });

  useEffect(() => {
    setFormState({ datetime, bus: bus.id, cleaners: [], cleaning_checklist: 0 });
  }, [bus, datetime]);

  const handleChange = (field: keyof ScheduleSingle) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setFormState({ ...formState, [field]: event.target.value });

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Schedule for {bus.number_plate} on {format(new Date(datetime), "yyyy-MM-dd")}</DialogTitle>
      <DialogContent>
        Time picker here.
        Dropdown to choose cleaners here
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

export default SingleScheduleForm;