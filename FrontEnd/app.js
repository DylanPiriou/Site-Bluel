// ------------- LOGIQUE DE LA GALLERIE -------------- //

const categoriesBtn = document.querySelectorAll(".filter-button");
const gallery = document.querySelector(".gallery");
const galleryModal = document.querySelector(".modal-work-grid");
let arrayData = []
let filteredData = [];

// Logique de filtrage
function logicForCategory(selectedCategory) {
    const filterMap = new Map();
    filterMap.set("category1", "");
    filterMap.set("category2", "1");
    filterMap.set("category3", "2");
    filterMap.set("category4", "3");
    getWorks(selectedCategory, filterMap)
}

window.onload = () => {
    logicForCategory("category1")
}

// Ajout d'un evenement au clique pour chaque bouton de filtre
function handleCategoryButtons() {
    categoriesBtn.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const selectedCategory = e.target.getAttribute("data-category");
            categoriesBtn.forEach((category) => category.classList.remove("active"));
            e.target.classList.add("active")
            gallery.innerHTML = "";
            galleryModal.innerHTML = "";
            logicForCategory(selectedCategory)
        });
    });
}
handleCategoryButtons()

// Fonction qui recupère les données soit de l'API soit du tableau
function getWorks(selectedCategory, filterMap) {
    if (arrayData.length === 0) {
        fetch("http://localhost:5678/api/works")
            .then((res) => res.json())
            .then((data) => {
                arrayData = data
                filterAndDisplayData(selectedCategory, filterMap)
            }).catch(err => console.log(err))
    } else {
        filterAndDisplayData(selectedCategory, filterMap)
    }
}

// Fonction qui permet de filtrer et afficher la data filtrée
function filterAndDisplayData(selectedCategory, filterMap) {
    if (selectedCategory === "category1") {
        filteredData = arrayData;
    } else {
        const value = parseInt(filterMap.get(selectedCategory));
        filteredData = arrayData.filter((work) => work.categoryId === value);
    }
    fillGalleryWithWorks(filteredData)
    fillModalWithWorks();
}

// CREATION DES TRAVAUX DANS LA GALERIE ET LA MODALE
    // Fonction qui permet de créer les figure dans la galerie
    function createFigureForGallery(item) {
        const figure = document.createElement("figure");
        figure.className = `work${item.id}`;
        figure.innerHTML = `<img src=${item.imageUrl} alt=${item.title} crossorigin="anonymous"><figcaption>${item.title}</figcaption>`
        return figure;
    }

    // Fonction qui permet de créer les figure dans la modale
    function createFigureForModal(item) {
        const figure = document.createElement("figure");
        figure.classList.add("modal-work-card", `work${item.id}`)
        figure.innerHTML = 
        `<img src=${item.imageUrl} alt=${item.title} crossorigin="anonymous">
        <i class="fa-solid fa-arrows-up-down-left-right"></i>
        <button class="fa-solid fa-trash-can itemtrash" id=${item.id}></button>
        <figcaption>éditer</figcaption>`
        const trashBtn = figure.querySelector(".itemtrash");
        handleEventToDelete(trashBtn)
        return figure;
    }

// PARCOURS FILTEREDDATA OU ARRAYDATA ET CREE LES TRAVAUX
    // Pour la galerie
    function fillGalleryWithWorks(filteredData) {
        filteredData.forEach((item) => {
            const work = createFigureForGallery(item);
            gallery.appendChild(work)
        })
    }

    // Pour la modale
    function fillModalWithWorks() {
        arrayData.forEach(item => {
            const work = createFigureForModal(item)
            galleryModal.appendChild(work)
        });
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
            modalManageWork.style.display = "flex";
        })
    })
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
    inputTitle.value = "";
    imgPreview.src = "";
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