import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react'; // Importation des hooks et composants de React
import axios, { AxiosError } from 'axios'; // Importation d'axios pour les requêtes HTTP et de AxiosError pour gérer les erreurs
import { useNavigate } from 'react-router-dom'; // Hook pour la navigation programmatique
import logo from '../assets/Logo-ordilan.png'; // Importation de l'image du logo
import OptionsComponent from './OptionsComponent'; // Importation du composant pour les options
import DescriptionTravaux from './DescriptionTravaux'; // Importation du composant pour la description des travaux
import EtatMateriel from './EtatMateriel'; // Importation du composant pour l'état du matériel
import './ServiceInformatique.css'; // Importation des styles CSS pour ce composant
import { parseISO, formatISO, isValid, isBefore, parse, format } from 'date-fns'; // Importation des fonctions de gestion des dates

// Définition de l'interface pour les données du formulaire
interface FormData {
  nomClient: string;
  telephoneClient: string;
  dateDebut: string;
  dateFin: string;
  modelePC: string;
  technicien: string;
  numeroSeriePC: string;
  email: string;
}

// Définition de l'interface pour les données d'historique
interface HistoriqueData {
  machine: string;
  date_travail: string;
  dateFin: string;
  description: string;
  etat_materiel: string;
  telephone: string;
  technicien: string;
  numeroSeriePC: string;
  email: string;
}

// Fonction pour convertir une date au format 'dd/MM/yyyy' en format ISO
const convertToISO = (dateStr: string): string => {
  try {
    const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date()); // Parse la date en objet Date
    return formatISO(parsedDate, { representation: 'date' }); // Convertit l'objet Date en format ISO
  } catch (error) {
    console.error('Erreur lors de la conversion de la date:', error); // Gestion des erreurs de conversion
    return ''; // Retourne une chaîne vide en cas d'erreur
  }
};

// Fonction pour déterminer si le chantier est terminé ou non
const isChantierTermine = (dateFin: string): boolean => {
  if (!dateFin) return false; // Si la date de fin est vide, le chantier n'est pas terminé

  const isoDateFin = convertToISO(dateFin); // Conversion de la date de fin en format ISO
  const parsedDateFin = parseISO(isoDateFin); // Parsing de la date en format Date
  const now = new Date(); // Date actuelle

  // Logging des valeurs pour le débogage
  console.log(`Date Fin: ${dateFin}`);
  console.log(`ISO Date Fin: ${isoDateFin}`);
  console.log(`Parsed Date Fin: ${parsedDateFin}`);
  console.log(`Current Date: ${now}`);
  console.log(`Is Terminé: ${isValid(parsedDateFin) && isBefore(now, parsedDateFin)}`);

  return isValid(parsedDateFin) && isBefore(now, parsedDateFin); // Retourne vrai si la date fin est valide et que la date actuelle est avant la date fin
};

// Composant principal du Service Informatique
const ServiceInformatique: React.FC = () => {
  // Définition des valeurs initiales du formulaire
  const initialFormData: FormData = {
    nomClient: '',
    telephoneClient: '',
    dateDebut: '',
    dateFin: '',
    modelePC: '',
    technicien: '',
    numeroSeriePC: '',
    email: '',
  };

  // Déclaration des états du composant
  const [formData, setFormData] = useState<FormData>(initialFormData); // État pour les données du formulaire
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // État pour les options sélectionnées
  const [description, setDescription] = useState<string>(''); // État pour la description des travaux
  const [etatMateriel, setEtatMateriel] = useState<string>(''); // État pour l'état du matériel
  const [isSaved, setIsSaved] = useState<boolean>(false); // État pour savoir si les données ont été enregistrées
  const [historique, setHistorique] = useState<HistoriqueData[]>([]); // État pour l'historique des travaux
  const [ordreReparation] = useState<number>(1); // État pour l'ordre de réparation (ici fixé à 1)

  const navigate = useNavigate(); // Hook pour la navigation programmatique

  // Fonction pour récupérer l'historique des travaux en fonction du nom du client
  const fetchHistorique = useCallback(async (nom: string) => {
    try {
      // Requête GET pour obtenir les données de l'historique
      const response = await axios.get<HistoriqueData[]>(`http://localhost:3001/historique/${nom}`);
      // Formatage des dates et mise à jour de l'état historique
      const formattedHistorique = response.data.map(item => ({
        ...item,
        date_travail: item.date_travail ? format(parseISO(item.date_travail), 'dd/MM/yyyy') : '',
        dateFin: item.dateFin ? format(parseISO(item.dateFin), 'dd/MM/yyyy') : '',
      }));
      setHistorique(formattedHistorique); // Mise à jour de l'état historique
    } catch (error) {
      handleAxiosError(error); // Gestion des erreurs de la requête
    }
  }, []); // Dépendances de useCallback : vide, donc la fonction est stable

  // Effet secondaire pour récupérer l'historique chaque fois que le nom du client change
  useEffect(() => {
    if (formData.nomClient) {
      fetchHistorique(formData.nomClient);
    }
  }, [formData.nomClient, fetchHistorique]); // Dépendances de useEffect : nomClient et fetchHistorique

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Récupère le nom et la valeur de l'élément modifié
    setFormData(prevState => ({
      ...prevState,
      [name]: value, // Met à jour l'état du formulaire avec la nouvelle valeur
    }));
  };

  // Fonction pour gérer les changements dans les options sélectionnées
  const handleOptionsChange = (options: string[]) => {
    setSelectedOptions(options); // Met à jour l'état des options sélectionnées
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de la page)

    // Vérifie si tous les champs obligatoires sont remplis
    if (!formData.nomClient || !formData.modelePC || !formData.dateDebut || !formData.telephoneClient || !formData.email) {
      alert('Veuillez remplir tous les champs obligatoires.'); // Affiche une alerte si les champs sont manquants
      return; // Interrompt la soumission du formulaire
    }

    try {
      // Envoie une requête POST pour enregistrer les données du formulaire
      await axios.post('http://localhost:3001/clients', {
        ordreReparation: ordreReparation,
        nom: formData.nomClient,
        machine: formData.modelePC,
        date: formData.dateDebut,
        description: description,
        etat_materiel: etatMateriel,
        telephone: formData.telephoneClient,
        technicien: formData.technicien,
        numeroSeriePC: formData.numeroSeriePC,
        dateFin: formData.dateFin,
        email: formData.email,
      });

      // Réinitialise les valeurs du formulaire et les états associés
      setFormData(initialFormData);
      setSelectedOptions([]);
      setDescription('');
      setEtatMateriel('');
      setIsSaved(true);

      // Récupère l'historique mis à jour et navigue vers la liste des clients
      fetchHistorique(formData.nomClient);
      navigate('/listesClientelles');
    } catch (error) {
      handleAxiosError(error); // Gestion des erreurs de la requête
    }
  };

  // Fonction pour gérer les changements dans la description des travaux
  const handleDescriptionChange = (desc: string) => {
    setDescription(desc); // Met à jour l'état de la description
  };

  // Fonction pour gérer les changements dans l'état du matériel
  const handleEtatChange = (etat: string) => {
    setEtatMateriel(etat); // Met à jour l'état du matériel
  };

  // Fonction pour gérer les erreurs de requêtes Axios
  const handleAxiosError = (error: any) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Erreur Axios:', axiosError.message); // Affiche le message d'erreur
      if (axiosError.response) {
        console.error('Réponse du serveur:', axiosError.response.data); // Affiche les données de la réponse
        console.error('Statut HTTP:', axiosError.response.status); // Affiche le statut HTTP de la réponse
      }
    } else {
      console.error('Erreur inconnue lors de la requête Axios:', error.message); // Affiche les erreurs non Axios
    }
    alert('Une erreur s\'est produite. Veuillez réessayer.'); // Affiche une alerte à l'utilisateur
  };

  // Rendu du composant
  return (
    <div className="container"> {/* Conteneur principal */}
      <div className="header"> {/* En-tête */}
        <img src={logo} alt="Logo-societe" className="logo-societe" /> {/* Logo de l'entreprise */}
        <h1 className="title">Service Informatique</h1> {/* Titre du composant */}
      </div>
      <div className="form-container"> {/* Conteneur du formulaire */}
        <div className="form" id="pdf-content"> {/* Formulaire avec id pour l'impression */}
          <div className="rectangle"> {/* Conteneur pour le formulaire */}
            <h2>Ordre de Réparation N° {ordreReparation}</h2> {/* Titre avec le numéro d'ordre de réparation */}
            <form onSubmit={handleSubmit}> {/* Formulaire avec gestion de la soumission */}
              <div className="flex-container"> {/* Conteneur pour les champs en flexbox */}
                <div className="flex-item"> {/* Premier élément de flexbox */}
                  <label className="label">Nom client :</label> {/* Étiquette pour le nom du client */}
                  <input
                    type="text"
                    name="nomClient"
                    value={formData.nomClient}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div className="flex-item"> {/* Deuxième élément de flexbox */}
                  <label className="label">Modèle PC :</label> {/* Étiquette pour le modèle du PC */}
                  <input
                    type="text"
                    name="modelePC"
                    value={formData.modelePC}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex-container"> {/* Deuxième ligne de champs en flexbox */}
                <div className="flex-item">
                  <label className="label">Téléphone :</label>
                  <input
                    type="text"
                    name="telephoneClient"
                    value={formData.telephoneClient}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div className="flex-item">
                  <label className="label">Technicien :</label>
                  <input
                    type="text"
                    name="technicien"
                    value={formData.technicien}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex-container"> {/* Troisième ligne de champs en flexbox */}
                <div className="flex-item">
                  <label className="label">Date de début :</label>
                  <input
                    type="date"
                    name="dateDebut"
                    value={formData.dateDebut}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div className="flex-item">
                  <label className="label">Date de fin :</label>
                  <input
                    type="date"
                    name="dateFin"
                    value={formData.dateFin}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex-container"> {/* Quatrième ligne de champs en flexbox */}
                <div className="flex-item">
                  <label className="label">Numéro de série :</label>
                  <input
                    type="text"
                    name="numeroSeriePC"
                    value={formData.numeroSeriePC}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div className="flex-item">
                  <label className="label">Email client :</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
              <OptionsComponent onChange={handleOptionsChange} selectedOptions={selectedOptions} /> {/* Composant pour les options */}
              <DescriptionTravaux onChange={handleDescriptionChange} value={description} /> {/* Composant pour la description des travaux */}
              <EtatMateriel onEtatChange={handleEtatChange} value={etatMateriel} /> {/* Composant pour l'état du matériel */}
              {isSaved && <p className="success-message">Les informations ont été enregistrées avec succès.</p>} {/* Message de succès */}
              <div className="button-container"> {/* Conteneur des boutons */}
                <button type="submit" className="submit-button">
                  Enregistrer
                </button>
                <button type="button" className="list-clients-button" onClick={() => navigate('/listesClientelles')}>
                  Liste des clients
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="historique-table-container"> {/* Conteneur pour le tableau historique */}
          <h2>Historique des Travaux</h2> {/* Titre du tableau */}
          <table className="historique-table"> {/* Table pour afficher l'historique */}
            <thead> {/* En-tête du tableau */}
              <tr>
                <th>Machine</th>
                <th>Date de travail</th>
                <th>Date de fin</th>
                <th>Description</th>
                <th>État du matériel</th>
                <th>Téléphone</th>
                <th>Technicien</th>
                <th>Numéro de série PC</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody> {/* Corps du tableau */}
              {historique.map((item, index) => {
                // Vérifie si le chantier est terminé pour chaque élément
                const chantierTermine = isChantierTermine(item.dateFin);
                return (
                  <tr key={index} className={chantierTermine ? 'termine' : 'en-cours'}> {/* Applique une classe en fonction de l'état du chantier */}
                    <td>{item.machine}</td>
                    <td>{item.date_travail}</td>
                    <td>{item.dateFin}</td>
                    <td>{item.description}</td>
                    <td>{item.etat_materiel}</td>
                    <td>{item.telephone}</td>
                    <td>{item.technicien}</td>
                    <td>{item.numeroSeriePC}</td>
                    <td>{item.email}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceInformatique; // Exportation du composant pour l'utiliser dans d'autres parties de l'application