// ------------- LOGIQUE DE LA GALLERIE -------------- //

const categoriesBtn = document.querySelectorAll(".filter-button");
const gallery = document.querySelector(".gallery");
const modalWorkGrid = document.querySelector(".modal-work-grid");
let arrayData = [];

// Charge la catégorie "Tous" par défaut au chargement de la page
window.onload = () => {
  filterByCategory("category1");


  // Ajout d'un event au clique pour chaque bouton de filtre
  categoriesBtn.forEach((category) => {
    category.addEventListener("click", (e) => {
      // Récupère la catégorie sélectionnée à partir de l'attribut "data-category"
      const selectedCategory = e.target.getAttribute("data-category");
      // Vide le contenu de la galerie avant de filtrer les données (page et modale)
      gallery.innerHTML = "";
      modalWorkGrid.innerHTML = "";
      // Supprime la classe "active" des boutons
      categoriesBtn.forEach((category) => category.classList.remove("active"));
      // Ajoute la classe "active" à l'élément sélectionné
      e.target.classList.add("active");
      filterByCategory(selectedCategory);
    });
  });

  // Logique de filtrage
  function filterByCategory(category) {
    const filter = new Map();
    filter.set("category1", "");
    filter.set("category2", "Objets");
    filter.set("category3", "Appartements");
    filter.set("category4", "Hotels & restaurants");
    getWorks(category, filter)
  }

  // Fonction qui recupère les données soit de l'API soit du tableau
  function getWorks(category, filter) {
    if (arrayData.length === 0) {
      fetch("http://localhost:5678/api/works")
        .then((res) => res.json())
        .then((data) => {
          // Les données reçues de l'API sont mises dans le tableau arrayData
          arrayData = data;
          filterAllData(category, filter)
        }).catch(err => console.log(err))
    } else {
      filterAllData(category, filter)
    }
  }

  // Fonction qui permet de filtrer la data
  function filterAllData(category, filter) {
    let filteredData;
    if (category === "category1") {
      // On affiche tout
      filteredData = arrayData;
    } else {
      // On filtre l'affichage en fonction du nom de la catégorie
      const value = filter.get(category);
      filteredData = arrayData.filter((work) => work.category.name === value);
    }
    handleModal();
    handleGallery(filteredData)
  }

  // Fonction qui permet de créer les éléments dans la gallerie
  function addImgsToGallery(item) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.title;
    img.setAttribute("crossorigin", "anonymous");
    figure.appendChild(img);
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = item.title;
    figure.appendChild(figcaption);
    return figure;
  }

  // Parcours les éléments filtrés, crée les éléments et les ajoute à la "gallery"
  function handleGallery(filteredData) {
    filteredData.forEach((item) => {
      const element = addImgsToGallery(item);
      addToGallery(element);
    })
  }

  // Fonction qui permet d'ajouter les éléments dans la balise "gallery" via une boucle
  function addToGallery(element) {
    gallery &&
      gallery.appendChild(element)
  }
}