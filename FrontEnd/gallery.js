// ------------- LOGIQUE DE LA GALLERIE -------------- //

const categoriesBtn = document.querySelectorAll(".filter-button");
const gallery = document.querySelector(".gallery");
const modalWorkGrid = document.querySelector(".modal-work-grid");
let arrayData = [];

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
        console.log(arrayData)
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
token && showEditingMode();

// Apparition de l'interface éditable
function showEditingMode() {
    body.style.marginTop = "10vh"
    editingBar.style.display = "flex"
    editingBtns.forEach((btn) => (btn.style.display = "block"));
}

// Apparition de la modale au click
const modal = document.querySelector(".modal-container")
const modalManageWork = document.querySelector(".modal-manage-work");
const modalAddWork = document.querySelector('.modal-add-work')
if (editingBtns) {
    editingBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            showModal()
        })
    })
}

function showModal() {
    modal.style.display = "flex"
    modalManageWork.style.display = "flex";
}

// Gestion de la modale avec le contenu de arrayData
function handleModalWithData() {
    showModal &&
        arrayData.forEach(item => {
            createImgsForModal(item)
        });
}

// Fonction qui permet de créer les images dans la modale
function createImgsForModal(item) {
    const figure = document.createElement("figure");
    figure.className = "modal-work-card"
    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.title;
    img.id = item.id;
    img.setAttribute("crossorigin", "anonymous");
    figure.appendChild(img);
    modalWorkGrid.appendChild(figure);
    const arrowIcon = document.createElement('i')
    const trashIcon = document.createElement('i')
    arrowIcon.className = "fa-solid fa-arrows-up-down-left-right"
    trashIcon.className = "fa-solid fa-trash-can"
    trashIcon.id = item.id
    figure.appendChild(arrowIcon);
    figure.appendChild(trashIcon);
    // Event au click sur l'icon supprimer
    handleDeleteEvent(trashIcon)
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = "éditer";
    figure.appendChild(figcaption);
}

function handleDeleteEvent(element) {
    element.addEventListener('click', (e) => {
        e.preventDefault()
        const imgId = e.target.id;
        deleteWork(imgId)
    })
}

// Suppression des travaux
function deleteWork(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(res => {
        if (!res.ok) {
            throw new Error("Erreur lors de la suppression")
        } else {
            // gallery.innerHTML = "";
            // modalWorkGrid.innerHTML = "";
            // newData = arrayData.filter(work => work.id !== id)
            let index = arrayData.findIndex(work => work.id === id);
            if (index !== -1) {
              arrayData.splice(index, 1);
            }
        }
        // handleGalleryWithData(newData)
        // handleModalWithData();
    }).catch(error => console.log(error))
}

// Passer au bloc "ajout photo"
const btnAddPicture = document.querySelector(".modal-manage-work-btn");

btnAddPicture.addEventListener("click", () => {
    modalManageWork.style.display = "none"
    modalAddWork.style.display = "flex"
});

// Logique du choix des catégories
const categorySelect = document.querySelector('#category-select')
function getCategories() {
    fetch(`http://localhost:5678/api/categories`).then(res => res.json()).then(data => {
        data.map(category => {
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
    e.stopPropagation()
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
        errorMsg.textContent = "Contenu ajouté avec succès !"
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
    const newWork = {
        file: file,
        title: title,
        category: category
        };
    fetch(`http://localhost:5678/api/works`, {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`
        },
    }).then(res => {
        if (res.ok) {
            res.json();
            arrayData.push(newWork);
        }}).catch(err => console.log(err))
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