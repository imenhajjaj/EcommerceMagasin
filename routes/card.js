const express = require('express');
const router = express.Router();
const Card = require('../models/cards');
const Item = require('../models/offre');
const axios = require('axios');
const { Observable } = require('rxjs');
const Commande = require('../models/commande');
const Order = require('../models/orders');
const User = require('../models/user');



const apiUrl = 'http://localhost:3000/posts'; // replace with your API URL


router.post('/ajout', (req, res) => {
    // Récupérer les données du corps de la requête
    const { name, image, point, description } = req.body;

    // Créer une nouvelle instance de Card avec les données du produit
    const newCard = new Card({
        name: name,
        image: image,
        point: point,
        description: description

    });

    // Enregistrer la nouvelle carte dans la base de données
    newCard.save({ new: true }) // Utilisation de { new: true } pour obtenir le document mis à jour après l'enregistrement
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Carte ajoutée avec succès',
                createdCard: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});




router.get('/all', (req, res) => {
    // Utiliser le modèle Card pour trouver tous les produits dans la base de données
    Card.find()
        .then(products => {
            // Envoyer les produits récupérés en réponse
            res.status(200).json(products);
        })
        .catch(err => {
            // En cas d'erreur, envoyer une réponse d'erreur
            res.status(500).json({
                error: err
            });
        });
});


router.delete('/supprimer/:id', (req, res) => {
    const productId = req.params.id;

    // Utiliser le modèle Card pour supprimer le produit correspondant à l'ID spécifié
    Card.findByIdAndDelete(productId)
        .then(() => {
            // Envoyer une réponse réussie si la suppression est effectuée avec succès
            res.status(200).json({
                message: 'Produit supprimé avec succès'
            });
        })
        .catch(err => {
            // En cas d'erreur, envoyer une réponse d'erreur
            res.status(500).json({
                error: err
            });
        });
});


router.put('/modifier/:id', (req, res) => {
    const productId = req.params.id;
    const updatedProductData = req.body;

    // Utilisez findByIdAndUpdate pour mettre à jour le produit dans la base de données
    Card.findByIdAndUpdate(productId, updatedProductData, { new: true })
        .then(updatedProduct => {
            res.status(200).json(updatedProduct);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});



router.post('/commande', async (req, res) => {
    try {
        const formData = req.body;
        // Créez une nouvelle instance du modèle avec les données du formulaire
        const nouvelleCommande = new Commande({
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            quantity: formData.quantity,
            magasin: formData.magasin
        });
        // Enregistrez cette instance dans la base de données
        const commandeEnregistree = await nouvelleCommande.save();
        // Réponse avec l'objet enregistré
        res.status(201).json(commandeEnregistree);
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la commande:', error);
        // Une erreur s'est produite lors de l'enregistrement de la commande
        res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'enregistrement de la commande.', error: error.message });
    }
});


router.get('/commandes', async (req, res) => {
    try {
      // Récupérer toutes les commandes depuis la base de données
      const commandes = await Commande.find();
  
      // Répondre avec les données des commandes
      res.status(200).json(commandes);
    } catch (error) {
      // En cas d'erreur, répondre avec un code d'erreur et un message
      console.error('Erreur lors de la récupération des commandes:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
    }
  });




// Create
router.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Read
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
  


router.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).send('Item not found');
    }
    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.delete('/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).send('Item not found');
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
