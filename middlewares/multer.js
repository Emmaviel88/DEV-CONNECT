// multer pour gérer les fichiers téléchargés (par exemple, les images de projets)
const multer = require('multer');
// path pour gérer les chemins de fichiers et de répertoires
const path = require('path');

// configuration de multer pour le stockage des fichiers téléchargés
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/'); // dossier de destination pour les fichiers téléchargés 
  },
  filename: (req, file, callback) => {
    // nom de fichier unique pour éviter les conflits en utilisant la date actuelle et un nombre aléatoire
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E5 ); 
    // Appel de la callback avec le nom unique en conservant l'extension du fichier original
    callback(null, unique + path.extname(file.originalname)); 
    }
});

const fileFilter = (req, file, callback) => {
  // accepter seulement les fichiers image (jpg, jpeg, png, gif, webp)
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  // vérifier l'extension du fichier et le type MIME pour s'assurer que le fichier est bien une image
  const isExtensionValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeTypeValid = allowedTypes.test(file.mimetype);
  if(isMimeTypeValid && isExtensionValid) {
    callback(null, true); // accepter le fichier
  } else {
    callback(new Error('Only image files are allowed!'), false); // rejeter le fichier avec une erreur
  }
};

const upload = multer({ 
    storage: storage,
    fileFilter : fileFilter, 
    limits: { fileSize: 5 * 1024 * 1024 // limite la taille du fichier à 5MB
    }
});

module.exports = upload;