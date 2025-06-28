const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,    // returns [{ id, name }] grouped by role
  getUser,     // returns a single user document with id virtualized
  deleteUser,
  updateUser,
  loginUser,
  deleteAllUsers,   // expects { role, id } and responds { user: { id, role, name }, redirectUrl }
} = require('../controllers/userController');

// GET  /api/users           →  getUsers()
router.get('/', getUsers);

// GET  /api/users/:id       →  getUser()
router.get('/:id', getUser);

// POST /api/users           →  createUser({ role, name })
router.post('/', createUser);

// POST /api/users/login     →  loginUser({ role, id })
router.post('/login', loginUser);

// DELETE /api/users/:id     →  deleteUser()
router.delete('/:id', deleteUser);

// DELETE /api/users         →  deleteAllUsers()
router.delete('/', deleteAllUsers);

// PUT/PATCH /api/users/:id  →  updateUser()
router.put('/:id', updateUser);
router.patch('/:id', updateUser);

module.exports = router;