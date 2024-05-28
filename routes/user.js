const express = require('express');
const router = express.Router();
const User = require('../models/user');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');
const isAuth = require('../controllers/isAuth');
const user = require('../midelware/user');
const nodemailer = require('nodemailer');

const { signUp } = require('../controllers/user');

// Route pour l'inscription d'un utilisateur
router.post('/api/auth/sign-up', signUp);





router.get('/api/auth/getcurrentUser/byId/:id', async (req, res) => {
    let user = await User.findById(req.params.id)
    if(user){
        return res.status(200).json({user , success: true });

    }
    return res.status(200).json({ error: "user not existe" });

});
router.post('/api/auth/forgot-password', async (req, res) => {
    const email = req.body.email;
    // Vérification que l'e-mail est fourni
    if (!email) {
        return res.status(400).json({ error: "L'e-mail est requis." });
    }
    let user = await User.find({ email: email })
    if (user) {
        const hashedPassword = await bcrypt.hash("123456", 10);
        await User.findOneAndUpdate({ email: email }, { password: hashedPassword });
        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "54079205eb8520",
                pass: "916706a1405f53"
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'ofrPr', // sender address
            to: email, // list of receivers
            subject: 'forgot-password ✔', // Subject line
            html: '<b>votre nouvaux pass est 123456 </b>', // html body
        });
        // Insérez ici la logique pour envoyer un e-mail de réinitialisation de mot de passe
        // Réponse réussie
        return res.status(200).json({ message: "Un e-mail de réinitialisation de mot de passe a été envoyé." });
    }
    else {
        return res.status(400).json({ error: "user not existe." });

    }
});

// Endpoint pour la fonction resetPassword
router.post('/api/auth/reset-password', (req, res) => {
    const password = req.body.password;
    // Vérification que le mot de passe est fourni
    if (!password) {
        return res.status(400).json({ error: "Le mot de passe est requis." });
    }
    // Insérez ici la logique pour réinitialiser le mot de passe de l'utilisateur

    // Réponse réussie
    return res.status(200).json({ message: "Le mot de passe a été réinitialisé avec succès." });
});







router.post("/login", user.login);
router.get("/test", isAuth, user.test);





router.post('/api/auth/register', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        // Vérification si l'utilisateur existe déjà dans la base de données
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }
        // Hachage du mot de passe avant de l'enregistrer dans la base de données
        const hashedPassword = await bcrypt.hash(password, 10);
        // Création d'un nouvel utilisateur
        const newUser = new User({
            email,
            password: hashedPassword,
            role
        });
        // Enregistrement de l'utilisateur dans la base de données
        await newUser.save();
        // Création du jeton d'accès
        const accessToken = jwt.sign({ userId: newUser._id }, 'secret_key', { expiresIn: '1h' });
        // Envoi de la réponse avec le jeton d'accès et les détails de l'utilisateur
        res.json({
            accessToken,
            user: {
                email: newUser.email
                // Ajoutez d'autres détails de l'utilisateur si nécessaire
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});




router.get('/api/common/user', (req, res) => {
    // Simuler un délai de traitement
    setTimeout(() => {
        res.json(currentUser);
    }, 1000); // Délai de 1 seconde
});



router.patch('/api/common/user', (req, res) => {
    const updatedUser = req.body.user;
    currentUser = { ...currentUser, ...updatedUser };
    res.json(currentUser);
});

router.post('/api/auth/sign-out', (req, res) => {
    // Supprimer le jeton d'accès de la session du serveur (si nécessaire)
    // Par exemple, si vous stockez le jeton d'accès dans une liste noire pour le révoquer

    // Réponse réussie
    return res.status(200).json({ message: "Déconnexion réussie." });
});


router.post('/api/auth/unlock-session', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Vérification que les identifiants sont fournis
        if (!email || !password) {
            return res.status(400).json({ error: "Veuillez fournir une adresse e-mail et un mot de passe." });
        }
        // Recherche de l'utilisateur dans la base de données
        const user = await User.findOne({ email });
        // Vérification si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ error: "Aucun utilisateur trouvé avec cet e-mail." });
        }
        // Vérification si le mot de passe est correct
        if (password !== user.password) { // Remplacer cette comparaison par la logique de vérification de mot de passe sécurisée
            return res.status(401).json({ error: "Mot de passe incorrect." });
        }
        // Réponse réussie avec les informations de l'utilisateur
        return res.status(200).json(user);
    } catch (error) {
        console.error("Erreur lors du déverrouillage de la session :", error);
        return res.status(500).json({ error: "Erreur lors du déverrouillage de la session de l'utilisateur." });
    }
});





router.get('/api/auth/check', async (req, res) => {
    // Vérifiez si l'utilisateur est authentifié (vous pouvez implémenter votre propre logique ici)
    const authenticated = req.isAuthenticated();
    // Si l'utilisateur est authentifié, renvoyez ses informations
    if (authenticated) {
        const userId = req.user.id; // Supposons que vous stockez l'ID de l'utilisateur dans la session
        try {
            const user = await User.findById(userId);
            return res.status(200).json({ authenticated: true, user });
        } catch (error) {
            console.error("Erreur lors de la recherche de l'utilisateur :", error);
            return res.status(500).json({ error: "Erreur lors de la recherche de l'utilisateur." });
        }
    }
    // Si l'utilisateur n'est pas authentifié, renvoyez false
    return res.status(200).json({ authenticated: false });
});




// Simulation de données utilisateur
const users = [
    {
        id: 1,
        email: 'jamila@company.com',
        password: 'admin',
        role: 'admin'
    },
    {
        id: 2,
        email: 'userhajjaj@company.com',
        password: 'user',
        role: 'user'
    }
];

// Fonction pour générer un jeton JWT (à remplacer par votre propre implémentation)

// Route pour gérer l'authentification
router.post('/api/auth/sign-in', async (req, res) => {
    const { email, password } = req.body;

    // Recherchez l'utilisateur correspondant aux informations d'identification fournies
    const user = await User.findOne({ email: email });
    if (user) {
        console.log("user", user)
        const checkPassword = bcrypt.compareSync(password, user.password);

        if (user && checkPassword) {
            // Authentification réussie, renvoie les données utilisateur et le jeton JWT
            const accessToken = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '24h' });

            const response = {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                    // Ajoutez d'autres champs utilisateur si nécessaire
                },
                accessToken: accessToken,
                tokenType: 'bearer'
            };

            res.status(200).json({ ...response, msg: "success" });
        }
        else {
            res.status(200).json({ user: null, error: 'Invalid credentials' });

        }
    } else {
        // Identifiants invalides, renvoie une réponse d'erreur
        res.status(200).json({ user: null, error: 'Invalid credentials' });
    }
});


// Fonction pour vérifier le jeton JWT (à remplacer par votre propre implémentation)
function verifyJWTToken(accessToken) {
    // Votre implémentation pour vérifier le jeton JWT
    return true; // Par exemple, retourne toujours vrai pour cet exemple
}

// Fonction pour générer un jeton JWT (à remplacer par votre propre implémentation)
function generateJWTToken() {
    // Votre implémentation pour générer un jeton JWT
    return 'jwt_token_here';
}

// Route pour gérer l'authentification avec un jeton JWT
router.post('/api/auth/sign-in-with-token', (req, res) => {
    const { accessToken } = req.body;

    // Vérifiez si le jeton JWT est valide
    if (verifyJWTToken(accessToken)) {
        // Jeton JWT valide, renvoie les données utilisateur et un nouveau jeton JWT
        const response = {
            user: {
                // Récupérez les données utilisateur à partir du jeton JWT ou d'une autre source
                // Remarque : cette partie doit être adaptée à votre implémentation spécifique
            },
            accessToken: generateJWTToken(),
            tokenType: 'bearer'
        };

        res.status(200).json(response);
    } else {
        // Jeton JWT invalide, renvoie une réponse d'erreur
        res.status(401).json({ error: 'Invalid token' });
    }
});





module.exports = router;



