const form = document.querySelector('#form')

const email = document.querySelector('#email')
const password = document.querySelector('#password')

const login = async (credentials) => {

    return await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
}

form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const data = new FormData(form)

    const credentials = {
        email: data.get('email'),
        password: data.get('password')
    }

    const response = await login(credentials)
    const user = await response.json()


    if (response.status === 401 || response.status === 404) {
        console.log('erreur du login')
    }

    if (response.ok) {
        console.log(user.token)
        sessionStorage.setItem('token', user.token)
        window.location.assign('/')
    }

})