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
    figures.forEach(f => {
        f.addEventListener('click', function (event) {
                console.log(f);
                console.log(event.target)
                const crossIcon = event.target.querySelector('.icon-cross')
                crossIcon.classList.toggle('icon-toggle');
            }, true)
    });
};

//////////Suppression des photos

function deleteWorks() {
    //Ajout d'un eventListener sur le formulaire de connexion
    document.querySelector('.modal-gallery .icon-trash').addEventListener('click', async function () {
        //Récupération de la valeur saisie dans les champs email et password
        const loginValue = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        };
        //Réécriture de la valeur des champs email et password au format Json
        const loginValueJson = JSON.stringify(loginValue);
        //Options de la requète fetch 
        const requestOptions = {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: loginValueJson
        };
        //requête API pour authentification du User
        const responseLogin = await fetch('http://localhost:5678/api/works/{id}', requestOptions);
        if (responseLogin.ok) { //Si l'authentication de l'utilisateur est ok (status 200)
            let bearer = await responseLogin.json(); 
            sessionStorage.setItem('accessToken', bearer.token); //Sauvegarde du Bearer token dans le sessionStorage
            window.location.assign('../../index.html'); //Redirection vers la page principale du site

        };
    });
};