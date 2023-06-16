import { generateWorks, works, categories, fetchWorks } from "./gallery.js";

////////////////////////////Paramétrage de la fenêtre modale

let modal = null; //Initialisation de la modal au chargement de la page

//Evenements joués à l'ouverture de la modale
const openModal = async function (e) {
    e.preventDefault();
    const target = e.target.getAttribute('href'); //Récupération du href ciblé à l'utilisation d'openModal
    if (modal == null) { //Si la modale n'existe pas 
        modal = await loadModal(target); //Initialiser la modale
        modal.addEventListener('click', closeModal);
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-stop').addEventListener('click', stopPropagation);
        modalSwitchEvent();
        generateCategoryOptions();
        addWorks();
        validate();
        deleteAllWorks()
        let imageInput = modal.querySelector('#add-works #image');
        imageInput.addEventListener('change', function () { previewImage(imageInput) });
    } else { //Si la modale a déjà été créée 
        modal.style.display = null; //retirer le display none pour la réafficher
    }
    generateWorks(works);
    toggleCrossIcon();
};

//Evenements joués à la fermeture de la modale
const closeModal = function () {
    if (modal == undefined) return;
    modal.style.display = 'none';
    modalSwitch(null, null); //Retour sur la modale 1 à la fermeture de la modale
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
    }
});

//Affichage de l'icone croix au clic sur les éléments de la galerie
function toggleCrossIcon() {
    let figures = document.querySelectorAll('.modal-gallery figure');
    figures.forEach(figure => {
        figure.addEventListener('click', function () {
            const crossIcon = figure.querySelector('.icon-cross')
            figures.forEach(figure => { figure.querySelector('.icon-cross').classList.add('icon-toggle') });
            crossIcon.classList.toggle('icon-toggle');
        })
    });
}

/////////////////////////////Suppression de la galerie 

//Récupération du Bearer token
let bearer = sessionStorage.getItem('accessToken');

//Supression des travaux au clic sur l'icone trash-can
const requestDeleteOptions = {
    method: 'DELETE',
    headers: { "Authorization": `Bearer ${bearer}` },
};

async function deleteWorks() {
    //Ajout des eventListener sur les icones trash-can
    document.querySelectorAll('.modal-gallery .icon-trash').forEach(icon => {
        icon.addEventListener('click', async function () {
            let idToDelete = icon.dataset.workId;
            await fetch(`http://localhost:5678/api/works/${idToDelete}`, requestDeleteOptions);
            alert(`Le projet n°${idToDelete} a été supprimé`);
            await fetchWorks();
            generateWorks(works);
        })
    });
}

async function deleteAllWorks() {
    document.querySelector('.modal-delete').addEventListener('click', async function (e) {
        let confirmation = confirm('Êtes-vous sûr de vouloir supprimer toute la galerie ?')
        if (confirmation == false) {
        } else {
            for (let i = 0; i < works.length + 1; i++) {
                await fetch(`http://localhost:5678/api/works/${i}`, requestDeleteOptions);
            }
            await fetchWorks();
            generateWorks(works);
        }
    });
}

//Fonctions pour le changement de page dans la modale
const modalSwitch = function (valeur1, valeur2) {
    document.querySelector('#modal .modal1').style.display = valeur1;
    document.querySelector('#modal .modal2').style.display = valeur2;
};

function modalSwitchEvent() {
    document.querySelector('#modal .modal1 input').addEventListener('click', function (input) {
        input.preventDefault();
        modalSwitch('none', 'flex');
    })
    document.querySelector('#modal .modal2 .fa-arrow-left').addEventListener('click', function () {
        modalSwitch(null, null);
    })
}

/////////////////////////Ajout d'un projet

//Affichage du preview
const previewImage = function (e) {
    const image = document.querySelector("img.image-preview");
    // e.files contient un objet FileList   
    const [picture] = e.files;
    // "picture" est un objet File
    if (picture) {
        // L'objet FileReader
        let reader = new FileReader();
        // L'événement déclenché lorsque la lecture est complète
        reader.onload = function (e) {
            if (picture.size > 400000) {
                alert('Fichier trop volumineux !');
                image.src = "";
                return;
            } else {
                // On change l'URL de l'image
                image.src = e.target.result;
            }
        };
        // On lit le fichier "picture" uploadé
        reader.readAsDataURL(picture);
    }
};

//Génération de la liste des catégories pour l'ajout de projets
async function generateCategoryOptions() {
    const select = document.querySelector('#category');
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        //Création des balises options
        const optionList = document.createElement('option');
        optionList.innerText = category.name;
        optionList.setAttribute('value', category.name);
        //Rattachement des balises aux parents
        if (select) {
            select.appendChild(optionList);
        }
    }
}

//Changement de la couleur du bouton valider en fonction de la complétion du formulaire
function validate() {
    document.forms["add-works"].addEventListener('change', async function () {
        let error;
        let inputs = this.getElementsByTagName('input');
        let select = this.querySelector('#add-works #category');
        let validateBtn = document.getElementById('validate');
        for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].value || select.value == 'empty') {
                validateBtn.style.backgroundColor = "#A7A7A7";
                return error;
            }
            if (error) {
                return;
            } else {
                validateBtn.style.backgroundColor = null;
            }
        };
    });
};

// Fonction pour poster un nouveau projet
async function addWorks() {
    document.forms["add-works"].addEventListener('submit', async function (event) {
        event.preventDefault();
        let error;
        let inputs = this.getElementsByTagName('input');
        let select = this.querySelector('#add-works #category');
        for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].value || select.value == 'empty') {
                error = 'Veuillez renseigner tous les champs';
            };
        };
        if (error) {
            document.getElementById("error").innerHTML = error;
            return;
        } else {
            const formValue = {
                image: this.querySelector('#add-works #image').files[0],
                title: this.querySelector('#add-works #title').value,
                category: select.selectedIndex
            };
            //Création des éléments formData pour le body
            const formData = new FormData();
            formData.append("image", formValue.image);
            formData.append("title", formValue.title);
            formData.append("category", formValue.category);
            //Options de la requète fetch 
            const requestAddWorksOptions = {
                method: 'POST',
                headers: { "Authorization": `Bearer ${bearer}` },
                body: formData
            };
            // requête API pour POST du nouveau "works"
            const responseAddWorks = await fetch('http://localhost:5678/api/works', requestAddWorksOptions);
            if (responseAddWorks.ok) {
                await fetchWorks();
                generateWorks(works);
                alert('Ajout du projet réalisé avec succès');
                modalSwitch(null, null);
                this.reset();
                document.querySelector("img.image-preview").src = "";
                document.getElementById("error").innerHTML = "";
            }
        };
    });
};

export {
    modal,
    deleteWorks
};