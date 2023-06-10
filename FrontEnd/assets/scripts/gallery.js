// Récupération des travaux depuis l'API
const responseWorks = await fetch('http://localhost:5678/api/works/');
const works = await responseWorks.json();

//Génération des travaux présents sur l'API
generateWorks(works);
async function generateWorks(works) {
    //Récupération emplacement du DOM pour la création des éléments
    const divGallery = document.querySelector('#portfolio .gallery');
    const modalGallery = document.querySelector('#modal .gallery');
    console.log(modalGallery);
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        //Création des balises figure pour chaque travaux
        const workElement = document.createElement('figure');
        //Création des balises à l'intérieur de chaque travaux et ajout du contenu
        const imageElement = document.createElement('img');
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        const captionElement = document.createElement('figcaption');
        captionElement.innerText = work.title;
        //Rattachement des balises aux parents
        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(captionElement);
        // if (modalGallery) {
        //     modalGallery.appendChild(workElement);
        // }
        
    }
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        //Création des balises figure pour chaque travaux
        const workElement = document.createElement('figure');
        //Création des balises à l'intérieur de chaque travaux et ajout du contenu
        const imageElement = document.createElement('img');
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        const captionElement = document.createElement('figcaption');
        captionElement.innerText = work.title;
        //Rattachement des balises aux parents
        if (modalGallery) {
        modalGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(captionElement);
        // 
        //     modalGallery.appendChild(workElement);
        }
        
    }
};

// Récupération des catégories depuis l'API
const responseCategories = await fetch('http://localhost:5678/api/categories/');
const categories = await responseCategories.json();

//Génération des boutons de filtrage
generateCategories(categories);
async function generateCategories(categories) {
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        //Récupération emplacement du DOM pour la création des boutons filtres
        const filters = document.querySelector('.filters');
        //Création des balises li pour chaque boutons
        const filterElement = document.createElement('li');
        filterElement.innerText = category.name;
        filterElement.dataset.categoryId = category.id;
        //Rattachement des balises aux parents
        filters.appendChild(filterElement);
    }
};

//Fonction pour vider la gallerie
function clearWorks() { document.querySelector(".gallery").innerHTML = "" };

//Filtrage par catégorie
filterByCategory();
function filterByCategory() {

    //Récupération de la liste de boutons sous forme de tableau
    const filterButtons = document.querySelectorAll('.filters li');

    //Manipulation de chaque "button" qui compose le tableau "filterButtons"
    filterButtons.forEach(button => {
        //ajout d'un listener pour chaque "button"
        button.addEventListener("click", function () {
            //Suppression de la classe "filter-selected" sur chaque "button" de "filterButtons"
            filterButtons.forEach(button => { button.classList.remove('filter-selected') });
            //Récupération de l'Id du button sélectionné grâce à la valeur de l'attribut data-category-id
            let selectedCategoryId = button.dataset.categoryId;
            //Ajout de la classe "filter-selected" sur le button sélectionné et suppression de la gallerie de travaux
            button.classList.add('filter-selected');
            clearWorks();
            if (button.classList.contains('no-filter')) { //Si le button sélectionné contient la classe "no-filter", générer tous les travaux
                generateWorks(works);
            } else { //Sinon générer uniquement les travaux filtrés par Id 
                let filteredWorks = works.filter(work => work.categoryId == selectedCategoryId);
                generateWorks(filteredWorks);
            }
        });
    });
};

var test = 'test';