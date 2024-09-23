import React, { useEffect, useState } from 'react';  // Importation de React et des hooks useEffect et useState pour gérer les effets et l'état du composant
import axios from 'axios';  // Importation de la bibliothèque axios pour effectuer des requêtes HTTP
import { Link, useNavigate } from 'react-router-dom';  // Importation des composants Link et useNavigate pour la navigation entre les pages
import logoListe from '../assets/Logo-ordilan.png';  // Importation d'une image pour l'utiliser dans le composant
import './listeClientelles.css';  // Importation du fichier CSS pour les styles spécifiques au composant

interface Client {
  nom: string;  // Nom du client, sous forme de chaîne de caractères
  machine: string;  // Machine associée au client, sous forme de chaîne de caractères
  date: string;  // Date associée au client, sous forme de chaîne de caractères (au format ISO ou autre)
}

// Définition du composant ListeClientelles
const ListeClientelles: React.FC = () => {  // Déclaration du composant fonctionnel ListeClientelles
  const [clients, setClients] = useState<Client[]>([]);  // Déclaration de l'état 'clients', initialisé avec un tableau vide, pour stocker les données des clients
  const navigate = useNavigate();  // Création de la fonction navigate pour gérer la navigation entre les pages

  useEffect(() => {  // Hook useEffect qui s'exécute après le premier rendu du composant
    const fetchClients = async () => {  // Fonction asynchrone pour récupérer les données des clients depuis l'API
      try {
        const response = await axios.get('http://localhost:3001/clients');  // Envoi de la requête GET à l'API pour obtenir les données des clients
        if (Array.isArray(response.data)) {  // Vérifie si les données retournées par l'API sont un tableau
          setClients(response.data);  // Mise à jour de l'état 'clients' avec les données récupérées
        } else {
          console.error('La réponse de l\'API n\'est pas un tableau :', response.data);  // Affichage d'une erreur si les données ne sont pas au format attendu
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des clients :', error);  // Affichage d'une erreur en cas d'échec de la requête
      }
    };

    fetchClients();  // Appel de la fonction pour récupérer les données des clients
  }, []);  // Dépendance vide signifie que l'effet s'exécute uniquement au montage du composant

  // Fonction pour formater une date ISO 8601 en "jj/mm/aaaa"
  const formatDate = (isoDate: string): string => {  // Déclaration de la fonction formatDate qui prend une date au format ISO
    const dateObj = new Date(isoDate);  // Création d'un objet Date à partir de la chaîne ISO
    const day = String(dateObj.getDate()).padStart(2, '0');  // Extraction du jour et ajout d'un zéro devant les jours inférieurs à 10
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');  // Extraction du mois (ajout de 1 car les mois sont indexés à partir de 0) et ajout d'un zéro devant les mois inférieurs à 10
    const year = dateObj.getFullYear();  // Extraction de l'année
    return `${day}/${month}/${year}`;  // Retourne la date formatée en "jj/mm/aaaa"
  };

  // Fonction pour rediriger vers la page de services informatiques
  const handleAddClient = () => {
    navigate('/service-informatique');
  };

  return (
    <div className="container-liste">
      <div className="logo-titre-container">
        <img src={logoListe} alt="Logo de la société" className="logo-liste" />
        <h1 className="titre-liste">Liste des Clients</h1>
      </div>
      <div className="client-list-container">
        <button onClick={handleAddClient} className="add-client-button">Ajouter Client</button> {/* Bouton pour ajouter un client */}
        <table className="client-list">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Machine</th>
              <th>Date</th>

            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/historique/${client.nom}`}>
                    {client.nom}
                  </Link>
                </td>
                <td>{client.machine}</td>
                <td>{formatDate(client.date)}</td> {/* Utilisation de la fonction formatDate */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListeClientelles;