// Formulaire login
const form = document.querySelector("#form-login");
const email = document.querySelector("#mail-login");
const password = document.querySelector("#password-login");
const error = document.querySelector("#error");
const userLogin = {
  email: "sophie.bluel@test.tld",
  password: "S0phie",
};

form.addEventListener("submit", handleLogin)


function handleLogin(e){
    e.preventDefault();
    // Logique connexion
    if (email.value === "" || password.value === "") {
        email.value = "";
        password.value = "";
        error.textContent = "Tous les champs doivent être remplis.";
        setTimeout(() => {
          error.textContent = "";
        }, 2000);
    } else if (
        email.value !== userLogin.email ||
        password.value !== userLogin.password
    ) {
        email.value = "";
        password.value = "";
        error.textContent = "Les informations saisies ne sont pas correctes.";
        setTimeout(() => {
          error.textContent = "";
        }, 2000);
    } else {
        login();
    }
}

// Envoie des logins à l'API via POST
function login() {
    fetch(`http://localhost:5678/api/users/login`, {
        method: "POST",
        body: JSON.stringify({
        email: email.value,
        password: password.value,
        }),
        headers: {
        "Content-Type": "application/json",
        },
    }).then(res => res.json()).then(data => {
        // Si on reçoit le JWT alors stockage dans le localStorage
        data.token &&
            localStorage.setItem("token", data.token);
            window.location.replace("index.html");
    })
}