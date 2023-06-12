import { generateWorks, works, clearWorks, categories } from "./gallery.js";

////////Paramétrage de la fenêtre modale

export let modal = null; //Initialisation de la modal au chargement de la page

//Evenements joués à l'ouverture de la modale
const openModal = async function (e) {
    e.preventDefault();
    const target = e.target.getAttribute('href'); //Récupération du href ciblé à l'utilisation d'openModal
    if (modal == null) { //Si la modale n'existe pas 
        modal = await loadModal(target); //Initialiser la modale
        clearWorks();
        generateWorks(works);
        toggleCrossIcon();
        deleteWorks();
        modalSwitchEvent();
        modal.addEventListener('click', closeModal);
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-stop').addEventListener('click', stopPropagation);
    } else { //Si la modale a déjà été créée 
        modal.style.display = null; //retirer le display none pour la réafficher
    };
};

//Evenements joués à la fermeture de la modale
const closeModal = function (e) {
    if (modal == undefined) return;
    modal.style.display = 'none';
    modalSwitch(null, null);
};

//Pour stopper le bubbling lors du clic dans la modale
const stopPropagation = function (e) {
    e.stopPropagation();
};

//Récupération du HTML à charger à l'ouverture de la modale
const loadModal = async function (url) {
    const target = '#' + url.split('#')[1];
    const html = await fetch(url).then(response => response.text());
    const element = document.createRange().createContextualFragment(html).querySelector(target);
    document.body.append(element);
    return element;
};

//EventListener sur les liens "modifier" pour ouvrir la modale
document.querySelectorAll('.modal-open').forEach(a => {
    a.addEventListener('click', openModal);
});


//Fermeture de la modale avec la touche echap
window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    };
});


//Affichage de l'icone croix au clic sur les éléments de la galerie
function toggleCrossIcon() {
    let figures = document.querySelectorAll('.modal-gallery figure');
    figures.forEach(figure => {
        figure.addEventListener('click', function () {
            const crossIcon = figure.querySelector('.icon-cross')
            figures.forEach(figure => { figure.querySelector('.icon-cross').classList.add('icon-toggle') });
            crossIcon.classList.toggle('icon-toggle');
        });
    });
};

//////////Gestion de la galerie 

//Récupération du Bearer token
var bearer = sessionStorage.getItem('accessToken');

//Supression des travaux au clic sur l'icone trash-can
const requestDeleteOptions = {
    method: 'DELETE',
    headers: { "Authorization": `Bearer ${bearer}` },
};

async function deleteWorks() {
    //Ajout des eventListener sur les icones trash-can
    document.querySelectorAll('.modal-gallery .icon-trash').forEach(icon => {
        icon.addEventListener('click', async function () {
            const IdToDelete = icon.dataset.workId;
            await fetch(`http://localhost:5678/api/works/${IdToDelete}`, requestDeleteOptions);
        })
    });
};

//Fonctions pour le changement de page dans la modale
const modalSwitch = function(valeur1, valeur2) {
    document.querySelectorAll('#modal .modal1').forEach(e => { e.style.display = valeur1 });
    document.querySelectorAll('#modal .modal2').forEach(e => { e.style.display = valeur2 });
};    

function modalSwitchEvent() {   
    document.querySelector('#modal .modal1 input').addEventListener('click', function (input) {
        input.preventDefault();
        modalSwitch('none', 'flex');
    })
    document.querySelector('#modal .modal2 .fa-arrow-left').addEventListener('click', function () {
        modalSwitch(null, null);
    })  
};

