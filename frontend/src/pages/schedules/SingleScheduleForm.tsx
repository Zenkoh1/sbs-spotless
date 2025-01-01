import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ScheduleSingle } from "../../api/schedules";
import Bus from "../../types/Bus.type";
import { TimePicker } from "@mui/x-date-pickers";
import Checklist from "../../types/Checklist.type";
import User from "../../types/User.type";

const SingleScheduleForm = ({
  datetime,
  bus,
  onCancel,
  onClose,
  onSubmit,
  open,
  cleaners,
  cleaningChecklists
}: {
  datetime: Date,
  bus: Bus,
  onCancel: () => void,
  onClose: () => void
  onSubmit: (values: ScheduleSingle) => void,
  open: boolean,
  cleaners: User[],
  cleaningChecklists: Checklist[]
}) => {
  const [formState, setFormState] = useState<ScheduleSingle>({ datetime, bus: bus.id, cleaners: [], cleaning_checklist: 0 });

  useEffect(() => {
    setFormState({ datetime, bus: bus.id, cleaners: [], cleaning_checklist: 0 });
  }, [bus, datetime]);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Schedule for {bus.number_plate} on {format(new Date(datetime), "yyyy-MM-dd")}</DialogTitle>
      <DialogContent>
        <TimePicker
          label="Time of Day"
          value={formState.datetime}
          onChange={(time) => {
            var d = new Date(formState.datetime);
            d.setHours((time || new Date()).getHours());
            d.setMinutes((time || new Date()).getMinutes());
            setFormState({ ...formState, datetime: d });
          }}
          sx={{ width: "100%", mt: "8px" }}
        />

        <Autocomplete
          multiple
          options={cleaners}
          getOptionLabel={(option) => option.name}
          value={cleaners.filter(cleaner => formState.cleaners.includes(cleaner.id))}
          onChange={(_, value) => setFormState({ ...formState, cleaners: value.map(cleaner => cleaner.id) })}
          renderInput={(params) => <TextField {...params} label="Cleaners" />}
          sx={{ mt: "8px" }}
        />

        <Autocomplete
          options={cleaningChecklists}
          getOptionLabel={(option) => option.title}
          value={cleaningChecklists.find(checklist => checklist.id === formState.cleaning_checklist) || null}
          onChange={(_, value) => setFormState({ ...formState, cleaning_checklist: value ? value.id : 0 })}
          renderInput={(params) => <TextField {...params} label="Cleaning Checklist" />}
          sx={{ mt: "8px" }}
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

export default SingleScheduleForm;