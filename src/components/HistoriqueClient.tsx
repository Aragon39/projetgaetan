// Importation des modules nécessaires
import React, { useEffect, useState } from 'react'; // Import des hooks useEffect et useState pour la gestion des effets et de l'état
import { Link, useParams } from 'react-router-dom'; // Import de Link pour la navigation et useParams pour extraire les paramètres d'URL
import axios from 'axios'; // Import de axios pour effectuer des requêtes HTTP
import './HistoriqueClient.css'; // Import du fichier CSS pour les styles du composant
import logo from '../assets/Logo-ordilan.png'; // Import du logo de la société

// Définition de l'interface TypeScript pour structurer les données d'historique
interface Historique {
  dateFin: string | null; // Date de fin des travaux, peut être null si les travaux sont encore en cours
  numeroSeriePC: string; // Numéro de série du matériel
  machine: string; // Type de machine (ordinateur, imprimante, etc.)
  date_travail: string; // Date des travaux réalisés
  description: string; // Description des travaux effectués
  etat_materiel: string; // État du matériel après les travaux
  telephone: string; // Numéro de téléphone du client
  technicien: string; // Nom du technicien ayant réalisé les travaux
  email: string; // Adresse email du client
}

// Composant fonctionnel HistoriqueClient
const HistoriqueClient: React.FC = () => {
  // Extraction du nom du client depuis les paramètres d'URL
  const { nom } = useParams<{ nom: string }>();

  // Déclaration des états pour l'historique, le chargement et les erreurs
  const [historique, setHistorique] = useState<Historique[]>([]); // État pour stocker l'historique des travaux
  const [isLoading, setIsLoading] = useState<boolean>(true); // État pour indiquer si les données sont en cours de chargement
  const [error, setError] = useState<string | null>(null); // État pour stocker les messages d'erreur

  // useEffect pour charger les données lors du premier rendu ou lorsque le nom change
  useEffect(() => {
    // Fonction asynchrone pour récupérer les données d'historique depuis le serveur
    const fetchHistorique = async () => {
      try {
        // Requête GET pour obtenir l'historique du client spécifié
        const { data } = await axios.get<Historique[]>(`http://localhost:3001/historique/${nom}`);
        setHistorique(data); // Mise à jour de l'état avec les données reçues
      } catch {
        setError('Erreur de chargement.'); // Mise à jour de l'état d'erreur en cas de problème
      } finally {
        setIsLoading(false); // Désactivation de l'état de chargement une fois la requête terminée
      }
    };

    fetchHistorique(); // Appel de la fonction pour récupérer les données
  }, [nom]); // Dépendance sur 'nom' pour relancer l'effet lorsque ce paramètre change

  // Fonction pour formater une date en chaîne lisible
  const formatDate = (dateString: string | null) => dateString ? new Date(dateString).toLocaleDateString() : '';

  // Fonction pour déterminer le statut des travaux (En cours ou Terminé)
  const determineStatut = (dateFin: string | null) => dateFin ? (new Date(dateFin) <= new Date() ? 'Terminé' : 'En cours') : 'En cours';

  // Fonction pour envoyer un e-mail au client avec les détails de l'historique
  const handleSendEmail = async (toEmail: string) => {
    try {
      // Envoi d'une requête POST pour déclencher l'envoi de l'e-mail
      const { status } = await axios.post('http://localhost:3001/send-email', {
        toEmail,
        subject: 'Rapport d\'historique de travaux',
        text: `Bonjour,\nVoici le rapport d'historique des travaux pour ${nom}.`,
      });
      alert(status === 200 ? 'E-mail envoyé.' : 'Erreur lors de l\'envoi.'); // Notification en fonction du statut de la requête
    } catch {
      alert('Erreur lors de l\'envoi.'); // Notification en cas d'erreur lors de l'envoi de l'e-mail
    }
  };

  // Rendu du composant
  return (
    <div className="historique-container">
      {/* Affichage du logo de la société */}
      <img src={logo} alt="Logo" className="logo-societe" />

      {/* Titre de la page avec le nom du client */}
      <h1>Historique des Travaux pour {nom}</h1>

      {/* Affichage des messages de chargement ou d'erreur */}
      {isLoading ? <p className="status-message">Chargement en cours...</p> : error ? <p className="status-message error">{error}</p> : (
        // Affichage du tableau si les données sont disponibles
        historique.length > 0 && (
          <table className="historique-table">
            <thead>
              <tr>
                {/* En-têtes du tableau */}
                {['Machine', 'Date de Travail', 'Description', 'État du matériel', 'Téléphone', 'Technicien', 'Email', 'Numéro de Série', 'Date de Fin', 'Statut', 'Actions'].map(th => <th key={th}>{th}</th>)}
              </tr>
            </thead>
            <tbody>
              {/* Affichage des lignes du tableau */}
              {historique.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.machine}</td>
                  <td>{formatDate(entry.date_travail)}</td>
                  <td>{entry.description}</td>
                  <td>{entry.etat_materiel}</td>
                  <td>{entry.telephone}</td>
                  <td>{entry.technicien}</td>
                  <td>{entry.email}</td>
                  <td>{entry.numeroSeriePC}</td>
                  <td>{formatDate(entry.dateFin)}</td>
                  <td>{determineStatut(entry.dateFin)}</td>
                  <td>
                    {/* Bouton pour envoyer un e-mail contenant les détails de l'intervention */}
                    <button onClick={() => handleSendEmail(entry.email)}>Envoyer e-mail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {/* Lien pour retourner à la liste des clients */}
      <Link to="/listesClientelles" className="back-button">Retour</Link>
    </div>
  );
};

export default HistoriqueClient;