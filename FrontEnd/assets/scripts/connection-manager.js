//Affichage des éléments lorsque l'utilisateur est connecté
const connected = sessionStorage.getItem('validUser');
const logout = sessionStorage.removeItem('validUser');

const toggleEditMode = document.querySelectorAll('.edit');
const toggleLogin = document.querySelector('.hide-login');

if (connected) {
    toggleEditMode.forEach(element => {
        element.style.display = 'flex';
    });
    toggleLogin.style.display = 'none';
} else {
    toggleEditMode.forEach(element => {
        element.style.display = 'none';
    });
    toggleLogin.style.display = 'flex';
};

document.querySelector('.logout').addEventListener('click', function () {
    logout;
    window.location.reload();
});
