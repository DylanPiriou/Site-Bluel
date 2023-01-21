const categories = document.querySelectorAll('.filter-button')
const gallery = document.querySelector('.gallery')

categories.forEach(category => {
    category.addEventListener('click', e => {
        // Récupère la catégorie sélectionnée à partir de l'attribut "data-category"
        const selectedCategory = e.target.getAttribute('data-category')
        // Vide le contenu de la galerie avant de filtrer les données
        gallery.innerHTML = '';
        // Ajoute la classe "active" à l'élément sélectionné
        categories.forEach(category => category.classList.remove('active'));
        e.target.classList.add('active');
        filterByCategory(selectedCategory);
    })
})

function filterByCategory(category) {
    fetch('http://localhost:5678/api/works')
    .then(res => res.json())
    .then(data => {
        // Filtre les données de l'API en fonction de la catégorie sélectionnée
        let filteredData;
        if (category === "category1") {
            filteredData = data;
        } else if (category === "category2") {
            filteredData = data.filter(work => work.category.name === "Objets");
        } else if (category === "category3") {
            filteredData = data.filter(work => work.category.name === "Appartements");
        } else if (category === "category4") {
            filteredData = data.filter(work => work.category.name === "Hotels & restaurants");
        }

        // Boucle sur les données filtrées pour créer les éléments de la galerie
        filteredData.forEach(item => {
            let figure = document.createElement('figure')
            let img = document.createElement('img')
            img.src = item.imageUrl
            img.alt = item.title
            img.setAttribute('crossorigin', 'anonymous')
            figure.appendChild(img)
            let figcaption = document.createElement('figcaption')
            figcaption.textContent = item.title
            figure.appendChild(figcaption)
            gallery.appendChild(figure)
        });
    })
    .catch(error => console.log(error));
}

// Charge la catégorie "Tous" par défaut au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    filterByCategory("category1");
});