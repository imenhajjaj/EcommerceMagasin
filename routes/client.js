const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const User = require('../models/user');
const ClientProd  = require('../models/ClientProd');



router.get('/cc', async (req, res) => {     //ok   getAll
    try {
      const products = await ClientProd.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


// POST route to create a new client product                 //ok   Post
router.post('/', async (req, res) => {
    try {
        const newClientProd = new ClientProd(req.body);
        await newClientProd.save();
        res.status(201).json({ message: 'Client product created successfully', data: newClientProd });
    } catch (error) {
        console.error('Error creating client product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Define the getProduct API
router.get('/cc/:id', async (req, res) => {     //ok   getId
    try {
      const id = req.params.id;
      const product = await ClientProd.findById(id);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

  router.get('/cc', async (req, res) => {     //ok  title
    try {
      const query = req.query.q;
      const products = await ClientProd.find({ title: { $regex: query, $options: 'i' } });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

  router.get('/cc/:id/rating', async (req, res) => {   //ok Rating
    try {
      const id = req.params.id;
      const product = await ClientProd.findById(id);
      const ratingList = [];
      [...Array(5)].map((_, index) => {
        return index + 1 <= Math.trunc(product?.rating.rate)? ratingList.push(true) : ratingList.push(false);
      });
  
res.status(200).json(ratingList);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/api/products/:category', (req, res) => {
    const category = req.params.category;
    MongoClient.connect(dbUrl, (err, client) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: 'Error connecting to database' });
      } else {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        collection.find({ category: category }).toArray((err, products) => {
          if (err) {
            console.log(err);
            res.status(500).send({ message: 'Error retrieving products' });
          } else {
            res.send(products);
          }
        });
      }
    });
  });


router.get('/min', async (req, res) => {
        try {
          const min = req.params.min;
          const max = req.params.max;
          const products = await ClientProd.find({ price: { $gte: min, $lte: max } });
          res.status(200).json(products);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      });
      
      router.get('/nn', async (req, res) => {        //Non
        try {
          const category = req.params.category;
          const checkedItems = req.query.checkedItems;
          const checked = checkedItems.filter(item => item.checked).map(item => item.value);
          const products = await ClientProd.find({ type: { $in: checked } });
          res.status(200).json(products);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      });

  


   
      router.post('/login', (req, res) => {
        // Ici, vous pouvez mettre en œuvre la logique de connexion en vérifiant les informations d'identification
        const { email, password } = req.body;
        // Vérifier les informations d'identification
        if (email === 'imenhajjaj@gmail.com' && password === '52225043') {
          // Authentification réussie
          res.status(200).json({ message: 'Login successful' });
        } else {
          // Informations d'identification invalides
          res.status(401).json({ message: 'Invalid email or password' });
        }
      });
      
      router.post('/register', async (req, res) => {       //okkkk registr
        try {
            // Récupérer les données du formulaire d'inscription depuis le corps de la requête
            const { firstName, lastName, email, password } = req.body;
            // Vérifier si l'utilisateur existe déjà dans la base de données
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            }
            // Créer un nouvel utilisateur
            const newUser = new User({ firstName, lastName, email, password });
            await newUser.save();
            // Envoyer une réponse de succès
            res.status(201).json({ message: 'Inscription réussie.' });
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            res.status(500).json({ message: 'Erreur lors de l\'inscription. Veuillez réessayer.' });
        }
    });
    
    
    
module.exports = router;
