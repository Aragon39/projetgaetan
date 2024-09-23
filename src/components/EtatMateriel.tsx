import React, { ChangeEvent } from 'react'; // Importe React et ChangeEvent depuis la bibliothèque 'react'
import './EtatMateriel.css'; // Importe le fichier CSS pour styliser le composant

// Définition des types pour les props
interface EtatMaterielProps {
  onEtatChange: (etat: string) => void; // Fonction appelée lorsqu'il y a un changement d'état
  value: string; // Valeur actuelle de l'état
}

// Composant de l'état du matériel
const EtatMateriel: React.FC<EtatMaterielProps> = ({ onEtatChange, value }) => {
  // Fonction pour gérer le changement de l'état
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Appelle la fonction de rappel pour informer le parent du changement d'état
    onEtatChange(e.target.value);
  };

  // Rendu du composant
  return (
    <div className="etat-materiel"> {/* Conteneur principal du composant */}
      {/* Label pour l'état du matériel */}
      <label className="etat-label">Etat du matériel :</label> {/* Étiquette décrivant le champ de saisie */}
      {/* Champ de saisie pour l'état */}
      <input
        type="text" // Type du champ d'entrée est texte
        value={value} // Valeur actuelle du champ est passée en tant que prop
        onChange={handleChange} // Fonction appelée lors de la modification du champ
        className="etat-textarea" // Classe CSS appliquée pour le style du champ
      />
    </div>
  );
};

export default EtatMateriel; // Exporte le composant pour qu'il puisse être utilisé dans d'autres parties de l'application