const express = require('express');
const { register, login } = require('../controllers/users.controller');
const router = express.Router();

//pour vérifier si l'email est valide
const {body} = require('express-validator');

// inscription nouvel utilisateur
router.post('/', register);

// connexion à un compte existant
// Avant d'appeler login, on vérifie que l'email de connexion saisi est bien au format email grâce à express-validator
router.post('/login', body('email').isEmail(), login);
/*
Exemple d'utilisastion de rateLimit sur la route login
router.post('/login', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes (le temps est exprimé en ms)
  max: 100, // limite chaque IP à 100 requêtes par fenêtre de temps
}), login);
*/

module.exports = router;
