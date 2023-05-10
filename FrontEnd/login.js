// ------------- LOGIQUE DE LA PAGE LOGIN -------------- //

const form = document.querySelector("#form-login");
const email = document.querySelector("#mail-login");
const password = document.querySelector("#password-login");
const error = document.querySelector("#error");

// Soummission du formulaire
form.addEventListener("submit", handleLogin)

// Contrôle du formulaire
function handleLogin(e){
    e.preventDefault();
    const userEmail = email.value.trim()
    const userPassword = password.value.trim()
    if (!userEmail || !userPassword) {
        displayErrorMsg("Veuillez remplir tous les champs.")
    } else {
        login();
    }
}

// Envoie des logins à l'API via méthode POST
function login() {
    fetch(`http://localhost:5678/api/users/login`, {
        method: "POST",
        body: JSON.stringify({
            email: email.value,
            password: password.value
        }),
        headers: {
        "Content-Type": "application/json",
        },
    }).then(res => {
        if(!res.ok){
            displayErrorMsg("Les identifiants de connexion sont incorrectes.")
        } else {
            res.json().then(data => {
                displayErrorMsg("Connexion réussie ! Redirection....", "green")
                let token = data.token;
                token && localStorage.setItem("token", token)
                setTimeout(() => {
                    window.location.replace("index.html")
                }, 1500);
            })
        }}).catch(err => console.log(err))
}

// Fonction pour la gestion des messages d'erreur/réussite
function displayErrorMsg(txt, color){
    password.value = "";
    error.textContent = txt;
    error.style.color = color;
    setTimeout(() => {
      error.textContent = "";
    }, 2000);
}
