import axios, { AxiosError } from 'axios';

export const fetchNumeroOrdre = async () => {
  try {
    const response = await axios.get<number>('http://localhost:3001/numeroReparation');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError; // Cast explicite pour indiquer à TypeScript que c'est une AxiosError
      console.error('Erreur Axios lors de la récupération du numéro d\'ordre :', axiosError.message);
      if (axiosError.response) {
        console.error('Réponse du serveur :', axiosError.response.data);
        console.error('Statut HTTP :', axiosError.response.status);
      }
    } else {
      // Si ce n'est pas une AxiosError, vous pouvez traiter comme une erreur générique
      console.error('Erreur inconnue lors de la requête Axios :', error);
    }
    throw error; // Rejette l'erreur pour que le composant appelant puisse la gérer
  }
};
