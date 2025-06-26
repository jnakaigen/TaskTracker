import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// Function to create data for the table
function createData(
  pid,        // project id
  id,         // user login id (admin)
  title,
  description,
  start,
  due,
  tasks
) {
  return { pid, id, title, description, start, due, tasks };
}

const Project = () => {
  const [rows, setRows] = useState([
    createData("p1", "u1", "Website Revamp", "At Risk", "2025-06-01", "2025-07-15", "7/20"),
    createData("p2", "u1", "Mobile App", "In progress", "2025-06-10", "2025-08-01", "14/20"),
    createData("p3", "u2", "Marketing Campaign", "Completed", "2025-06-05", "2025-06-30", "20/20"),
    createData("p4", "u2", "Product Launch", "Completed", "2025-07-01", "2025-09-01", "20/20"),
    createData("p5", "u3", "Project 5", "In progress", "2025-06-01", "2025-07-15", "15/20"),
    createData("p6", "u3", "Project 6", "At Risk", "2025-06-15", "2025-08-11", "15/20")
  ]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editDue, setEditDue] = useState("");
  const [editTasks, setEditTasks] = useState("");

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

  const handleDialogSave = () => {
    if (isEditMode) {
      setRows((prev) =>
        prev.map((r) =>
          r.pid === editRow.pid
            ? { ...r, title: editTitle, description: editDescription, start: editStart, due: editDue, tasks: editTasks }
            : r
        )
      );
    } else {
      const newPidNum = rows.length > 0 ? Math.max(...rows.map((r) => parseInt(r.pid.slice(1)))) + 1 : 1;
      const newPid = `p${newPidNum}`;
      const currentUserId = 'u1'; // pull from auth context
      setRows((prev) => [
        ...prev,
        { pid: newPid, id: currentUserId, title: editTitle, description: editDescription, start: editStart, due: editDue, tasks: editTasks }
      ]);
    }
    setDialogOpen(false);
  };

  // Delete state
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };
  const handleConfirmDelete = () => {
    setRows((prev) => prev.filter((r) => r.pid !== selectedRow.pid));
    setOpenDelete(false);
  };
  const handleCancel = () => setOpenDelete(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  let filteredRows = rows.filter((row) => row.title.toLowerCase().includes(search.toLowerCase()));
  filteredRows = [...filteredRows].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "start") return a.start.localeCompare(b.start);
    if (sortBy === "due") return a.due.localeCompare(b.due);
    return 0;
  });

  return (
    <Box sx={{ p: 3, background: '#fff', minHeight: '100vh' }}>
      <Typography variant="h3" gutterBottom>
        Project Management
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" onClick={handleAddClick}>Add Project</Button>
        <TextField label="Filter..." value={search} onChange={(e) => setSearch(e.target.value)} size="small" />
        <FormControl size="small">
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="start">Start</MenuItem>
            <MenuItem value="due">Due</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>Due</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Tasks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.pid}>
                <TableCell>{row.pid}</TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>
                  <Chip label={row.description} />
                </TableCell>
                <TableCell>{row.start}</TableCell>
                <TableCell>{row.due}</TableCell>
                <TableCell>{(() => { const [c,t] = row.tasks.split('/').map(Number); return t? Math.round((c/t)*100)+ '%' : '0%'; })()}</TableCell>
                <TableCell>{row.tasks}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button startIcon={<EditIcon />} onClick={() => handleEditClick(row)}>Edit</Button>
                    <Button color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(row)}>Delete</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDelete} onClose={handleCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <b>{selectedRow?.title}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{isEditMode ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Title" fullWidth value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select value={editDescription} onChange={(e) => setEditDescription(e.target.value)}>
              <MenuItem value="In progress">In progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="At Risk">At Risk</MenuItem>
            </Select>
          </FormControl>
          <TextField margin="dense" label="Start Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={editStart} onChange={(e) => setEditStart(e.target.value)} />
          <TextField margin="dense" label="Due Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={editDue} onChange={(e) => setEditDue(e.target.value)} />
          <TextField margin="dense" label="Tasks" fullWidth value={editTasks} onChange={(e) => setEditTasks(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDialogSave} variant="contained" disabled={!editTitle||!editDescription||!editStart||!editDue||!editTasks}>
            {isEditMode ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Project;
