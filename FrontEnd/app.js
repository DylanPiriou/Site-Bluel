const categories = document.querySelectorAll(".filter-button");
const gallery = document.querySelector(".gallery");

categories.forEach((category) => {
  category.addEventListener("click", (e) => {
    // Récupère la catégorie sélectionnée à partir de l'attribut "data-category"
    const selectedCategory = e.target.getAttribute("data-category");
    // Vide le contenu de la galerie avant de filtrer les données
    gallery.innerHTML = "";
    // Ajoute la classe "active" à l'élément sélectionné
    categories.forEach((category) => category.classList.remove("active"));
    e.target.classList.add("active");
    filterByCategory(selectedCategory);
  });
});

function filterByCategory(category) {
  const filter = new Map();
  filter.set("category1", "");
  filter.set("category2", "Objets");
  filter.set("category3", "Appartements");
  filter.set("category4", "Hotels & restaurants");
  fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => {
      // Filtre les données de l'API en fonction de la catégorie sélectionnée
      let filteredData;
      if (category === "category1") {
        filteredData = data;
      } else {
        const value = filter.get(category);
        filteredData = data.filter((work) => work.category.name === value);
      }
      // Fonction qui permet de créer les éléments
      function handleGalleryElements(item) {
        let figure = document.createElement("figure");
        let img = document.createElement("img");
        img.src = item.imageUrl;
        img.alt = item.title;
        img.setAttribute("crossorigin", "anonymous");
        figure.appendChild(img);
        let figcaption = document.createElement("figcaption");
        figcaption.textContent = item.title;
        figure.appendChild(figcaption);
        return figure;
      }
      // Fonction qui permet d'ajouter les éléments dans la balise "gallery" via une boucle
      function addToGallery(elements) {
        elements.forEach((element) => gallery.appendChild(element));
      }
      // Parcours les éléments filtrés, crée les éléments et les ajoute à la "gallery"
      filteredData.forEach((item) => {
        let element = handleGalleryElements(item);
        addToGallery([element]);
      });
    })
    .catch((error) => console.log(error));
}
// Charge la catégorie "Tous" par défaut au chargement de la page
window.onload = () => {
  filterByCategory("category1");
};

// Formulaire login
const form = document.querySelector("#form-login");

form.addEventListener("submit", (e) => {
  const email = document.querySelector("#mail-login");
  const password = document.querySelector("#password-login");
  const error = document.querySelector("#error");
  const userLogin = {
    email: "sophie.bluel@test.tld",
    password: "S0phie",
  };
  // const { usermail, userpassword } = userLogin;
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
    // window.location.href = "index.html";
    // console.log(JSON.stringify({email: email.value, password: password.value}));
    fetch(`http://localhost:5678/api/users/login`, {
      method: "POST",
      body: JSON.stringify({ email: email.value, password: password.value }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data.token));
  }
});

// Sauvegarder le token dans le localStorage
// function saveJWT(token) {
//   localStorage.setItem("token", token);
// }
