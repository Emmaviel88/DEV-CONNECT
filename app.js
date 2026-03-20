// express pour créer le serveur et gérer les routes
const express = require('express');
// mongoose pour la connexion à la base de données MongoDB
const { default: mongoose } = require('mongoose');
// connectDB pour établir la connexion à la base de données
const connectDB = require('./config/db');
// helmet pour la sécurité des en-têtes HTTP
const helmet = require('helmet');
// cors pour gérer les requêtes cross-origin
const cors = require('cors');
// rate-limit pour limiter le nombre de requêtes par IP sur un interval de temps défini, pour éviter les attaques brute-force et les abus
const rateLimit = require('express-rate-limit');
// dotenv pour charger les variables d'environnement à partir d'un fichier .env
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const port = 5000;

app.use(express.json());

//helmet pour la sécurité
app.use(helmet());

//cors pour les requêtes cross-origin
//permet d'autoriser seulementles requêtes provenant d'une origine particulière
//par exemple app.use(cors({ origin: 'https://mon-super-site.com' })) pour n'autoriser que les requêtes provenant du front-end 'mon-super-site.com'
app.use(cors());

// rate-limit pour limiter le nombre de requêtes par IP sur un interval de temps défini, pour éviter les attaques brute-force et les abus
// Cette limitiation est globale ici. On peut aussi limiter par route en la plaçant avant la route concernée. 
// Par exemple, on peut limiter les requêtes sur la route de connexion pour éviter les attaques brute-force sur les mots de passe.    
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes (le temps est exprimé en ms)
  max: 100, // limite chaque IP à 100 requêtes par fenêtre de temps
}));

// servir les fichiers statiques du dossier 'uploads' pour accéder aux images téléchargées
app.use(express.static('uploads')); 

connectDB();

app.use('/api/projects', require('./routes/projects.routes'));

app.use('/api/users', require('./routes/users.routes'));

// like / unlike un projet
// commenter un projet (création d'un commentaire)
// supprimer un projet
// modifier un projet

app.listen(port, () => console.log(`Server started on port ${port}`));