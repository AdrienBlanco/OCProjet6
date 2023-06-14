//Formulaire de connexion de l'utilisateur
function loginUser() {
    //Ajout d'un eventListener sur le formulaire de connexion
    document.querySelector('#login form').addEventListener('submit', async function (event) {
        //Annulation du comportement par défaut
        event.preventDefault();
        //Récupération de la valeur saisie dans les champs email et password
        const loginValue = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        };
        //Réécriture de la valeur des champs email et password au format Json
        const loginValueJson = JSON.stringify(loginValue);
        //Options de la requète fetch 
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: loginValueJson
        };
        //requête API pour authentification du User
        const responseLogin = await fetch('http://localhost:5678/api/users/login', requestOptions);
        if (responseLogin.ok) { //Si l'authentication de l'utilisateur est ok (status 200)
            let bearer = await responseLogin.json(); 
            sessionStorage.setItem('accessToken', bearer.token); //Sauvegarde du Bearer token dans le sessionStorage
            window.location.assign('../../index.html'); //Redirection vers la page principale du site
        } else {
            const error = document.querySelector('#login .login-error'); // Affichage d'un message d'erreur en cas de connexion non autorisée
            error.innerText = "Erreur dans l’identifiant ou le mot de passe";
        };
    });
};
loginUser();