import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, TextField, MenuItem, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Stack, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Select, InputLabel, FormControl, Snackbar, Alert, Grid,LinearProgress
} from "@mui/material";
import Chip from "@mui/material/Chip";
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

  // Add/Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editDue, setEditDue] = useState("");
  const [editTasks, setEditTasks] = useState("");

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
        const response = await fetch("http://localhost:4000/api/projects");
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
    setEditId("");
    setEditTitle("");
    setEditStatus("");
    setEditStart("");
    setEditDue("");
    setEditTasks("");
    setDialogOpen(true);
  };

  // Edit Project
  const handleEditClick = (row) => {
    setIsEditMode(true);
    setEditRow(row);
    setEditId(row.id || "");
    setEditTitle(row.title || "");
    setEditStatus(row.status || "");
    setEditStart(toInputDate(row.startDate));
    setEditDue(toInputDate(row.dueDate));
    setEditTasks(row.tasks || "");
    setDialogOpen(true);
  };

  // Save (Add/Edit)
  const handleDialogSave = async () => {
  if (
    !editId.trim() ||
    !editTitle.trim() ||
    !editStatus.trim() ||
    !editStart.trim() ||
    !editDue.trim() ||
    !editTasks.trim()
  ) {
    setError("All fields are required.");
    return;
  }
  if (!isEditMode && rows.some((row) => row.id === editId)) {
    setError("ID must be unique!");
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
            id: editId,
            pid: editRow.pid, // keep the same pid on edit
            title: editTitle,
            status: editStatus,
            startDate: editStart,
            dueDate: editDue,
            tasks: editTasks,
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
      // Generate new pid
      const maxPid = rows.length > 0 ? Math.max(...rows.map(row => row.pid || 0)) : 0;
      const newPid = maxPid + 1;

      // Create
      const response = await fetch("http://localhost:4000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          pid: newPid,
          title: editTitle,
          status: editStatus,
          startDate: editStart,
          dueDate: editDue,
          tasks: editTasks,
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
    editId.trim() &&
    editTitle.trim() &&
    editStatus.trim() &&
    editStart.trim() &&
    editDue.trim() &&
    editTasks.trim();

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
      <Typography
        sx={{
          background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          fontWeight: 700,
          fontSize: "3rem",
          p: 2,
          borderRadius: "8px",
          m: 0,
          display: "inline-block",
          backgroundColor: "#fff",
        }}
      >
        <b>Project Management</b>
      </Typography>

      {/* Success Snackbar */}
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Grid container gap={4} justifyContent="center" alignItems="center" sx={{ mb: 3, pt: 10, pb: 10 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#fff", boxShadow: "0 2px 8px rgba(30, 58, 138, 0.08)", borderRadius: "16px", minHeight: 180, minWidth: 180, p: 2 }}>
            <CardContent>
              <Typography pb={3.8} variant="h6">Total Projects</Typography>
              <Typography variant="h4"><b>{rows.length}</b></Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#fff", boxShadow: "0 2px 8px rgba(30, 58, 138, 0.08)", borderRadius: "16px", minHeight: 180, minWidth: 180, p: 2 }}>
            <CardContent>
              <Typography pb={3.8} variant="h6">In Progress</Typography>
              <Typography variant="h4">
                <b>{rows.filter((row) => row.status === "In Progress").length}</b>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#fff", boxShadow: "0 2px 8px rgba(30, 58, 138, 0.08)", borderRadius: "16px", minHeight: 180, minWidth: 180, p: 2 }}>
            <CardContent>
              <Typography pb={3.8} variant="h6">Done</Typography>
              <Typography variant="h4">
                <b>{rows.filter((row) => row.status === "Done").length}</b>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#fff", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)", borderRadius: "16px", minHeight: 180, minWidth: 180, p: 2 }}>
            <CardContent>
              <Typography pb={3.8} variant="h6">Projects To Do</Typography>
              <Typography variant="h4">
                <b>{rows.filter((row) => row.status === "To Do").length}</b>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mt: 2 }}>
        <h2 style={{ margin: 0, marginLeft: 5, fontSize: "2rem" }}>All Projects</h2>
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
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: "#e0e7ef" }}>
            <TableRow sx={{ background: "#f9f9f9", textShadow: "0 0 0.5px #000" }}>
              <TableCell>Title</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">Due Date</TableCell>
              <TableCell align="center">Progress</TableCell>
              <TableCell align="right">Tasks</TableCell>
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
                <TableCell component="th" scope="row">{row.title}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.status}
                    color={
                      row.status === "Done"
                        ? "success"
                        : row.status === "To Do"
                        ? "error"
                        : "primary"
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      bgcolor:
                        row.status === "Done"
                          ? "#22c55e22"
                          : row.status === "To Do"
                          ? "#ef444422"
                          : "#3b82f622",
                      color:
                        row.status === "Done"
                          ? "#16a34a"
                          : row.status === "To Do"
                          ? "#b91c1c"
                          : "#1d4ed8",
                      border: "none",
                    }}
                  />
                </TableCell>
                <TableCell align="right">{formatDate(row.startDate)}</TableCell>
                <TableCell align="right">{formatDate(row.dueDate)}</TableCell>
<TableCell align="right">
  {(() => {
    const [completed, total] = row.tasks.split("/").map(Number);
    const percent = total ? Math.round((completed / total) * 100) : 0;
    return (
      <Box sx={{ minWidth: 80 }}>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{
            height: 8,
            borderRadius: 5,
            backgroundColor: "#e0e7ef",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#6366f1"
            }
          }}
        />
        <Typography variant="body2" align="center" sx={{ mt: 0.5 }}>
          {percent}%
        </Typography>
      </Box>
    );
  })()}
</TableCell>
                <TableCell align="right">{row.tasks}</TableCell>
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
            label="ID"
            fullWidth
            value={editId}
            onChange={(e) => setEditId(e.target.value)}
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
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={editStatus}
              label="Status"
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
              <MenuItem value="To Do">To Do</MenuItem>
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
          <TextField
            margin="dense"
            label="Tasks"
            fullWidth
            value={editTasks}
            onChange={(e) => setEditTasks(e.target.value)}
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