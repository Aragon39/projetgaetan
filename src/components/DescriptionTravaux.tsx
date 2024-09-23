import React, { ChangeEvent } from 'react';
import './DescriptionTravaux.css'; // Import du fichier CSS

// Définition des types pour les props
interface DescriptionTravauxProps {
  onChange: (description: string) => void; // Fonction qui sera appelée lorsque la description est modifiée, elle prend une chaîne de caractères en argument et ne retourne rien.
  value: string; // Représente la valeur actuelle de la description qui sera affichée dans le champ de texte.
}

// Composant de la description des travaux
const DescriptionTravaux: React.FC<DescriptionTravauxProps> = ({ onChange, value }) => {
  // Fonction pour gérer le changement dans la description
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // Appelle la fonction de rappel pour informer le parent du changement dans la description
    onChange(e.target.value);
  };

  // Rendu du composant
  return (
    <div className="description-travaux">
      {/* Élément pour la description */}
      <div className="description-label">Description :</div>
      {/* Champ de texte pour la description */}
      <textarea
        value={value}
        onChange={handleChange}
        className="description-textarea"
      />
    </div>
  );
};

export default DescriptionTravaux;