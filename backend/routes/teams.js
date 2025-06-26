const express = require('express');
const router = express.Router();

// Import team controller functions
const { createTeam, getTeams, getTeam, deleteTeam, updateTeam } = require('../controllers/teamController');

// GET all teams
router.get('/', getTeams);

// GET a single team by id
router.get('/:id', getTeam);

// CREATE a new team
router.post('/', createTeam);

// DELETE a team by id
router.delete('/:id', deleteTeam);

// UPDATE a team by id (PUT or PATCH)
router.put('/:id', updateTeam);
router.patch('/:id', updateTeam);

module.exports = router;