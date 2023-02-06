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

    // Gestion de la modale
    function handleModal() {
        modalBox &&
            arrayData.forEach(item => {
                addImgsToModal(item)
                arrayData = []
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
}









// Fonction de filtrage
function filterByCategory(category) {
    const filter = new Map();
    filter.set("category1", "");
    filter.set("category2", "Objets");
    filter.set("category3", "Appartements");
    filter.set("category4", "Hotels & restaurants");
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

                // Gestion de la modale
                modalBox &&
                    arrayData.forEach(item => {
                        addImgsToModal(item)
                        arrayData = []
                    });

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
                filteredData.forEach((item) => {
                    let element = addImgsToGallery(item);
                    addToGallery([element]);
                });
            })
            .catch((error) => console.log(error));
}