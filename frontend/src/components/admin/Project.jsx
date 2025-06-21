import React from "react";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

// Function to create data for the table
function createData(
  id,
  title,
  description,
  start,
  due,
  progress,
  tasks,
  actions
) {
  return { id, title, description, start, due, progress, tasks, actions };
}

const Project = () => {
  const [rows, setRows] = useState([
    createData(
      1,
      "Webste Revamp",
      "At Risk",
      "2025-06-01",
      "2025-07-15",
      "null",
      "7/20",
      "..."
    ),
    createData(
      2,
      "Mobile App",
      "In progress",
      "2025-06-10",
      "2025-08-01",
      "null",
      "14/20",
      "..."
    ),
    createData(
      3,
      "Marketing campaign",
      "Completed",
      "2025-06-05",
      "2025-06-30",
      "null",
      "20/20",
      "..."
    ),
    createData(
      4,
      "Product Launch",
      "Completed",
      "2025-07-01",
      "2025-09-01",
      "null",
      "20/20",
      "..."
    ),
    createData(
      5,
      "Project 5",
      "In progress",
      "2025-06-01",
      "2025-07-15",
      "null",
      "15/20",
      "..."
    ),
    createData(
      6,
      "Project 6",
      "At Risk",
      "2025-06-15",
      "2025-08-11",
      "null",
      "15/20",
      "..."
    ),
  ]);
  //to add&edit
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const handleAddClick = () => {
    setIsEditMode(false);
    setEditRow(null);
    setEditTitle("");
    setEditDescription("");
    setEditStart("");
    setEditDue("");
    setEditTasks("");
    setDialogOpen(true);
  };

  //Handle Edit
  const [editRow, setEditRow] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editDue, setEditDue] = useState("");
  const [editTasks, setEditTasks] = useState("");

  const handleEditClick = (row) => {
    setIsEditMode(true);
    setEditRow(row);
    setEditTitle(row.title);
    setEditDescription(row.description);
    setEditStart(row.start);
    setEditDue(row.due);
    setEditTasks(row.tasks);
    setDialogOpen(true);
  };
  //Save Handler
  const handleDialogSave = () => {
    if (isEditMode) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editRow.id
            ? {
                ...row,
                title: editTitle,
                description: editDescription,
                start: editStart,
                due: editDue,
                tasks: editTasks,
              }
            : row
        )
      );
    } else {
      const newId =
        rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
      setRows([
        ...rows,
        {
          id: newId,
          title: editTitle,
          description: editDescription,
          start: editStart,
          due: editDue,
          progress: "null",
          tasks: editTasks,
          actions: "...",
        },
      ]);
    }
    setDialogOpen(false);
  };

  //Handle Delete
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== selectedRow.id));
    setOpenDialog(false);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  let filteredRows = rows.filter((row) =>
    row.title.toLowerCase().includes(search.toLowerCase())
  );
  //Check if form is valid
  const isFormValid =
    editTitle.trim() !== "" &&
    editDescription.trim() !== "" &&
    editStart.trim() !== "" &&
    editDue.trim() !== "" &&
    editTasks.trim() !== "";

  // Sort the filtered rows based on the selected sort option
  filteredRows = [...filteredRows].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "start") {
      return a.start.localeCompare(b.start);
    }
    if (sortBy === "due") {
      return a.due.localeCompare(b.due);
    }
    return 0;
  });

  return (
    <Box
      style={{
        background: "#ffffff",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <Typography
        style={{
          background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          fontWeight: 700,
          fontSize: "3rem",
          padding: "16px",
          borderRadius: "8px",
          margin: 0,
          display: "inline-block",
          backgroundColor: "#fff",
        }}
      >
        <b>Project Management</b>
      </Typography>

      <Grid
        paddingTop={10}
        paddingBottom={10}
        container
        spacing={10}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(30, 58, 138, 0.08)",
              borderRadius: "16px",
              minHeight: 180,
              minWidth: 180,
              p: 2,
            }}
          >
            <CardContent>
              <Typography paddingBottom={3.8} variant="h6">
                Total Projects
              </Typography>
              <Typography variant="h4">
                <b>{rows.length}</b>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(30, 58, 138, 0.08)",
              borderRadius: "16px",
              minHeight: 180,
              minWidth: 180,
              p: 2,
            }}
          >
            <CardContent>
              <Typography paddingBottom={3.8} variant="h6">
                In Progress
              </Typography>
              <Typography variant="h4">
                <b>
                  {
                    rows.filter((row) => row.description === "In progress")
                      .length
                  }
                </b>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(30, 58, 138, 0.08)",
              borderRadius: "16px",
              minHeight: 180,
              minWidth: 180,
              p: 2,
            }}
          >
            <CardContent>
              <Typography paddingBottom={3.8} variant="h6">
                Completed
              </Typography>
              <Typography variant="h4">
                <b>
                  {rows.filter((row) => row.description === "Completed").length}
                </b>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              borderRadius: "16px",
              minHeight: 180,
              minWidth: 180,
              p: 2,
            }}
          >
            <CardContent>
              <Typography paddingBottom={3.8} variant="h6">
                Projects At Risk
              </Typography>
              <Typography variant="h4">
                <b>
                  {rows.filter((row) => row.description === "At Risk").length}
                </b>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          mt: 2,
        }}
      >
        <h2 style={{ margin:0, marginLeft: 5,fontSize: "2rem" }}>All Projects</h2>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
              color: "#fff",
              fontWeight: 600,
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": { background: "#2563eb" },
            }}
            onClick={handleAddClick}
          >
           Add Project 
          </Button>
          <TextField
            label="Filter Projects..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              "& .MuiInputLabel-root": { color: "grey" },
            }}
          />
          <FormControl
            size="small"
            sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
            variant="outlined"
          >
            <Select
              value={sortBy}
              displayEmpty
              onChange={(e) => setSortBy(e.target.value)}
              renderValue={
                sortBy !== ""
                  ? undefined
                  : () => <span style={{ color: "#aaa" }}>Sort By</span>
              }
            >
              <MenuItem value="" disabled>
                Sort By
              </MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="start">Start Date</MenuItem>
              <MenuItem value="due">Due Date</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: "#e0e7ef" }}>
            <TableRow
              sx={{ background: "#f9f9f9", textShadow: "0 0 0.5px #000" }}
            >
              <TableCell>Title</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right"> Start Date</TableCell>
              <TableCell align="right">Due Date</TableCell>
              <TableCell align="right">Progress</TableCell>
              <TableCell align="right">Tasks</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:hover": { backgroundColor: "#f5f7fa" },
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.description}
                    color={
                      row.description === "Completed"
                        ? "success"
                        : row.description === "At Risk"
                        ? "error"
                        : "primary"
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      bgcolor:
                        row.description === "Completed"
                          ? "#22c55e22"
                          : row.description === "At Risk"
                          ? "#ef444422"
                          : "#3b82f622",
                      color:
                        row.description === "Completed"
                          ? "#16a34a"
                          : row.description === "At Risk"
                          ? "#b91c1c"
                          : "#1d4ed8",
                      border: "none",
                    }}
                  />
                </TableCell>
                <TableCell align="right">{row.start}</TableCell>
                <TableCell align="right">{row.due}</TableCell>
                <TableCell align="right">
                  {(() => {
                    const [completed, total] = row.tasks.split("/").map(Number);
                    if (!total) return "0%";
                    const percent = Math.round((completed / total) * 100);
                    return `${percent}%`;
                  })()}
                </TableCell>
                <TableCell align="right">{row.tasks}</TableCell>
                <TableCell align="right">
                  <Stack spacing={5} direction="row" justifyContent="center">
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<EditIcon />}
                      sx={{
                        backgroundColor: "#38BDF8",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#1e90c2" },
                      }}
                      onClick={() => handleEditClick(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(row)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Dialog for confirmation of deletion */}
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <b>{selectedRow?.title}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for editing a project */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {isEditMode ? "Edit Project" : "Add New Project"}
        </DialogTitle>
        <DialogContent>
          <TextField
            borderRadius={8}
            margin="dense"
            label="Title"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={editDescription}
              label="Status"
              onChange={(e) => setEditDescription(e.target.value)}
            >
              <MenuItem value="In progress">In progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="At Risk">At Risk</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            value={editStart}
            onChange={(e) => setEditStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Due Date"
            type="date"
            value={editDue}
            onChange={(e) => setEditDue(e.target.value)}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Tasks"
            fullWidth
            value={editTasks}
            onChange={(e) => setEditTasks(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDialogSave}
            variant="contained"
            disabled={!isFormValid}
          >
            {isEditMode ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Project;
