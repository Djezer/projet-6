// Main JS

// Sélection des éléments du DOM
const gallery = document.querySelector('.gallery'); // Conteneur pour afficher les travaux
const filters = document.querySelector('.filters'); // Conteneur pour les filtres de catégories
const modalContent = document.querySelector('.modal-content'); // Conteneur pour le contenu de la modal
const logoutButton = document.querySelector('#logout'); // Bouton de déconnexion
const photoInput = document.querySelector('#photo'); // Champ d'entrée pour télécharger des photos
const photoPreview = document.querySelector('#photo-preview'); // Prévisualisation de la photo téléchargée
const previewIcon = photoPreview.querySelector('.preview-icon'); // Icône de prévisualisation
const addPhotoBtn = document.querySelector('#add-photo-btn'); // Bouton pour ajouter une photo
const formAddPhoto = document.querySelector('#modal-form'); // Formulaire pour ajouter une photo
const token = sessionStorage.getItem('token'); // Récupération du jeton d'authentification de la session

// Variables pour stocker les travaux et les catégories
let works = [];
let categories = [];

// Fonction asynchrone pour récupérer les travaux depuis l'API
const getWorks = async () => {
    const response = await fetch('http://localhost:5678/api/works'); // Requête GET vers l'API des travaux
    const data = await response.json(); // Conversion de la réponse en JSON
    works = data; // Assignation des travaux récupérés à la variable works
};

// Fonction asynchrone pour récupérer les catégories depuis l'API
const getCategories = async () => {
    const response = await fetch('http://localhost:5678/api/categories'); // Requête GET vers l'API des catégories
    const data = await response.json(); // Conversion de la réponse en JSON
    categories = data; // Assignation des catégories récupérées à la variable categories
};

// Fonction pour créer et afficher les travaux dans la galerie
const createWorks = (data) => {
    gallery.innerHTML = ''; // Supprimer le contenu précédent de la galerie
    data.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl; // URL de l'image du travail
        img.alt = work.title; // Texte alternatif de l'image

        figcaption.textContent = work.title; // Titre du travail

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure); // Ajout de la figure à la galerie
    });
};

// Fonction asynchrone pour supprimer un travail via l'API
const deleteWork = async (id) => {
    return await fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE', // Méthode HTTP DELETE
        headers: {
            Authorization: `Bearer ${token}` // En-tête d'autorisation avec le jeton
        }
    });
};

// Fonction pour mettre à jour l'interface utilisateur
const updateUI = async () => {
    await getWorks(); // Récupération des travaux
    createWorks(works); // Création des travaux dans la galerie
    createModalWorks(works); // Création des travaux dans la modal
};

// Fonction pour créer et afficher les travaux dans la modal
const createModalWorks = (data) => {
    modalContent.innerHTML = ''; // Efface le contenu précédent de la modal

    data.forEach(work => {
        const container = document.createElement('div');
        container.classList.add('work-container');

        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const deleteButton = document.createElement('button');

        img.src = work.imageUrl; // URL de l'image du travail
        img.alt = work.title; // Texte alternatif de l'image

        // Utiliser une icône de corbeille pour le bouton de suppression
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Icône de corbeille
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', async () => {
            const response = await deleteWork(work.id); // Suppression du travail

            if (response.status === 204) { // Vérification du succès de la suppression
                updateUI(); // Mise à jour de l'interface utilisateur
            }
        });

        figure.appendChild(img);
        container.appendChild(figure);
        container.appendChild(deleteButton);

        modalContent.appendChild(container); // Ajout du conteneur à la modal
    });
};

// Fonction pour filtrer les travaux par catégorie
const filterWorksByCategory = (categoryId) => {
    if (categoryId === 0) {
        // Afficher toutes les œuvres si la catégorie sélectionnée est 'Tous'
        createWorks(works);
    } else {
        // Filtrer les œuvres par catégorie
        const filteredWorks = works.filter(work => work.categoryId === categoryId);
        createWorks(filteredWorks);
    }
};

// Fonction pour créer un bouton de catégorie
const createCategory = (category) => {
    const button = document.createElement('button');
    button.textContent = category.name; // Nom de la catégorie sur le bouton

    button.addEventListener('click', async () => {
        // Supprimer la classe 'selected' de tous les boutons
        document.querySelectorAll('.filters button').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Ajouter la classe 'selected' au bouton cliqué
        button.classList.add('selected');

        filterWorksByCategory(category.id); // Filtrer les travaux par catégorie
    });

    filters.appendChild(button); // Ajout du bouton aux filtres
};

// Fonction pour créer les boutons de catégories
const createCategories = (data) => {
    createCategory({ id: 0, name: 'Tous' }); // Ajout du bouton pour toutes les catégories
    data.forEach(category => {
        createCategory(category); // Création des boutons pour chaque catégorie
    });
};

// Fonction d'initialisation pour charger les travaux et les catégories
const init = async () => {
    await getWorks(); // Récupération des travaux
    createWorks(works); // Création des travaux dans la galerie
    createModalWorks(works); // Création des travaux dans la modal
    await getCategories(); // Récupération des catégories
    createCategories(categories); // Création des boutons de catégories
};

init(); // Appel de la fonction d'initialisation

// Vérification de l'authentification
if (token !== null) {
    console.log('partie admin'); // Mode admin activé
    filters.style.display = 'none'; // Masquer les filtres
    document.querySelector('.admin_banner').style.display = "flex"; // Afficher la bannière admin
    logoutButton.textContent = 'logout'; // Modifier le texte du bouton de déconnexion

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault(); // Empêcher le comportement par défaut du bouton
        sessionStorage.removeItem('token'); // Supprimer le jeton de session
        location.reload(); // Recharger la page
    });
}
