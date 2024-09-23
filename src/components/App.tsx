import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import PageDaccueil from './pageDaccueil';
import ServiceInformatique from './servicesInformatique';
import ListeClientelles from './listesClientelles';
import { ClientsProvider } from './clientsContext'; // Importation du contexte des clients
import HistoriqueClient from './HistoriqueClient';

// Composant principal de l'application
const App: React.FC = () => {
  return (
    <ClientsProvider> {/* Enveloppez les éléments enfants avec <ClientsProvider> pour fournir le contexte des clients */}
      <Routes> {/* Utilisation de Routes pour gérer les différentes routes de l'application */}
        <Route path="/" element={<PageDaccueil />} /> {/* Route vers la page d'accueil */}
        <Route path="/listesClientelles" element={<ListeClientelles />} /> {/* Route vers la liste des clientèles */}
        <Route path="/service-informatique" element={<ServiceInformatique />} /> {/* Route vers le service informatique */}
        <Route path="/historique/:nom" element={<HistoriqueClient />} /> {/* Route pour afficher l'historique des travaux pour un client spécifique */}
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirection vers la page d'accueil pour toutes les autres routes */}
      </Routes>
    </ClientsProvider>
  );
}

export default App;