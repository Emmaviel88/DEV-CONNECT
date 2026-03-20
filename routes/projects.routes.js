const express = require('express');
const { getAllProjects, getProject, createProject } = require('../controllers/projects.controller');
const router = express.Router();
const auth = require('../middlewares/auth');

// liste des projets
router.get('/list', getAllProjects);

// détail d'un projet (à partir de son ID)
router.get('/:id', getProject);

// création d'un projet. Cest une création, donc POST et on ne précise pas d'ID puisqu'il sera créé automatiquement par MongoDB
router.post('/create', auth, createProject);

module.exports = router;