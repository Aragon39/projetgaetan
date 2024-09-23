const express = require('express'); // Importation du module express pour créer l'application serveur
const mysql = require('mysql2'); // Importation du module mysql2 pour la connexion à MySQL
const cors = require('cors'); // Importation du middleware CORS pour gérer les politiques de partage de ressources
const util = require('util'); // Importation du module util pour les fonctionnalités utilitaires
require('dotenv').config(); // Chargement des variables d'environnement à partir d'un fichier .env

const app = express(); // Création d'une instance de l'application Express
app.use(cors()); // Application du middleware CORS pour autoriser les requêtes cross-origin
app.use(express.json()); // Middleware pour analyser les corps de requêtes au format JSON

// Configuration de la connexion à MySQL avec mysql2
const db = mysql.createConnection({
  host: 'localhost', // Hôte de la base de données
  user: 'root', // Utilisateur de la base de données
  database: 'projetordilan', // Nom de la base de données
});

// Fonction pour se connecter à la base de données
const connectToDatabase = () => {
  db.connect(err => {
    if (err) {
      console.error('Erreur de connexion à la base de données :', err); // Affichage d'une erreur en cas d'échec de connexion
      throw err; // Lancer une exception pour stopper l'exécution en cas d'erreur
    }
    console.log('Connecté à la base de données MySQL'); // Confirmation de la connexion réussie
  });
};

// Promisification des requêtes MySQL pour utiliser async/await
db.query = util.promisify(db.query).bind(db); // Utilisation de promisify pour permettre l'utilisation d'async/await avec db.query

// Fonction pour déterminer le statut en fonction de la date de fin
const determineStatut = (dateFin) => {
  if (!dateFin) {
    return 'En cours'; // Si dateFin n'est pas définie, le statut est 'En cours'
  }
  
  const dateFinParsed = new Date(dateFin); // Conversion de dateFin en objet Date
  const now = new Date(); // Création d'un objet Date pour la date actuelle
  
  // On ignore l'heure en comparant les dates
  dateFinParsed.setHours(0, 0, 0, 0); // Réinitialisation des heures, minutes, secondes et millisecondes de dateFinParsed
  now.setHours(0, 0, 0, 0); // Réinitialisation des heures, minutes, secondes et millisecondes de now

  if (dateFinParsed < now) {
    return 'Terminé'; // Si dateFin est dans le passé ou aujourd'hui, le statut est 'Terminé'
  }

  return 'En cours'; // Sinon, le statut est 'En cours'
};

// Fonction pour gérer les erreurs et envoyer une réponse appropriée
const handleError = (res, message, error) => {
  console.error(message, error); // Affichage de l'erreur
  res.status(500).send(message); // Réponse avec statut 500 pour une erreur serveur
};

// Fonction utilitaire pour ajouter un client s'il n'existe pas
const addClientIfNotExists = async (nom, machine, date, email) => {
  // Effectue une requête pour vérifier si un client avec le nom donné existe déjà dans la table 'clients'
  const existingClient = await db.query('SELECT * FROM clients WHERE nom = ?', [nom]);

  // Si aucun client avec ce nom n'existe (le tableau 'existingClient' est vide)
  if (existingClient.length === 0) {
    // Insère un nouveau client dans la table 'clients' avec les valeurs fournies pour 'nom', 'machine', 'date', et 'email'
    await db.query('INSERT INTO clients (nom, machine, date, email) VALUES (?, ?, ?, ?)', 
      [nom, machine, date, email]);

    // Affiche un message dans la console pour confirmer que le nouveau client a été ajouté
    console.log('Nouveau client ajouté.');
  } else {
    // Si un client avec ce nom existe déjà, affiche un message indiquant cela dans la console
    console.log('Le client existe déjà.');
  }
};

// Connexion à la base de données
connectToDatabase();

// Port d'écoute du serveur
const PORT = process.env.PORT || 3001; // Port d'écoute, utilise la variable d'environnement PORT ou 3001par défaut
app.listen(PORT, () => {
  console.log(`Serveur backend écoutant sur http://localhost:${PORT}`); // Confirmation que le serveur écoute sur le port spécifié
});

// Endpoint pour récupérer l'historique des travaux d'un client spécifique
app.get('/historique/:nom', async (req, res) => {
  try {
    const nom = req.params.nom; // Récupération du nom du client depuis les paramètres de la requête
    const historique = await db.query('SELECT * FROM historique WHERE client_nom = ?', [nom]);
    res.json(historique); // Réponse au format JSON avec les données de l'historique
  } catch (error) {
    handleError(res, 'Erreur lors de la récupération de l\'historique des travaux', error); // Gestion des erreurs
  }
});

// Endpoint pour récupérer la liste des clients
app.get('/clients', async (req, res) => {
  try {
    const clients = await db.query('SELECT * FROM clients'); // Récupération de la liste des clients
    res.json(clients); // Réponse au format JSON avec les données des clients
  } catch (error) {
    handleError(res, 'Erreur lors de la récupération des clients', error); // Gestion des erreurs
  }
});

// Endpoint pour ajouter un client et son historique
app.post('/clients', async (req, res) => {
  const { nom, machine, date, description, etat_materiel, telephone, technicien, numeroSeriePC, dateFin, email } = req.body; // Récupération des données du corps de la requête

  if (!nom || !machine || !date || !email) {
    return res.status(400).json({ message: 'Veuillez fournir tous les champs nécessaires.' }); // Validation des champs requis
  }

  try {
    await addClientIfNotExists(nom, machine, date, email); // Ajouter le client s'il n'existe pas
    const statut = determineStatut(dateFin); // Déterminer le statut
    await db.query('INSERT INTO historique (client_nom, machine, date_travail, description, etat_materiel, telephone, technicien, numeroSeriePC, dateFin, email, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nom, machine, date, description, etat_materiel, telephone, technicien, numeroSeriePC, dateFin, email, statut]);
    console.log('Historique ajouté pour le client.'); // Confirmation de l'ajout de l'historique
    res.status(201).json({ message: 'Historique ajouté avec succès.' }); // Réponse au format JSON avec message de succès
  } catch (error) {
    handleError(res, 'Erreur lors de l\'ajout du client ou de l\'historique', error); // Gestion des erreurs
  }
});

// Endpoint pour ajouter un historique de travail
app.post('/historique', async (req, res) => {
  const { client_nom, machine, date_travail, description, etat_materiel, telephone, technicien, numeroSeriePC, dateFin, email } = req.body; // Récupération des données du corps de la requête

  if (!client_nom || !machine || !date_travail || !telephone || !technicien || !email) {
    return res.status(400).json({ message: 'Veuillez fournir tous les champs nécessaires (client_nom, machine, date_travail, telephone, technicien, email).' }); // Validation des champs requis
  }

  try {
    const client = await db.query('SELECT * FROM clients WHERE nom = ?', [client_nom]);
    if (client.length === 0) {
      return res.status(404).json({ message: 'Le client n\'existe pas.' }); // Réponse si le client n'existe pas
    }
    const statut = determineStatut(dateFin); // Déterminer le statut
    await db.query('INSERT INTO historique (client_nom, machine, date_travail, description, etat_materiel, telephone, technicien, numeroSeriePC, dateFin, email, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [client_nom, machine, date_travail, description, etat_materiel, telephone, technicien, numeroSeriePC, dateFin, email, statut]);
    console.log('Historique ajouté pour le client.'); // Confirmation de l'ajout de l'historique
    res.status(201).json({ message: 'Historique ajouté avec succès.' }); // Réponse au format JSON avec message de succès
  } catch (error) {
    handleError(res, 'Erreur lors de l\'ajout de l\'historique', error); // Gestion des erreurs
  }
});