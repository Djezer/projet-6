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

// Gestion de la prévisualisation de la photo
addPhotoBtn.addEventListener('click', function () {
    photoInput.click(); // Simule un clic sur l'élément de fichier caché
});

photoInput.addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Remplacer le contenu de la zone de prévisualisation par l'image sélectionnée
            photoPreview.innerHTML = `<img src="${e.target.result}" alt="Image preview" style="max-width: 100%; max-height: 100%;">`;
            previewIcon.style.display = 'none'; // Masquer l'icône de prévisualisation
        };

        reader.readAsDataURL(file); // Lire le fichier comme une URL de données
    } else {
        // Si aucun fichier n'est sélectionné, réinitialiser la prévisualisation
        photoPreview.innerHTML = `
                <i class="fa-solid fa-image preview-icon"></i>
                <button type="button" id="add-photo-btn">+ Ajouter photo</button>
                <p class="file-info">jpg, png : 4 Mo max</p>
            `;
    }
});

// Gestion de l'ajout d'une photo
formAddPhoto.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = new FormData(formAddPhoto);

    const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: data,
    });

    if (response.ok) {
        updateUI();
        formAddPhoto.reset();
        document.querySelector('#modal-container-1').style.display = 'flex';
        document.querySelector('#modal-container-2').style.display = 'none';
    }
});


