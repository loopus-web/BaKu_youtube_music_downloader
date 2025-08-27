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
    errors: {
      searchFailed: "Failed to search. Please try again.",
      downloadFailed: "Failed to download. Please try again."
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
    errors: {
      searchFailed: "Échec de la recherche. Veuillez réessayer.",
      downloadFailed: "Échec du téléchargement. Veuillez réessayer."
    }
  }
};

export type Language = 'en' | 'fr';
export type TranslationKeys = typeof translations.en;