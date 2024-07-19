// Sélection du bouton "Modifier" pour ouvrir la modal 1
document.addEventListener('DOMContentLoaded', () => {
    const buttonModal1 = document.querySelector('#modal1');
    const modal1Container = document.querySelector('#modal-container-1');
    const modal2Container = document.getElementById('modal-container-2');
    const closeModal1 = document.querySelector('#close-modal1');
    const openModal2Button = document.getElementById('open-modal2');
    const closeModal2Button = document.querySelector('.back-to-modal1');

    if (token !== null) {
        buttonModal1.style.display = 'block';
        buttonModal1.addEventListener('click', (e) => {
            e.preventDefault();
            // Afficher la modal 1
            modal1Container.style.display = 'flex';
        });
    }

    closeModal1.addEventListener('click', () => {
        // Cacher la modal 1 lorsque le bouton de fermeture est cliqué
        modal1Container.style.display = 'none';
    });

    if (openModal2Button) {
        // Ajout d'un événement au clic sur le bouton "Ajouter une photo"
        openModal2Button.addEventListener('click', () => {
            // Cacher la modal 1 en modifiant son style
            modal1Container.style.display = 'none';

            // Afficher la modal 2 en modifiant son style
            modal2Container.style.display = 'flex';
        });

        // Ajout d'un événement au clic sur le bouton de retour à la modal 1
        closeModal2Button.addEventListener('click', () => {
            // Cacher la modal 2 lorsque le bouton de retour est cliqué
            modal2Container.style.display = 'none';

            // Afficher la modal 1 en modifiant son style
            modal1Container.style.display = 'flex';
        });
    }
});

// Gestion de l'ajout d'une photo dans la modal 2
document.querySelector('#photo').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const preview = document.querySelector('#photo-preview');
    validateForm();

    if (file) {
        const objectURL = URL.createObjectURL(file);
        const img = document.createElement('img');
        img.src = objectURL;
        img.alt = 'photo preview';

        // Vider le conteneur d'aperçu et ajouter l'image
        preview.innerHTML = '';
        preview.appendChild(img);
    } else {
        // Réinitialiser le conteneur si aucun fichier n'est sélectionné
        preview.innerHTML = '<span>Ajouter une photo</span>';
    }
});


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
        updateUI()
        formAddPhoto.reset();
        modal1Container.style.display = 'flex';
        modal2Container.style.display = 'none';
    }

})


const validateForm = () => {
    const imgValue = document.querySelector('#photo').files[0];
    const titleValue = document.querySelector('#title').value;
    const categoryValue = document.querySelector('#category').value;

    const submitButton = document.querySelector('#submit');

    if (imgValue && titleValue !== '' && categoryValue !== '0') {
        submitButton.style.backgroundColor = '#1D6154';
        submitButton.disabled = false;
        return;
    }

    submitButton.style.backgroundColor = '#a7a7a7';
    submitButton.disabled = true;
}

document.querySelector('#title').addEventListener('input', validateForm);
document.querySelector('#category').addEventListener('input', validateForm);
