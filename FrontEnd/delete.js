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
    fetch(`https://fair-pea-coat-moth.cyclic.app/api/works/${imgId}`, {
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
            displayMsgDelete("Travail supprimé avec succès !", "green")
        } else if (response.status === 404) {
            console.error('Item not found');
            displayMsgDelete("Un problème est survenu... Veuillez réessayer.")
        } else {
            console.error('An error occurred');
            displayMsgDelete("Un problème est survenu... Veuillez réessayer.")
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
}

// Gestion du message lors de le suppression
function displayMsgDelete(text, color) {
    infoMsg.textContent = text
    infoMsg.style.color = color
    setTimeout(() => {
        infoMsg.textContent = "Supprimer la galerie"
        infoMsg.style.color = "#d65353"
    }, 2000);
}