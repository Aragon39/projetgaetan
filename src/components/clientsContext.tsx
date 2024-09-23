import React, { createContext, useContext, useState } from 'react';

// Définition de la structure des données d'un client
interface ClientData {
  nom: string;
  machine: string;
  date: string;
}

// Définition du type du contexte des clients
interface ClientsContextType {
  clients: ClientData[]; // Liste des clients
  addClient: (client: ClientData) => void; // Fonction pour ajouter un client
}

// Création du contexte des clients
export const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte des clients
export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};

// Composant fournisseur du contexte des clients
export const ClientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // État local pour stocker la liste des clients
  const [clients, setClients] = useState<ClientData[]>([]);

  // Fonction pour ajouter un client à la liste
  const addClient = (client: ClientData) => {
    setClients([...clients, client]);
  };

  // Valeur fournie par le contexte des clients
  const value: ClientsContextType = {
    clients,
    addClient,
  };

  // Rendu du composant avec le contexte fourni
  return <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>;
};