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
        captionElement.innerText = work.title;
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
        filterElement.classList.add(`filter-${category.id}`);
        //Rattachement des balises aux parents
        filters.appendChild(filterElement);
    }
};

//Filtrage par catégorie
const filterId1 = document.querySelector('.filter-1');
filterId1.addEventListener("click", function () {
    filterId1.setAttribute('id','filter-selected');
    filterId2.setAttribute('id','');
    filterId3.setAttribute('id','');
    noFilter.setAttribute('id','');
    const filteredWorks = works.filter(work => work.categoryId === 1);
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(filteredWorks);
});

const filterId2 = document.querySelector('.filter-2');
filterId2.addEventListener("click", function () {
    filterId1.setAttribute('id','');
    filterId2.setAttribute('id','filter-selected');
    filterId3.setAttribute('id','');;
    noFilter.setAttribute('id','');
    const filteredWorks = works.filter(work => work.categoryId === 2);
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(filteredWorks);
});

const filterId3 = document.querySelector('.filter-3');
filterId3.addEventListener("click", function () {
    filterId1.setAttribute('id','');
    filterId2.setAttribute('id','');
    filterId3.setAttribute('id','filter-selected');
    noFilter.setAttribute('id','');
    const filteredWorks = works.filter(work => work.categoryId === 3);
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(filteredWorks);
});

//Retirer les filtres
const noFilter = document.querySelector('.no-filter');
noFilter.addEventListener("click", function () {
    filterId1.setAttribute('id','');
    filterId2.setAttribute('id','');
    filterId3.setAttribute('id','');
    noFilter.setAttribute('id','filter-selected');
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(works);
});