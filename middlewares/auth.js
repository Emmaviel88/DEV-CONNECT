const jwt = require('jsonwebtoken'); 

// Récupération du token qui est toujours envoyé dans le header de la requête
const auth = (req, res, next) => {
    // Récupérer le token après "Bearer ". 
    // Le token est toujours dans le header "Authorization" et commence par "Bearer "
    // La fonction split permet de séparer la chaîne de caractères en deux parties : 
    // "Bearer" et le token lui-même. On prend la deuxième partie (index 1) qui est le token. 
    const token = req.header('Authorization').split(' ')[1]; 
    console.log("Token reçu : " + token);
    
    if (!token) {
        return res.status(401).json({ erreur: 'L11 : Veuillez vous connecter' });
    }
    try {
        // Vérifier le token et récupérer les informations de l'utilisateur
        // la variable JWT_SECRET est une clé secrète utilisée pour signer et vérifier les tokens JWT.
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        // Ajouter les informations de l'utilisateur à la requête pour les utiliser dans les routes protégées
        req.user = decodedUser;
        next();
    } catch (er) {
        return res.status(401).json({ erreur: 'L21 : Veuillez vous connecter' });
    }
}

module.exports = auth;