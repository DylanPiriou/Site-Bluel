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

function handleInfosMsgToAddWork(msg, color) {
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
            console.log(data.categoryId)
            setTimeout(() => {
                modalAddWork.style.display = "none";
                modalManageWork.style.display = "flex";
            }, 1000);
            // Ajout dans le tableau arrayData
            arrayData.push(data)
            filteredData = arrayData
            // Ajout dans la modale
            galleryModal.innerHTML = "";
            fillModalWithWorks()
            // Ajout dans la gallery
            gallery.innerHTML = "";
            fillGalleryWithWorks(filteredData)
        })
        .catch(err => console.log(err))
}