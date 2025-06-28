const Team = require('../models/teamModel');
const Task = require('../models/taskModel');


// GET all teams
const getTeams = async (req, res) => {
    try {
const { adminId } = req.query;
  const filter = adminId ? { adminId } : {};
  const teams = await Team.find(filter);        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET a single team
const getTeam = async (req, res) => {
    const { id } = req.params;
    try {
        const team = await Team.findOne({ id: id }, { id: 1, name: 1, email: 1, role: 1, _id: 0 });
        if (!team) return res.status(404).json({ message: 'Team not found' });
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new team
const createTeam = async (req, res) => {
    const { id, name, email, role, adminId } = req.body;
    try {
        const team = await Team.create({ id, name, email, role, adminId });
        res.status(200).json(team);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a team
const deleteTeam = async (req, res) => {
    const { id } = req.params;
    try {
        const team = await Team.findOneAndDelete({ id: id });
        if (!team) return res.status(404).json({ message: 'Team not found' });
               // Delete all tasks assigned to this member
        await Task.deleteMany({ assignedTo: id });
        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a team
const updateTeam = async (req, res) => {
    const { id } = req.params;
    try {
        const team = await Team.findOneAndUpdate(
            { id: id },
            { ...req.body },
            { new: true }
        );
        if (!team) return res.status(404).json({ message: 'Team not found' });
        res.status(200).json(team);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getTeams,
    getTeam,
    createTeam,
    deleteTeam,
    updateTeam
};