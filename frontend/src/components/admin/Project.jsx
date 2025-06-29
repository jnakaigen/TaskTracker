import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Format date for input fields
function toInputDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const Project = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editPid, setEditPid] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editDue, setEditDue] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const currentUserData = localStorage.getItem("currentUser");
        if (!currentUserData) throw new Error("User not authenticated");
        const currentUser = JSON.parse(currentUserData);
        const userId = currentUser?.id;
        if (!userId) throw new Error("User ID not found");
        setCurrentUserId(userId);
        const response = await fetch(
          `http://localhost:4000/api/projects?id=${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setRows(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditRow(null);
    setEditPid("");
    setEditTitle("");
    setEditDescription("");
    setEditStart("");
    setEditDue("");
    setDialogOpen(true);
  };

  const handleEditClick = (row) => {
    setIsEditMode(true);
    setEditRow(row);
    setEditPid(row.pid || "");
    setEditTitle(row.title || "");
    setEditDescription(row.description || "");
    setEditStart(toInputDate(row.startDate));
    setEditDue(toInputDate(row.dueDate));
    setDialogOpen(true);
  };

  const handleDialogSave = async () => {
    if (
      !editPid.trim() ||
      !editTitle.trim() ||
      !editDescription.trim() ||
      !editStart.trim() ||
      !editDue.trim()
    ) {
      setError("All fields are required.");
      return;
    }
    if (!isEditMode && rows.some((row) => row.pid === editPid)) {
      setError("PID must be unique!");
      return;
    }
    setLoading(true);
    try {
      if (isEditMode) {
        const response = await fetch(
          `http://localhost:4000/api/projects/${editRow._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pid: editPid,
              id: currentUserId,
              title: editTitle,
              description: editDescription,
              startDate: editStart,
              dueDate: editDue,
            }),
          }
        );
        if (!response.ok) throw new Error("Failed to update project");
        const updated = await response.json();
        setRows((prev) =>
          prev.map((row) => (row._id === updated._id ? updated : row))
        );
        setSuccess("Project updated successfully");
      } else {
        const response = await fetch("http://localhost:4000/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pid: editPid,
            id: currentUserId,
            title: editTitle,
            description: editDescription,
            startDate: editStart,
            dueDate: editDue,
          }),
        });
        if (!response.ok) throw new Error("Failed to create project");
        const created = await response.json();
        setRows((prev) => [...prev, created]);
        setSuccess("Project created successfully");
      }
      setDialogOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/projects/${selectedRow._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete project");
      setRows((prevRows) =>
        prevRows.filter((row) => row._id !== selectedRow._id)
      );
      setSuccess("Project deleted");
      setOpenDialog(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => setOpenDialog(false);

  let filteredRows = rows.filter((row) =>
    row.title.toLowerCase().includes(search.toLowerCase())
  );
  filteredRows = [...filteredRows].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "startDate") return a.startDate.localeCompare(b.startDate);
    if (sortBy === "dueDate") return a.dueDate.localeCompare(b.dueDate);
    return 0;
  });

  const isFormValid =
    editPid && editTitle && editDescription && editStart && editDue;

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB");
  }

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading projects...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        minHeight: "100vh",
        px: 2,
        py: 2,
        maxWidth: "1000px",
        mx: "auto",
        fontSize: "0.9rem",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, 
      fontSize: "2.28rem",
        background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
        WebkitTextFillColor: "transparent",WebkitBackgroundClip: "text",
         }}>
        <b>Project Management</b>
      </Typography>
      <Typography variant="subtitle2" sx={{ color: "#666", mb: 2 }}>
        Total Projects: {rows.length}
      </Typography>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {success}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          onClick={handleAddClick}
          sx={{ borderRadius: "8px",fontSize: "0.85rem", 
            px: 2, py: 0.75,background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
            "&:hover": { backgroundColor: "#1e3a8a"}
          }}
        >
          + Add Project
        </Button>
        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl size="small">
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
            <MenuItem disabled value="">
              Sort By
            </MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="startDate">Start Date</MenuItem>
            <MenuItem value="dueDate">Due Date</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small" sx={{ fontSize: "0.85rem" }}>
          <TableHead sx={{ backgroundColor: "#f9fbff" }}>
            <TableRow>
              {[
                "PID",
                "Title",
                "Description",
                "Start Date",
                "Due Date",
                "Actions",
              ].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row._id}
              sx={{
                  "&:hover": { backgroundColor: "#f5f7fa" },
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>{row.pid}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{formatDate(row.startDate)}</TableCell>
                <TableCell>{formatDate(row.dueDate)}</TableCell>
                <TableCell>
                  <Stack spacing={1} direction="row">
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<EditIcon />}
                      color="primary"

                      onClick={() => handleEditClick(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
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

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEditMode ? "Edit Project" : "Add Project"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="PID"
            size="small"
            margin="dense"
            value={editPid}
            onChange={(e) => setEditPid(e.target.value)}
          />
          <TextField
            fullWidth
            label="Title"
            size="small"
            margin="dense"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label="Description"
            size="small"
            margin="dense"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            size="small"
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={editStart}
            onChange={(e) => setEditStart(e.target.value)}
          />
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            size="small"
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={editDue}
            onChange={(e) => setEditDue(e.target.value)}
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
