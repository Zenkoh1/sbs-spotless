import { Box, Dialog, DialogContent, DialogTitle, Rating, Stack, Typography } from "@mui/material";
import Table from "../../components/Table";
import Survey from "../../types/Survey.type";
import { useEffect, useState } from "react";
import { retrieveAllSurveyResults } from "../../api/survey";
import Bus from "../../types/Bus.type";
import { retrieveAllBuses } from "../../api/buses";
import { format } from "date-fns";

const COLUMNS: { key: any; label: string; sortable?: boolean }[] = [
  { key: "id", label: "ID", sortable: false },
  { key: "bus", label: "Bus", sortable: false },
  { key: "rating", label: "Rating", sortable: true },
  { key: "created_at", label: "Created At", sortable: true }
];

const AllSurveys = () => {
  const [surveyResults, setSurveyResults] = useState<Survey[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [modalState, setModalState] = useState<{ surveyId: number } | null>(null);

  useEffect(() => {
    retrieveAllSurveyResults()
      .then(result => setSurveyResults(result))
      .catch(error => console.error(error));
    retrieveAllBuses()
      .then(result => setBuses(result))
      .catch(error => console.error(error));
  }, [])

  return (
    <Box>
      <Table
        columns={COLUMNS}
        data={surveyResults.map((survey) => {
          return {
            ...survey,
            rating: survey.rating,
            bus: buses.find(b => b.id === survey.bus)?.number_plate
          }
        })}
        onRowClick={(survey) => setModalState({ surveyId: survey.id })}
      />
      <SurveyModal
        survey={surveyResults.find(s => s.id === modalState?.surveyId) || {} as Survey}
        buses={buses}
        onClose={() => setModalState(null)}
        open={modalState !== null}
      />
    </Box>
  )
}

const SurveyModal = ({
  onClose,
  survey,
  buses,
  open
}: {
  onClose: () => void,
  survey: Survey,
  buses: Bus[],
  open: boolean
}) => {
  if (!open) return null;
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Viewing Survey</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>Bus:</strong> {buses.find(b => b.id === survey.bus)?.number_plate}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <strong>Rating:</strong> <Rating value={survey.rating} readOnly />
        </Stack>
        <Typography variant="body1">
          <strong>Comment:</strong> {survey.comment}
        </Typography>
        <Typography variant="body1">
          <strong>Submitted At:</strong> {format(survey.created_at, "yyyy-MM-dd HH:mm")}
        </Typography>
        <Typography variant="h6" mb={2} mt={2}>Attached Images</Typography>
        <Stack direction="column" spacing={1} alignItems="center">
          {survey.images.map((surveyImage, index) => (
            <img key={index} src={surveyImage.image} alt={`Survey ${index}`} style={{ width: "80%" }} />
          ))}
          {survey.images.length === 0 && (
            <Typography variant="body1">No images</Typography>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default AllSurveys;