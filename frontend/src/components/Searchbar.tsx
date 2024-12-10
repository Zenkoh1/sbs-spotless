import { Box, IconButton, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useState } from "react";

const Searchbar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("");

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <TextField
        label="Search"
        variant="outlined"
        onChange={(event) => setQuery(event.target.value)}
        value={query}
      />
      <IconButton onClick={() => onSearch(query)}>
        <Search />
      </IconButton>
    </Box>
  )
}

export default Searchbar;