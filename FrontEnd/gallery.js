// ------------- LOGIQUE DE LA GALLERIE -------------- //

const categoriesBtn = document.querySelectorAll(".filter-button");
const gallery = document.querySelector(".gallery");
const modalWorkGrid = document.querySelector(".modal-work-grid");
let arrayData = []

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
                arrayData = data // Les données reçues de l'API sont mises dans le tableau arrayData
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
        filteredData = arrayData; // On affiche tout
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
    figure.className = `work${item.id}`;
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

// S'il y a un JWT dans le localStorage alors montrer l'interface éditable
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

// Repmlissage de la modale grâce aux données de arrayData
function handleModalWithData() {
        arrayData.forEach(item => {
            createImgsForModal(item)
        });
}

// Fonction qui permet d'ajouter les images à la modale
function createImgsForModal(item) {
    // Création des images
    let imgCard = document.createElement("div");
    imgCard.classList.add("modal-work-card", `work${item.id}`)
    // imgCard.id = item.id;
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
    handleEventToDelete(trashIcon)
    let titleCard = document.createElement("p");
    titleCard.textContent = "éditer";
    imgCard.appendChild(titleCard);
}

// -------------- SUPPRESSION DE TRAVAUX ---------------- // 

function handleEventToDelete(element){
    element.addEventListener('click', (e) => {
        e.preventDefault()
        deleteWork(e)
    })
}

const infoMsg = document.querySelector(".info")

// Fonction pour supprimer un travail avec l'API
function deleteWork(e) {
    const imgId = e.target.id;
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

// Fonction pour actualiser l'interface de manière dynamique
function handleDelete(id){
    // Cibler l'objet à supprimer
    console.log(arrayData)
    const workToDelete = arrayData.find(work => work.id === id)
    // Supprimer l'objet et actualiser arrayData
    arrayData = arrayData.filter(function(obj){
        return obj !== workToDelete;
    })
    console.log(arrayData)

    // Actualiser la modale
    modalWorkGrid.innerHTML = "";
    handleModalWithData()

    // Actualiser la gallerie
    gallery.innerHTML = "";
    arrayData.forEach((item) => {
        const element = createImgsForGallery(item);
        gallery.appendChild(element)
    })

    // Récupération des éléments qui ont les classe "work${id}"
    const figures = document.querySelectorAll(`.work${id}`);
    const divs = document.querySelectorAll(`work${id}`);

    // Logique pour supprimer les éléments "figure" et "div" qui ont une classe qui contient l'id
    figures.forEach((figure) => figure.remove());
    divs.forEach((div) => div.remove());
}

function displayMsgDelete(){
    infoMsg.textContent = "Travail supprimé avec succès !"
    infoMsg.style.color = "green"
    setTimeout(() => {
      infoMsg.textContent = "Supprimer la galerie"
      infoMsg.style.color = "#d65353"
    }, 2000);
}

// ----------------- AJOUT DE TRAVAUX DANS LA MODALE ----------------- //

// Logique du choix des catégories dans le formulaire
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

// Logique de l'ajout des travaux dans la modale
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
        handleInfosMsgToAddWork("Tous les champs doivent être remplis.", "#D65353")
    } else {
        addWork(fileValue, titleValue, categoryId)
        handleInfosMsgToAddWork("Travail ajouté avec succès ! Redirection...", "green")
    }
}

function handleInfosMsgToAddWork(msg, color){
    errorMsg.textContent = msg
    errorMsg.style.color = color
    setTimeout(() => {
        errorMsg.textContent = ""
    }, 2000);
    inputFile.value = "";
    imgPreview.src = "";
    inputTitle.value = "";
}

// Appel à l'API pour ajouter des travaux
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
        // Ajout dans la gallery
        const newWork = createImgsForGallery(data)
        gallery.appendChild(newWork);
      })
      .catch(err => console.log(err))
}

// --------------- NAVIGATION DANS LA MODALE --------------- //

// Passer au bloc "ajout photo"
const btnAddPicture = document.querySelector(".modal-manage-work-btn");

btnAddPicture.addEventListener("click", () => {
    modalManageWork.style.display = "none"
    modalAddWork.style.display = "flex"
});

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