const categoriesBtn = document.querySelectorAll(".filter-button");
const gallery = document.querySelector(".gallery");
const modalWorkGrid = document.querySelector(".modal-work-grid");
let arrayData = [];

// Charge la catégorie "Tous" par défaut au chargement de la page
window.onload = () => {
  filterByCategory("category1");

  // S'il y a un JWT alors montrer l'interface éditable
  const editingBar = document.querySelector('#editing-container')
  const editingBtns = document.querySelectorAll(".editing-btn");
  const token = localStorage.getItem("token");
  token && showEditing();

  // Apparition de l'interface éditable
  function showEditing() {
    editingBar.style.display = "block"
    editingBtns.forEach((item) => (item.style.display = "block"));
  }

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

  // Fonction de filtrage
  function filterByCategory(category) {
    const filter = new Map();
    filter.set("category1", "");
    filter.set("category2", "Objets");
    filter.set("category3", "Appartements");
    filter.set("category4", "Hotels & restaurants");
    getWorks(category, filter)
  }

  function getWorks(category, filter) {
    !!arrayData &&
      fetch("http://localhost:5678/api/works")
        .then((res) => res.json())
        .then((data) => {
          // Les données reçues de l'API sont mises dans le tableau arrayData
          arrayData = data;
          let filteredData;
          if (category === "category1") {
            filteredData = arrayData;
          } else {
            const value = filter.get(category);
            filteredData = arrayData.filter((work) => work.category.name === value);
          }
          handleModal();
          handleGallery(filteredData)
        }).catch(err => console.log(err))
  }

  // Gestion de la modale
  function handleModal() {
    modalBox &&
      arrayData.forEach(item => {
        addImgsToModal(item)
      });
  }

  // Fonction qui permet de créer les éléments
  function addImgsToGallery(item) {
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
    gallery &&
      elements.forEach((element) => gallery.appendChild(element));
  }

  // Parcours les éléments filtrés, crée les éléments et les ajoute à la "gallery"
  function handleGallery(filteredData) {
    filteredData.forEach((item) => {
      let element = addImgsToGallery(item);
      addToGallery([element]);
    })
  }

  // Fonction qui permet d'ajouter les images à la modale
  function addImgsToModal(item) {
    // Création des images
    let imgCard = document.createElement("div");
    imgCard.className = "modal-work-card"
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
      deleteWork(e)
    })
    let titleCard = document.createElement("p");
    titleCard.textContent = "éditer";
    imgCard.appendChild(titleCard);
  }


  // ------------- LOGIQUE DE LA MODALE -------------- //

  // Apparition de la modale au click
  const modal = document.querySelector(".modal-container")
  const modalBox = document.querySelector(".modal-manage-work");
  const modalAddWork = document.querySelector('.modal-add-work')
  if (editingBtns) {
    editingBtns.forEach((item) => {
      item.addEventListener('click', () => {
        modal.style.display = "flex"
        // Permet de revenir tout le temps à la première modale en ouvrant
        modalBox.style.display = "flex";
      })
    })
  }

  // Suppression des travaux
  function deleteWork(e) {
    const imgId = e.target.id;
    fetch(`http://localhost:5678/api/works/${imgId}`, {
      method: 'DELETE',
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).then(res => res.json()).then(data => {
      if (data.success) {
        alert("Votre élément a été supprimé avec succès !")
      }
    }).catch(error => console.log(error))
  }

  // Passer au bloc "ajout photo"
  const btnAddPicture = document.querySelector(".modal-manage-work-btn");

  btnAddPicture.addEventListener("click", () => {
    modalBox.style.display = "none"
    modalAddWork.style.display = "flex"
  });

  // Ajouter le choix des catégories
  const categorySelect = document.querySelector('#category-select')
  let selectedCategoryId;
  function callCategories() {
    fetch(`http://localhost:5678/api/categories`).then(res => res.json()).then(data => {
      data.forEach(category => {
        let option = document.createElement('option')
        option.id = category.id;
        selectedCategoryId = option.id;
        option.textContent = category.name;
        categorySelect.appendChild(option)
        // console.log(option.id)
      })
    }).catch(err => console.log(err))
  }
  callCategories()

  // Voir le rendu de l'image séléctionnée
  const downloadBox = document.querySelector('.download-box')
  const inputFile = document.querySelector('#input-file')
  const imgPreview = document.createElement('img');
  const dlBtn = document.querySelector('.download-btn')
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

  // Ajouter des travaux
  const addWorkBtn = document.querySelector('.modal-add-work-btn')
  let errorMsg = document.createElement('small')
  modalAddWork.appendChild(errorMsg)

  addWorkBtn.addEventListener('click', () => {
    getInputsValue()
  })

  function getInputsValue() {
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
    fetch(`http://localhost:5678/api/works`, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`
      },
    }).then(res => res.json()).then(data => console.log("succès"))
      .catch(err => console.log(err))
  }

  // Logique de la flèche pour revenir en arrière
  const goBack = document.querySelector('.fa-arrow-left-long')

  goBack.addEventListener('click', () => {
    modalAddWork.style.display = "none"
    modalBox.style.display = "flex"
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

}
