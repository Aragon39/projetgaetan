import React, { useState, ChangeEvent, useEffect } from 'react'; // Importation de React et des hooks nécessaires
import './OptionsComponents.css'; // Importation du fichier CSS pour le style du composant

// Définition des types pour les props du composant
interface Props {
    onChange: (selectedOptions: string[]) => void; // Fonction de rappel appelée lorsqu'une option est modifiée
    selectedOptions: string[]; // Liste des options actuellement sélectionnées
}

// Composant fonctionnel OptionsComponent
const OptionsComponent: React.FC<Props> = ({ onChange, selectedOptions }) => {
    // État local pour stocker les options disponibles
    const [options, setOptions] = useState<string[]>(selectedOptions);

    // Effet pour mettre à jour les options lorsque les options sélectionnées changent
    useEffect(() => {
        setOptions(selectedOptions); // Met à jour l'état local lorsque les props selectedOptions changent
    }, [selectedOptions]); // Dépendance sur selectedOptions

    // Fonction pour gérer le changement d'une option
    const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target; // Obtient la valeur de la case à cocher qui a été modifiée

        // Met à jour les options en fonction de la sélection de l'utilisateur
        const updatedOptions = options.includes(value)
            ? options.filter(option => option !== value) // Retire l'option si elle est déjà sélectionnée
            : [...options, value]; // Ajoute l'option si elle n'est pas déjà sélectionnée

        setOptions(updatedOptions); // Met à jour l'état local avec les options modifiées
        onChange(updatedOptions); // Appelle la fonction de rappel pour informer le parent des changements d'options
    };

    // Rendu du composant
    return (
        <div className="options-container"> {/* Conteneur principal pour les options */}
            {/* Options avec des cases à cocher */}
            <label className="option-label"> {/* Étiquette pour la case à cocher */}
                <input
                    type="checkbox" // Type d'entrée est une case à cocher
                    value="Ordinateur" // Valeur associée à la case à cocher
                    onChange={handleOptionChange} // Fonction appelée lorsque la case à cocher change
                    checked={options.includes('Ordinateur')} // Détermine si la case à cocher est cochée
                    className="option-input" // Classe CSS pour la case à cocher
                />
                Ordinateur {/* Texte affiché à côté de la case à cocher */}
            </label>
            <label className="option-label"> {/* Étiquette pour la case à cocher */}
                <input
                    type="checkbox" // Type d'entrée est une case à cocher
                    value="Imprimante" // Valeur associée à la case à cocher
                    onChange={handleOptionChange} // Fonction appelée lorsque la case à cocher change
                    checked={options.includes('Imprimante')} // Détermine si la case à cocher est cochée
                    className="option-input" // Classe CSS pour la case à cocher
                />
                Imprimante {/* Texte affiché à côté de la case à cocher */}
            </label>
            <label className="option-label"> {/* Étiquette pour la case à cocher */}
                <input
                    type="checkbox" // Type d'entrée est une case à cocher
                    value="Ecran" // Valeur associée à la case à cocher
                    onChange={handleOptionChange} // Fonction appelée lorsque la case à cocher change
                    checked={options.includes('Ecran')} // Détermine si la case à cocher est cochée
                    className="option-input" // Classe CSS pour la case à cocher
                />
                Ecran {/* Texte affiché à côté de la case à cocher */}
            </label>
            <label className="option-label"> {/* Étiquette pour la case à cocher */}
                <input
                    type="checkbox" // Type d'entrée est une case à cocher
                    value="Autre" // Valeur associée à la case à cocher
                    onChange={handleOptionChange} // Fonction appelée lorsque la case à cocher change
                    checked={options.includes('Autre')} // Détermine si la case à cocher est cochée
                    className="option-input" // Classe CSS pour la case à cocher
                />
                Autre {/* Texte affiché à côté de la case à cocher */}
            </label>
        </div>
    );
};

export default OptionsComponent; // Exportation du composant pour utilisation dans d'autres parties de l'application