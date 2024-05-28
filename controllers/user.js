const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

async function signUp(req, res) {
  try {
    const { name, email, password, company,role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Créer un nouvel utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, company,role });
    await newUser.save();
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
          user: "54079205eb8520",
          pass: "916706a1405f53"
      }
  });
    let info = await transporter.sendMail({
      from: 'ofrPr', // sender address
      to: email, // list of receivers
      subject: 'signUp ✔', // Subject line
      html: '<b>bien venu dand notre platform OFE , vous pouvez connecter a votre compte </b>', // html body
  });
    // Envoyer une réponse réussie
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    // Gérer les erreurs
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'An error occurred while signing up' });
  }
}

module.exports = { signUp };