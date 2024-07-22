// Main JS
const gallery = document.querySelector('.gallery');
const filters = document.querySelector('.filters');
const modalContent = document.querySelector('.modal-content');
const logoutButton = document.querySelector('#logout');
const photoInput = document.querySelector('#photo');
const photoPreview = document.querySelector('#photo-preview');
const previewIcon = photoPreview.querySelector('.preview-icon');
const addPhotoBtn = document.querySelector('#add-photo-btn');
const formAddPhoto = document.querySelector('#modal-form');
const token = sessionStorage.getItem('token');

let works = [];
let categories = [];

const getWorks = async () => {
    const response = await fetch('http://localhost:5678/api/works');
    const data = await response.json();
    works = data;
};

const getCategories = async () => {
    const response = await fetch('http://localhost:5678/api/categories');
    const data = await response.json();
    categories = data;
};

const createWorks = (data) => {
    gallery.innerHTML = ''; // Supprimer le contenu précédent de la galerie
    data.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl;
        img.alt = work.title;

        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    });
};

const deleteWork = async (id) => {
    return await fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const updateUI = async () => {
    await getWorks();
    createWorks(works);
    createModalWorks(works);
};

const createModalWorks = (data) => {
    modalContent.innerHTML = ''; // Efface le contenu précédent de la modal

    data.forEach(work => {
        const container = document.createElement('div');
        container.classList.add('work-container');

        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const deleteButton = document.createElement('button');

        img.src = work.imageUrl;
        img.alt = work.title;

        // Utiliser une icône de corbeille pour le bouton de suppression
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Icône de corbeille
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', async () => {
            const response = await deleteWork(work.id);

            if (response.status === 204) {
                updateUI();
            }
        });

        figure.appendChild(img);
        container.appendChild(figure);
        container.appendChild(deleteButton);

        modalContent.appendChild(container);
    });
};

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

const createCategory = (category) => {
    const button = document.createElement('button');
    button.textContent = category.name;

    button.addEventListener('click', async () => {
        // Supprimer la classe 'selected' de tous les boutons
        document.querySelectorAll('.filters button').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Ajouter la classe 'selected' au bouton cliqué
        button.classList.add('selected');

        filterWorksByCategory(category.id);
    });

    filters.appendChild(button);
};

const createCategories = (data) => {
    createCategory({ id: 0, name: 'Tous' });
    data.forEach(category => {
        createCategory(category);
    });
};

const init = async () => {
    await getWorks();
    createWorks(works);
    createModalWorks(works); // Appel de la fonction createModalWorks après la récupération des œuvres
    await getCategories();
    createCategories(categories);
};

init();

if (token !== null) {
    console.log('partie admin');
    filters.style.display = 'none';
    document.querySelector('.admin_banner').style.display = "flex";
    logoutButton.textContent = 'logout';

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('token');
        location.reload();
    });
}
