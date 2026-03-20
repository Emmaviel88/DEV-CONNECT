const mongoose = require('mongoose');
const UserObject = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const passwordValidator = require('password-validator');

// inscription 
exports.register = async (req, res) => {
    try{
        // Récupérer les données de l'utilisateur à partir du corps de la requête
        const {email, password, bio, avatar} = req.body;

        // Vérifier que l'email et le mot de passe sont présents
        if (!email || !password) {
          return res.status(400).json({ erreur: 'Email et Mot de Passe sont requis' });
        }
        
        // Vérifier que le mot de passe respecte les critères de sécurité
        // Dans l'exemple ci-dessous, le mot de passe doit avoir une longueur >= 8, et
        // il doit contenir au moins une majuscule et un chiffre et ne pas contenir d'espace
        // On défini ces critères :
        const schema = new passwordValidator();
        schema
          .is().min(8)           // Minimum length 8
          .has().uppercase()     // Contient au moins une majuscule
          .has().digits()        // Contient au moins 1 chiffre
          .has().not().spaces(); // Should not have spaces

        // On vérifie que le mot de passe respecte les critères définis dans le schéma ci-dessus
        if (!schema.validate(password)) {
          return res.status(400).json({ erreur: 'Le mot de passe ne respecte pas les critères de sécurité !' });
        }

        const userExists = await UserObject.findOne({ email });
        if (userExists) {
          return res.status(400).json({ erreur: 'Cet email est déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Créer un nouvel utilisateur avec les données fournies
        const newUser = new UserObject({
          email,
          password: hashedPassword,
          bio,
          avatar
        });

        const savedUser = await newUser.save();
        /*res.status(201).json({ message: `Utilisateur ${savedUser} créé avec succès` });*/
        res.status(201).json(savedUser);

    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        res.status(500).json({ erreur: 'Une erreur est survenue lors de l\'inscription' });
    };
};


// connexion
exports.login = async (req, res) => {
  try {
    // Récupérer les données de connexion à partir du corps de la requête
    const { email, password } = req.body;
    //console.log(email, password);
        
    // Vérifier que l'email et le mot de passe sont présents
    if (!email || !password) {
      return res.status(400).json({ erreur: 'Email et Mot de Passe sont requis' });
    }

    // Rechercher l'utilisateur dans la base de données
    const userExists = await UserObject.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ erreur: 'Email ou Mot de Passe incorrect' });
    }

    // Vérifier que le mot de passe est correct
    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if (!isPasswordValid) {
      return res.status(400).json({ erreur: 'Email ou Mot de Passe incorrect' });
    }

    const token = jwt.sign({ userId: userExists._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: userExists });

  } catch (err) {
    console.error('Erreur lors de la connexion : ', err);
    res.status(500).json({ erreur: 'Une erreur est survenue lors de la connexion' });
  }
};