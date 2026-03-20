const mongoose = require('mongoose');
const ProjectObject = require('../models/project.model');

exports.getAllProjects = (req, res) => {
  try {
    // Récupérer la liste de tous les projets avec uniquement les champs title et description, triés par date de création (du plus récent au plus ancien)
    // Rq : Entre accolades, on précise le critère éventuel (c'est l'équivalent du WHERE)
    const projects = ProjectObject.find({}, 'title description').sort({ createdAt: -1 });
          // .find({}, 'title description')
          // .sort({ createdAt: -1 });

    // Retourner la liste des projets
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ erreur: 'Erreur lors de la récupération des projets' });
  }
};

exports.getProject = (req, res) => {
  // Récupérer l'ID du projet à partir des paramètres de la requête
  const id = req.params.id;
  console.log('ID du projet demandé :', id);

  // Vérifier si l'ID est un ObjectId valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ erreur: 'ID de projet invalide' });
  }

  // Rechercher les détails (title, description, skills, image) d'un projet à partir de son ID
  const project = ProjectObject.findById(id)
    .select('title description skills image');

  // Si le projet n'existe pas, retourner une erreur 404
  if (!project) {
    return res.status(404).json({ erreur: 'Projet non trouvé' });
  }

  // Si le projet existe, retourner les détails de celui-ci
  res.status(200).json(project);
};

exports.createProject = async (req, res) => {
  try{
      // Récupérer les données du projet à partir du corps de la requête
      const { title, description, skills, image } = req.body;

      // Vérifier que le titre est présent
      if (!title) {
        return res.status(400).json({ erreur: 'Le titre est requis' });
      }

      /***********************************************************************************************************
      /* Si les champs suivants étaient requis dans le model, on les vérifierait de la même manière que le titre :
      /***********************************************************************************************************
      
      // Vérifier que la description est présente
      if (!description) {
        return res.status(400).json({ erreur: 'La description est requise' });
      }

      // Vérifier que les compétences sont présentes
      if (!skills || skills.length === 0) {
        return res.status(400).json({ erreur: 'Les compétences sont requises' });
      }

      // Vérifier que l'image est présente  
      if (!image) {
        return res.status(400).json({ erreur: 'L\'image est requise' });
      }
      */

      // Créer un nouveau projet avec les données fournies
      const newProject = new ProjectObject({
        title,
        description,
        skills,
        image,
        author: req.user.userId, // Remplacez par l'ID de l'utilisateur connecté (ex: req.user._id) une fois que l'authentification est mise en place
        likes: [],    // Initialiser les likes un tableau vide
        comments: []  // Initialiser les comments à un tableau vide
      });

      // Enregistrer le nouveau projet et le retourner quand la BDD aura répondu
      const savedProject = await newProject.save();
      res.status(201).json(savedProject);
  } catch (error) {
      res.status(500).json({ erreur: 'Erreur lors de la création du projet' });
  } 
};