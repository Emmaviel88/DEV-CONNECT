const express = require('express');
const { getAllProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projects.controller');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer');

// liste des projets
router.get('/list', getAllProjects);

// détail d'un projet (à partir de son ID)
router.get('/:id', getProject);

// création d'un projet. C'est une création, donc POST et on ne précise pas d'ID puisqu'il sera créé automatiquement par MongoDB
//router.post('/', auth, upload.single('image'), createProject);
router.post('/', auth, createProject);
// Modification d'un projet. C'est une modification, donc PUT et on précise l'ID du projet à modifier
//router.put('/:id', auth, upload.single('image'), updateProject);
router.put('/:id', auth, updateProject);

// Suppression d'un projet. C'est une suppression, donc DELETE et on précise l'ID du projet à supprimer
router.delete('/:id', auth, deleteProject);

module.exports = router;