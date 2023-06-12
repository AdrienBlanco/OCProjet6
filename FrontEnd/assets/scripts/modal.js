import { generateWorks, works, clearWorks } from "./gallery.js";

//Paramétrage de la fenêtre modale

export let modal = null;

const focusableSelector = "button, a, input, textarea";
let focusables = [];
let previouslyFocusedElement = null;

const openModal = async function (e) {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    if (modal == null) {
        modal = await loadModal(target);
        generateWorks(works);
        toggleCrossIcon();
        deleteWorks();
        focusables = Array.from(modal.querySelectorAll(focusableSelector));
        previouslyFocusedElement = document.querySelector(':focus');
        focusables[0].focus();
        modal.setAttribute('aria-modal', 'true');
        modal.addEventListener('click', closeModal);
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-stop').addEventListener('click', stopPropagation);
    } else {
        modal.style.display = null;
        clearWorks();
        generateWorks(works);
        toggleCrossIcon();
        deleteWorks();
    };
};

const closeModal = function (e) {
    if (modal == undefined) return;
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
    e.preventDefault();
    modal.style.display = 'none';
};

const stopPropagation = function (e) {
    e.stopPropagation();
};

const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'));
    console.log(index);
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    };
    if (index >= focusables.length) {
        index = 0;
    };
    if (index < 0) {
        index = focusables.length - 1;
    }
    focusables[index].focus();
};

const loadModal = async function (url) {
    const target = '#' + url.split('#')[1];
    const html = await fetch(url).then(response => response.text());
    const element = document.createRange().createContextualFragment(html).querySelector(target);
    document.body.append(element);
    return element;
};

document.querySelectorAll('.modal-open').forEach(a => {
    a.addEventListener('click', openModal);
});

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    };
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
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
var Bearer = sessionStorage.getItem('accessToken');

//Supression des travaux au clic sur l'icone trash-can
const requestDeleteOptions = {
    method: 'DELETE',
    headers: { "Authorization": `Bearer ${Bearer}` },
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
