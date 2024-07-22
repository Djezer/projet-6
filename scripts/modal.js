document.addEventListener('DOMContentLoaded', () => {
    const buttonModal1 = document.querySelector('#modal1');
    const modal1Container = document.querySelector('#modal-container-1');
    const modal2Container = document.querySelector('#modal-container-2');
    const closeModal1 = document.querySelector('#close-modal1');
    const openModal2Button = document.getElementById('open-modal2');
    const closeModal2Button = document.querySelector('#close-modal2');
    const backToModal1Button = document.querySelector('.back-to-modal1');
    const photoInput = document.querySelector('#photo');
    const photoPreview = document.querySelector('#photo-preview');
    const addPhotoBtn = document.querySelector('#add-photo-btn');
    const formAddPhoto = document.querySelector('#modal-form');

    // Fonction pour réinitialiser la prévisualisation des photos
    const resetPhotoPreview = () => {
        photoPreview.innerHTML = '<i class="fa-solid fa-image preview-icon"></i><button type="button" id="add-photo-btn">+ Ajouter photo</button><p class="file-info">jpg, png : 4 Mo max</p>';
        document.querySelector('#add-photo-btn').addEventListener('click', () => {
            photoInput.click();
        });
    };

    // Fonction de prévisualisation de la photo
    const handlePhotoPreview = (file) => {
        if (file) {
            const objectURL = URL.createObjectURL(file);
            const img = document.createElement('img');
            img.src = objectURL;
            img.alt = 'photo preview';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            photoPreview.innerHTML = '';
            photoPreview.appendChild(img);
            previewIcon.style.display = 'none';
        } else {
            resetPhotoPreview();
        }
    };

    // Gestion de la prévisualisation de la photo lors de la sélection du fichier
    photoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        handlePhotoPreview(file);
        validateForm();
    });

    // Gestion du clic sur le bouton "Ajouter photo" pour ouvrir le sélecteur de fichiers
    addPhotoBtn.addEventListener('click', function () {
        photoInput.click();
    });

    // Fonction de validation du formulaire
    const validateForm = () => {
        const imgValue = photoInput.files[0];
        const titleValue = document.querySelector('#title').value;
        const categoryValue = document.querySelector('#category').value;

        const submitButton = document.querySelector('#submit');

        if (imgValue && titleValue !== '' && categoryValue !== '0') {
            submitButton.style.backgroundColor = '#1D6154';
            submitButton.disabled = false;
        } else {
            submitButton.style.backgroundColor = '#a7a7a7';
            submitButton.disabled = true;
        }
    };

    // Ajouter des événements d'entrée pour valider le formulaire en temps réel
    document.querySelector('#title').addEventListener('input', validateForm);
    document.querySelector('#category').addEventListener('input', validateForm);

    // Vérifier et afficher le bouton "Modifier" si nécessaire
    if (token !== null) {
        buttonModal1.style.display = 'block';
        buttonModal1.addEventListener('click', (e) => {
            e.preventDefault();
            modal1Container.style.display = 'flex';
        });
    }

    // Gestion du clic sur le bouton de fermeture de la modal 1
    closeModal1.addEventListener('click', () => {
        modal1Container.style.display = 'none';
    });

    // Gestion du clic sur le bouton "Ajouter une photo" pour ouvrir la modal 2
    if (openModal2Button) {
        openModal2Button.addEventListener('click', () => {
            modal1Container.style.display = 'none';
            modal2Container.style.display = 'flex';
        });
    }

    // Gestion du clic sur le bouton de retour à la modal 1
    if (backToModal1Button) {
        backToModal1Button.addEventListener('click', () => {
            modal2Container.style.display = 'none';
            modal1Container.style.display = 'flex';
            resetPhotoPreview(); // Réinitialiser la prévisualisation lorsque l'on retourne à la modal 1
        });
    }

    // Gestion du clic sur le bouton de fermeture de la modal 2
    if (closeModal2Button) {
        closeModal2Button.addEventListener('click', () => {
            modal2Container.style.display = 'none';
            resetPhotoPreview(); // Réinitialiser la prévisualisation lorsque la modal 2 est fermée
            photoInput.value = ''; // Réinitialiser le champ de fichier pour permettre l'ajout d'une nouvelle image
        });
    }

    // Gestion de la soumission du formulaire
    formAddPhoto.addEventListener('submit', async function (e) {
        e.preventDefault();
        const data = new FormData(formAddPhoto);

        try {
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
                modal1Container.style.display = 'flex';
                modal2Container.style.display = 'none';
                resetPhotoPreview(); // Réinitialiser la prévisualisation après l'ajout d'une image
                photoInput.value = ''; // Réinitialiser le champ de fichier après l'ajout d'une image
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la photo:', error);
        }
    });

    // Réinitialiser le bouton "Ajouter photo" lorsque le DOM est chargé
    resetPhotoPreview();
});
