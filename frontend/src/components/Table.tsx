import { Search, Sort } from "@mui/icons-material";
import { Container, Box, TextField, TableContainer, Paper, TableBody, TableCell, TableHead, TableRow, Table as MUITable, Icon, InputAdornment, Stack, IconButton, Typography } from "@mui/material";
import { useState, useMemo } from "react";

interface TableProps<T> {
  data: T[];
  columns: { key: keyof T; label: string; sortable?: boolean }[];
  onRowClick?: (row: T) => void;
}

const Table = <T extends object> ({ data, columns, onRowClick }: TableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T, 
    direction: "ascending" | "descending"
  } | null>(null);

  const filteredData = data.filter((row) => 
    columns.some((column) => String(row[column.key]).toLowerCase().includes(searchQuery.toLowerCase())));

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    const { key, direction } = sortConfig;
    return [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
  })}, [filteredData, sortConfig]);

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === "ascending" ? "descending" : "ascending" };
      }
      return { key, direction: "ascending" };
    })
  };

  if (data.length === 0) {
    return (
      <Container>
        <Typography variant="h6">No data available</Typography>
      </Container>
    )
  }

  return (
    <Container>
      <Box mb={2}>
        <TextField
        fullWidth
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          slotProps={{
            input: {
              startAdornment: 
                <InputAdornment position="start">
                  <Icon>
                    <Search />
                  </Icon>
                </InputAdornment>
            }
          }}
        />
      </Box>
      <TableContainer component={Paper}>
        <MUITable>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  <Stack direction="row" gap={4}>
                    {column.label}
                    {column.sortable && 
                      <Icon onClick={() => column.sortable && handleSort(column.key)}>
                        <Sort />
                      </Icon>
                    }
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow key={index} onClick={() => onRowClick && onRowClick(row)}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {
                      row[column.key] instanceof Date ?
                        new Date(row[column.key] as Date).toLocaleDateString() :
                        String(row[column.key])
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </MUITable>
      </TableContainer>
    </Container>
  )
}

export default Table;