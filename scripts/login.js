const form = document.querySelector('#form')

const email = document.querySelector('#email')
const password = document.querySelector('#password')

// Fonction pour effectuer la requête de connexion
const login = async (credentials) => {
    return await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
}

// Écouteur d'événement pour le formulaire de connexion
form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const data = new FormData(form)

    const credentials = {
        email: data.get('email'),
        password: data.get('password')
    }

    const response = await login(credentials)
    const user = await response.json()

    // Supprimer les anciens messages d'erreur
    const existingError = document.querySelector('.error-message')
    if (existingError) {
        existingError.remove()
    }

    if (response.status === 401 || response.status === 404) {
        const errorMessage = document.createElement('p')
        errorMessage.textContent = 'Adresse e-mail ou mot de passe incorrect.'
        errorMessage.classList.add('error-message')
        form.insertBefore(errorMessage, form.querySelector('input[type="submit"]'))
    }

    if (response.ok) {
        console.log(user.token)
        sessionStorage.setItem('token', user.token)
        window.location.assign('/')
    }
})
