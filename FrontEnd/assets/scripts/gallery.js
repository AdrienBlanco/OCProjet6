import { modal, deleteWorks } from "./modal.js";

// Récupération des travaux depuis l'API
let works
async function fetchWorks() {
    const responseWorks = await fetch('http://localhost:5678/api/works/');
    works = await responseWorks.json();
}
await fetchWorks();

//Génération des travaux présents sur l'API
async function generateWorks(displayedWorks) {
    clearWorks();
    createWorksElements(displayedWorks, "portfolio");
    createWorksElements(displayedWorks, "modal");
    console.log(displayedWorks)
    deleteWorks(); 
}
generateWorks(works);

function createWorksElements(displayedWorks, gallery) {
    for (let i = 0; i < displayedWorks.length; i++) {
        const work = displayedWorks[i];
        //Création des balises figure pour chaque travaux
        const workElement = document.createElement('figure');
        //Création des balises à l'intérieur de chaque travaux et ajout du contenu
        const imageElement = document.createElement('img');
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        const captionElement = document.createElement('figcaption');
        if (gallery == "portfolio") {
            const portfolioGallery = document.querySelector('.portfolio-gallery');
            captionElement.innerText = work.title;
            portfolioGallery.appendChild(workElement);
            workElement.appendChild(imageElement);
            workElement.appendChild(captionElement);
        } else if (gallery == "modal") {
            const modalGallery = document.querySelector('.modal-gallery');
            captionElement.innerText = 'éditer';
            const trashIcon = document.createElement('i');
            trashIcon.setAttribute('class', 'fa-solid fa-trash-can modal-icons icon-trash');
            trashIcon.dataset.workId = work.id;
            const crossIcon = document.createElement('i');
            crossIcon.setAttribute('class', 'fa-solid fa-arrows-up-down-left-right modal-icons icon-cross icon-toggle');
            if (modalGallery) {
                modalGallery.appendChild(workElement);
                workElement.appendChild(imageElement);
                workElement.appendChild(captionElement);
                workElement.appendChild(trashIcon);
                workElement.appendChild(crossIcon);
            };
        };
    };
}

//Fonction pour vider la gallerie
function clearWorks() {
    document.querySelector(".portfolio-gallery").innerHTML = "";
    if (modal) {
        document.querySelector(".modal-gallery").innerHTML = "";
    }
}

// Récupération des catégories depuis l'API
const responseCategories = await fetch('http://localhost:5678/api/categories/');
const categories = await responseCategories.json();

//Génération des boutons de filtrage
async function generateCategories() {
    //Récupération emplacement du DOM pour la création des éléments
    const filters = document.querySelector('.filters');
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        //Création des balises li pour chaque boutons
        const filterElement = document.createElement('li');
        filterElement.innerText = category.name;
        filterElement.dataset.categoryId = category.id;
        //Rattachement des balises aux parents
        filters.appendChild(filterElement);
    };
}
generateCategories();

//Filtrage par catégorie
function filterByCategory() {
    //Récupération de la liste de boutons sous forme de tableau
    const filterButtons = document.querySelectorAll('.filters li');
    //Manipulation de chaque "button" qui compose le tableau "filterButtons"
    filterButtons.forEach(button => {
        //ajout d'un listener pour chaque "button"
        button.addEventListener("click", function () {
            //Suppression de la classe "filter-selected" sur chaque "button" de "filterButtons"
            filterButtons.forEach(button => { button.classList.remove('filter-selected') });
            //Ajout de la classe "filter-selected" sur le button sélectionné et suppression de la gallerie de travaux
            button.classList.add('filter-selected');
            //Récupération de l'Id du button sélectionné grâce à la valeur de l'attribut data-category-id
            let selectedCategoryId = button.dataset.categoryId;
            if (button.classList.contains('no-filter')) { //Si le button sélectionné contient la classe "no-filter", générer tous les travaux
                generateWorks(works);
            } else { //Sinon générer uniquement les travaux filtrés par Id 
                let filteredWorks = works.filter(work => work.categoryId == selectedCategoryId);
                generateWorks(filteredWorks);
            }
        });
    });
}
filterByCategory();

export {
    generateWorks,
    works,
    categories,
    fetchWorks
};