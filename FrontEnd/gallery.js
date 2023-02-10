// import { handleModalWithData } from "./editing.js";

// ------------- LOGIQUE DE LA GALLERIE -------------- //

const categoriesBtn = document.querySelectorAll(".filter-button");
const gallery = document.querySelector(".gallery");
const modalWorkGrid = document.querySelector(".modal-work-grid");
export var arrayData = []

// Charge la catégorie "Tous" par défaut au chargement de la page
filterByCategory("category1");

// Ajout d'un event au clique pour chaque bouton de filtre
categoriesBtn.forEach((category) => {
    category.addEventListener("click", (e) => {
        const selectedCategory = e.target.getAttribute("data-category");
        // Vide le contenu de la galerie avant de filtrer les données (page et modale)
        gallery.innerHTML = "";
        modalWorkGrid.innerHTML = "";
        categoriesBtn.forEach((category) => category.classList.remove("active"));
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
                arrayData = data
                filterAllData(category, filter)
                console.log("data from api")
            }).catch(err => console.log(err))
    } else {
        filterAllData(category, filter)
        console.log(arrayData.map(obj => obj.id))
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
    handleGalleryWithData(filteredData)
    handleModalWithData();
}

// Fonction qui permet de créer les éléments dans la gallerie
function createImgsForGallery(item) {
    const figure = document.createElement("figure");
    figure.id = item.id;
    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.title;
    img.id = item.id;
    img.setAttribute("crossorigin", "anonymous");
    figure.appendChild(img);
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = item.title;
    figure.appendChild(figcaption);
    return figure;
}

// Parcours les éléments filtrés, crée les éléments et les ajoute à la "gallery"
function handleGalleryWithData(filteredData) {
    filteredData.forEach((item) => {
        const element = createImgsForGallery(item);
        gallery.appendChild(element)
    })
}

// ------------- LOGIQUE DE L'INTERFACE EDITABLE -------------- //

const body = document.querySelector("body")
const editingBar = document.querySelector('#editing-container')
const editingBtns = document.querySelectorAll(".editing-btn");
const token = localStorage.getItem("token");

// S'il y a un JWT alors montrer l'interface éditable
token && showEditing();

// Apparition de l'interface éditable
function showEditing() {
    body.style.marginTop = "10vh"
    editingBar.style.display = "flex"
    editingBtns.forEach((item) => (item.style.display = "block"));
}

// Apparition de la modale au click
const modal = document.querySelector(".modal-container")
const modalManageWork = document.querySelector(".modal-manage-work");
const modalAddWork = document.querySelector('.modal-add-work')
if (editingBtns) {
    editingBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            modal.style.display = "flex"
            // Permet de revenir tout le temps à la première modale en ouvrant
            modalManageWork.style.display = "flex";
        })
    })
}

// Gestion de la modale
export function handleModalWithData() {
    // modalManageWork &&
        arrayData.forEach(item => {
            createImgsForModal(item)
        });
}

// Fonction qui permet d'ajouter les images à la modale
function createImgsForModal(item) {
    // Création des images
    let imgCard = document.createElement("div");
    imgCard.className = "modal-work-card"
    imgCard.id = item.id;
    let img = document.createElement("img");
    img.src = item.imageUrl;
    img.setAttribute("crossorigin", "anonymous");
    imgCard.appendChild(img);
    modalWorkGrid.appendChild(imgCard);
    // Création des icons
    let arrowIcon = document.createElement('i')
    let trashIcon = document.createElement('i')
    arrowIcon.className = "fa-solid fa-arrows-up-down-left-right"
    trashIcon.className = "fa-solid fa-trash-can"
    trashIcon.id = item.id
    imgCard.appendChild(arrowIcon);
    imgCard.appendChild(trashIcon);
    // Event au click sur l'icon supprimer
    trashIcon.addEventListener('click', (e) => {
        e.preventDefault()
        deleteWork(e)
    })
    let titleCard = document.createElement("p");
    titleCard.textContent = "éditer";
    imgCard.appendChild(titleCard);
}

// Suppression des travaux
const infoMsg = document.querySelector(".info")

function deleteWork(e) {
    const imgId = parseInt(e.target.id);
    fetch(`http://localhost:5678/api/works/${imgId}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status === 204) {
          console.log('Item deleted successfully');
          handleDelete(imgId)
          displayMsgDelete()
        } else if (response.status === 404) {
          console.error('Item not found');
        } else {
          console.error('An error occurred');
        }
      })
      .catch(error => {
        console.error(error);
      });
}

function displayMsgDelete(){
    infoMsg.textContent = "Travail supprimé avec succès !"
    infoMsg.style.color = "green"
    setTimeout(() => {
      infoMsg.textContent = "Supprimer la galerie"
      infoMsg.style.color = "#d65353"
    }, 2000);
}

function handleDelete(id){
    // Cibler l'objet à supprimer
    const workToDelete = arrayData.find(work => work.id === id)
    console.log(workToDelete)
    // Supprimer l'objet
    arrayData = arrayData.filter(function(obj){
        return obj !== workToDelete;
    })
    modalWorkGrid.innerHTML = "";
    handleModalWithData()
    gallery.innerHTML = "";
    arrayData.forEach((item) => {
        const element = createImgsForGallery(item);
        gallery.appendChild(element)
    })
}

// Passer au bloc "ajout photo"
const btnAddPicture = document.querySelector(".modal-manage-work-btn");

btnAddPicture.addEventListener("click", () => {
    modalManageWork.style.display = "none"
    modalAddWork.style.display = "flex"
});

// Logique du choix des catégories
const categorySelect = document.querySelector('#category-select')
let selectedCategoryId;
function getCategories() {
    fetch(`http://localhost:5678/api/categories`).then(res => res.json()).then(data => {
        data.forEach(category => {
            let option = document.createElement('option')
            option.id = category.id;
            selectedCategoryId = option.id;
            option.textContent = category.name;
            categorySelect.appendChild(option)
        })
    }).catch(err => console.log(err))
}
getCategories()

// Voir le rendu de l'image séléctionnée
const downloadBox = document.querySelector('.download-box')
const inputFile = document.querySelector('#input-file')
const imgPreview = document.createElement('img');
imgPreview.className = "img-box"

inputFile.addEventListener('change', () => {
    const file = inputFile.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        imgPreview.src = e.target.result;
        downloadBox.appendChild(imgPreview)
    };

    reader.readAsDataURL(file);
});

// Logique de l'ajout des travaux
const addWorkBtn = document.querySelector('.modal-add-work-btn')
let errorMsg = document.createElement('small')
modalAddWork.appendChild(errorMsg)

addWorkBtn.addEventListener('click', (e) => {
    e.preventDefault()
    handleInputsValueToAddWork()
})

function handleInputsValueToAddWork() {
    let fileValue = inputFile.files[0];
    let titleValue = inputTitle.value;
    let categoryId = +categorySelect.selectedOptions[0].id

    if (!fileValue || !titleValue || !categoryId) {
        errorMsg.textContent = "Tous les champs doivent être remplis."
        errorMsg.style.color = "#D65353"
        setTimeout(() => {
            errorMsg.textContent = ""
        }, 2000);
        inputFile.value = "";
        imgPreview.src = "";
        inputTitle.value = "";
    } else {
        addWork(fileValue, titleValue, categoryId)
        errorMsg.textContent = "Travail ajouté avec succès ! Redirection..."
        errorMsg.style.color = "green"
        setTimeout(() => {
            errorMsg.textContent = ""
        }, 2000);
        inputFile.value = "";
        imgPreview.src = "";
        inputTitle.value = "";
    }
}

function addWork(file, title, category) {
    let formData = new FormData();
    formData.append("image", file)
    formData.append("title", title)
    formData.append("category", category)
    fetch(`http://localhost:5678/api/works`, {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`
        },
    }).then(res => res.json())
      .then(data => {
        setTimeout(() => {
            modalAddWork.style.display = "none";
            modalManageWork.style.display = "flex";
        }, 1500);
        // Ajout dans la modale
        createImgsForModal(data)
        // Ajout das la gallery
        const newWork = createImgsForGallery(data)
        gallery.appendChild(newWork);
      })
      .catch(err => console.log(err))
}

// Logique de la flèche pour revenir en arrière
const goBack = document.querySelector('.fa-arrow-left-long')

goBack.addEventListener('click', () => {
    modalAddWork.style.display = "none"
    modalManageWork.style.display = "flex"
})

// Logique pour fermer la modale
const closeBtns = document.querySelectorAll('.fa-xmark')
const inputTitle = document.querySelector("#title-btn")

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        closeModal()
    })
})

document.addEventListener('click', (e) => {
    e.target === modal && closeModal()
})

function closeModal() {
    modal.style.display = "none"
    inputTitle.value = "";
    imgPreview.src = "";
}