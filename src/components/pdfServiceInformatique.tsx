import jsPDF from 'jspdf'; // Importation de la bibliothèque jsPDF pour la création de fichiers PDF
import html2canvas from 'html2canvas'; // Importation de la bibliothèque html2canvas pour la conversion d'éléments HTML en images

// Définition de l'interface pour les données du formulaire
interface FormData {
  nomClient: string; // Nom du client
  telephoneClient: string; // Numéro de téléphone du client
  dateDebut: string; // Date de début du service
  dateFin: string; // Date de fin du service
  modelePC: string; // Modèle du PC
  technicien: string; // Nom du technicien
  numeroSeriePC: string; // Numéro de série du PC
  email: string; // Adresse email du client
}

// Définition de l'interface pour les données d'historique
interface HistoriqueData {
  machine: string; // Machine ou modèle
  dateDebut: string; // Date de début du travail
  dateFin: string; // Date de fin du travail
  description: string; // Description du travail effectué
  etat_materiel: string; // État du matériel
  telephone: string; // Numéro de téléphone
  technicien: string; // Nom du technicien
  numeroSeriePC: string; // Numéro de série du PC
  email: string; // Adresse email du client
}

// Fonction pour générer un fichier PDF à partir du contenu HTML
export const generateServiceInformatiquePDF = async (formData: FormData, historique: HistoriqueData[], ordreReparation: number) => {
  try {
    // Sélectionne l'élément HTML à convertir en PDF
    const input = document.getElementById('pdf-content') as HTMLElement;
    if (!input) {
      throw new Error('Element with id "pdf-content" not found.'); // Lance une erreur si l'élément HTML n'est pas trouvé
    }

    // Convertit l'élément HTML en une image avec html2canvas
    const canvas = await html2canvas(input, { scale: 2 }); // Augmente l'échelle pour améliorer la qualité de l'image
    const imgData = canvas.toDataURL('image/png'); // Convertit le contenu du canvas en une URL de données au format PNG

    // Crée une instance de jsPDF pour générer le fichier PDF
    const pdf = new jsPDF('p', 'mm', 'a4'); // Crée un PDF en orientation portrait (p), unités en millimètres (mm), taille A4
    const pdfWidth = pdf.internal.pageSize.getWidth(); // Obtient la largeur de la page PDF
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Calcule la hauteur du PDF en fonction de la largeur et de la hauteur de l'image

    // Ajoute l'image à la page PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); // Ajoute l'image PNG à la position (0, 0) avec la largeur et hauteur spécifiées
    pdf.save(`Ordre_Reparation_${ordreReparation}.pdf`); // Enregistre le PDF avec un nom de fichier incluant le numéro d'ordre de réparation
  } catch (error) {
    console.error('Erreur lors de la génération du PDF :', error); // Affiche l'erreur en cas de problème lors de la génération du PDF
    alert('Une erreur s\'est produite lors de la génération du PDF. Veuillez réessayer.'); // Affiche un message d'alerte à l'utilisateur
  }
};