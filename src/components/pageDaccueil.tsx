import React from 'react';
import { Link } from 'react-router-dom'; // Import du composant Link pour la navigation
import './PageDaccueil.css'; // Import du fichier CSS

// Définition du composant PageDaccueil
const PageDaccueil: React.FC = () => {
  return (
    // Conteneur principal de la page d'accueil avec une classe CSS containerStyle
    <div className="containerStyle">
      {/* Conteneur interne avec une classe CSS innerContainerStyle */}
      <div className="innerContainerStyle">
        {/* Lien vers la page de la liste des clientèles en enveloppant le logo */}
        <Link to="/listesClientelles" className="linkStyle">
          <img src={require('../assets/Logo-ordilan.png')} alt="Logo" className="logo imageStyle" />
        </Link>
        {/* Images supplémentaires avec différentes classes CSS */}
        <img src={require('../assets/logo3.png')} alt="Logo 3" className="logo3 imageStyle" />
        <img src={require('../assets/logo5.png')} alt="Logo 5" className="logo5 imageStyle" />
        <img src={require('../assets/logo4.png')} alt="Logo 4" className="logo4 imageStyle" />
        <img src={require('../assets/logo2.png')} alt="Logo 2" className="logo2 imageStyle" />
        <img src={require('../assets/logo1.png')} alt="Logo 1" className="logo1 imageStyle" />
      </div>
    </div>
  );
};

export default PageDaccueil;