import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, MenuItem, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Stack, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Select, InputLabel, FormControl, Snackbar, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Helper to format date for input[type="date"]
function toInputDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const Project = () => {
  // State
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");
  
  // Add/Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editPid, setEditPid] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editDue, setEditDue] = useState("");

  // Delete dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Search/sort
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Fetch projects
 useEffect(() => {
const fetchProjects = async () => {
  setLoading(true);
  try {
    // Get the current user from localStorage
    const currentUserData = localStorage.getItem('currentUser');
    if (!currentUserData) throw new Error("User not authenticated");
    
    // Parse the user object and extract ID
    const currentUser = JSON.parse(currentUserData);
    const userId = currentUser?.id;
    if (!userId) throw new Error("User ID not found");

    // Store current user ID for use in creating projects
    setCurrentUserId(userId);

    // Pass user ID as query parameter
    const response = await fetch(`http://localhost:4000/api/projects?id=${userId}`);
    
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

  // Add Project
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

  // Edit Project
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

  // Save (Add/Edit)
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
        // Update
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
              dueDate: editDue
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
        // Create
        const response = await fetch("http://localhost:4000/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pid: editPid,
            id: currentUserId,
            title: editTitle,
            description: editDescription,
            startDate: editStart,
            dueDate: editDue
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

  // Delete
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

  // Filter and sort
  let filteredRows = rows.filter((row) =>
    row.title.toLowerCase().includes(search.toLowerCase())
  );
  filteredRows = [...filteredRows].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "startDate") return a.startDate.localeCompare(b.startDate);
    if (sortBy === "dueDate") return a.dueDate.localeCompare(b.dueDate);
    return 0;
  });

  // Form validation
  const isFormValid =
    editPid.trim() &&
    editTitle.trim() &&
    editDescription.trim() &&
    editStart.trim() &&
    editDue.trim()

  // Date display for table
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  }

  // Snackbar close
  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  // Loading indicator
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Typography variant="h6">Loading projects...</Typography>
      </Box>
    );
  }
  if (error) {
    // Show error as snackbar
    return (
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            fontWeight: 700,
            fontSize: "3rem",
            p: 2,
            pb: 0.5,
            borderRadius: "8px",
            m: 0,
            display: "inline-block",
            backgroundColor: "#fff",
          }}
        >
          <b>Project Management</b>
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#6b7280", pl: 2 }}>
          Total Projects: {rows.length}
        </Typography>
      </Box>

      {/* Success Snackbar */}
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mt: 2 ,paddingTop: 6}}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label="Filter Projects..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              bgcolor: "#fff",
              borderRadius: "8px",
              "& .MuiInputLabel-root": { color: "grey" },
            }}
          />
          <FormControl size="small" sx={{ bgcolor: "#fff", borderRadius: "8px" }} variant="outlined">
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
              <MenuItem value="" disabled>Sort By</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="startDate">Start Date</MenuItem>
              <MenuItem value="dueDate">Due Date</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
            + Add Project
          </Button>
      </Box>
      

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: "#e0e7ef" }}>
            <TableRow sx={{ background: "#f9f9f9", textShadow: "0 0 0.5px #000" }}>
              <TableCell>PID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">Due Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow
                key={row._id}
                sx={{
                  "&:hover": { backgroundColor: "#f5f7fa" },
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>{row.pid}</TableCell>
                <TableCell component="th" scope="row">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="right">{formatDate(row.startDate)}</TableCell>
                <TableCell align="right">{formatDate(row.dueDate)}</TableCell>
                <TableCell align="right">
                  <Stack spacing={2} direction="row" justifyContent="center">
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <b>{selectedRow?.title}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Project Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {isEditMode ? "Edit Project" : "Add New Project"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="PID"
            fullWidth
            value={editPid}
            onChange={(e) => setEditPid(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            value={editStart}
            onChange={(e) => setEditStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Due Date"
            type="date"
            value={editDue}
            onChange={(e) => setEditDue(e.target.value)}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
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