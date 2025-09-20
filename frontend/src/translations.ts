export const translations = {
  en: {
    header: {
      title: "BaKu Music Downloader",
      subtitle: "Discover the magic of music"
    },
    search: {
      placeholder: "Enter song title (e.g., 'Waiting Bob Marley')",
      button: "Search",
      searching: "Searching..."
    },
    download: {
      button: "Download MP3",
      waiting: "Waiting...",
      downloading: "Downloading...",
      processing: "Converting...",
      queue: {
        title: "Download Queue",
        waiting: "Waiting...",
        downloading: "Downloading",
        processing: "Converting to MP3...",
        completed: "Completed",
        error: "Error",
        retry: "Retry",
        remove: "Remove",
        downloadFailed: "Download failed"
      }
    },
    preview: {
      listen: "Preview",
      stop: "Stop preview",
      loading: "Loading preview..."
    },
    pagination: {
      previous: "Previous",
      next: "Next",
      pageInfo: "Page {current} of {total}",
      totalResults: "Total results: {count}"
    },
    errors: {
      searchFailed: "Failed to search. Please try again.",
      downloadFailed: "Failed to download. Please try again.",
      previewFailed: "Failed to load preview. Please try again."
    }
  },
  fr: {
    header: {
      title: "BaKu Téléchargeur de Musique",
      subtitle: "Découvrez la magie de la musique"
    },
    search: {
      placeholder: "Entrez le titre de la chanson (ex: 'Waiting Bob Marley')",
      button: "Rechercher",
      searching: "Recherche..."
    },
    download: {
      button: "Télécharger MP3",
      waiting: "En attente...",
      downloading: "Téléchargement...",
      processing: "Conversion...",
      queue: {
        title: "File de téléchargement",
        waiting: "En attente...",
        downloading: "Téléchargement",
        processing: "Conversion en MP3...",
        completed: "Terminé",
        error: "Erreur",
        retry: "Réessayer",
        remove: "Supprimer",
        downloadFailed: "Échec du téléchargement"
      }
    },
    preview: {
      listen: "Écouter un extrait",
      stop: "Arrêter l'extrait",
      loading: "Chargement de l'extrait..."
    },
    pagination: {
      previous: "Précédent",
      next: "Suivant",
      pageInfo: "Page {current} sur {total}",
      totalResults: "Résultats totaux : {count}"
    },
    errors: {
      searchFailed: "Échec de la recherche. Veuillez réessayer.",
      downloadFailed: "Échec du téléchargement. Veuillez réessayer.",
      previewFailed: "Échec du chargement de l'extrait. Veuillez réessayer."
    }
  }
};

export type Language = 'en' | 'fr';
export type TranslationKeys = typeof translations.en;