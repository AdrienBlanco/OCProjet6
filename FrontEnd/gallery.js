// Récupération des travaux depuis l'API
const responseWorks = await fetch('http://localhost:5678/api/works/');
const works = await responseWorks.json();
    
//Génération des travaux présents sur l'API
generateWorks(works);
async function generateWorks(works){
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        //Récupération emplacement du DOM pour la création des éléments
        const divGallery = document.querySelector('.gallery');
        //Création des balises figure pour chaque travaux
        const workElement = document.createElement('figure');
        //Création des balises à l'intérieur de chaque travaux, ainsi que leur contenu
        const imageElement = document.createElement('img');
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        const captionElement = document.createElement('figcaption');
        //Rattachement des balises aux parents
        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(captionElement);
    }
};

// Récupération des catégories depuis l'API
const responseCategories = await fetch('http://localhost:5678/api/categories/');
const categories = await responseCategories.json();

//Génération des boutons de filtrage
generateCategories(categories);
async function generateCategories(categories){
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        //Récupération emplacement du DOM pour la création des boutons filtres
        const filters = document.querySelector('.filters');
        //Création des balises li pour chaque boutons
        const filterElement = document.createElement('li');
        filterElement.innerText = category.name;
        filterElement.classList.add(`${category.id}`);
        //Rattachement des balises aux parents
        filters.appendChild(filterElement);
    }
};

//Filtrage par catégorie
filterByCategory();
function filterByCategory() {

    //Fonction pour vider la gallerie
    function clearGallery() {
        document.querySelector(".gallery").innerHTML = "";
    };

    //Récupération de la liste de boutons sous forme de tableau
    const filterButtons = document.querySelectorAll('.filters li');

    //Manipulation de chaque "button" qui compose le tableau "filterButtons"
    filterButtons.forEach(button => {
        //ajout d'un listener pour chaque "button"
        button.addEventListener("click", function () {
            //Supprimer l'id sur chaque "button" de "filterButtons"
            filterButtons.forEach(button => {button.removeAttribute('id')});
            //Récupération des Id des catégories via le nom de la class de chaque "button"
            let filterByClass = button.className;
            if(filterByClass === 'no-filter'){
                button.setAttribute('id','filter-selected');
                clearGallery();
                generateWorks(works);
            } else {
                button.setAttribute('id','filter-selected');
                let filteredWorks = works.filter(work => work.categoryId == filterByClass);
                clearGallery();
                generateWorks(filteredWorks);
            }
        });
    });
};