import { useEffect, useState } from "react";
import Table from "../../components/Table";
import BusModel from "../../types/BusModel.type";
import { retrieveAllBusModels } from "../../api/busManagement";
import { useNavigate } from "react-router-dom";

const AllBusModels = () => {
  const [busModels, setBusModels] = useState<BusModel[]>([]);
  const navigate = useNavigate();

  const COLUMNS: { key: keyof BusModel; label: string; sortable?: boolean }[] = [
    { key: "id", label: "ID", sortable: false },
    { key: "name", label: "Name", sortable: true },
    { key: "description", label: "Description", sortable: false },
    { key: "created_at", label: "Created At", sortable: true },
  ]

  const handleRowClick = (row: BusModel) => {
    navigate(`/busModels/${row.id}`);
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
    <Table
      data={busModels}
      columns={COLUMNS}
      onRowClick={handleRowClick}
    />
  )
}

export default AllBusModels;