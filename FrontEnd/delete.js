// -------------- SUPPRESSION DE TRAVAUX ---------------- // 

const infoMsg = document.querySelector(".info")

function handleEventToDelete(element) {
    element.addEventListener('click', (e) => {
        e.preventDefault()
        deleteWork(e)
    })
}

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
function handleDelete(id) {
    // Supprimer le travail correspondant à l'id dans le tableau
    arrayData = arrayData.filter(item => ""+item.id !== ""+id);
    filteredData = arrayData

    // Actualiser la modale
    galleryModal.innerHTML = "";
    fillModalWithWorks()

    // Actualiser la gallerie
    gallery.innerHTML = "";
    fillGalleryWithWorks(filteredData)

    // Récupération des éléments qui ont les classe "work${id}"
    // const works = document.querySelectorAll(`.work${id}`);

    // // Logique pour supprimer les éléments qui ont une classe qui contient l'id
    // works.forEach((work) => work.remove());
}

function displayMsgDelete() {
    infoMsg.textContent = "Travail supprimé avec succès !"
    infoMsg.style.color = "green"
    setTimeout(() => {
        infoMsg.textContent = "Supprimer la galerie"
        infoMsg.style.color = "#d65353"
    }, 2000);
}