const express = require('express');
const { default: mongoose } = require('mongoose');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
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

connectDB();

app.use('/api/projects', require('./routes/projects.routes'));

app.use('/api/users', require('./routes/users.routes'));

// like / unlike un projet
// commenter un projet (création d'un commentaire)
// supprimer un projet
// modifier un projet

app.listen(port, () => console.log(`Server started on port ${port}`));