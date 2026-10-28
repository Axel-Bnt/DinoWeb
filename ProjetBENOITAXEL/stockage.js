function getUtilisateurActuel() {
    return JSON.parse(localStorage.getItem("utilisateurActuel"));
}

function getUtilisateurs() {
    return JSON.parse(localStorage.getItem("utilisateurs"));
}

function saveUtilisateurs() {
    localStorage.setItem(
        "utilisateurs",
        JSON.stringify(utilisateurs)
    );
}
    

function getPosts() {
    return JSON.parse(localStorage.getItem("posts"));
}

function savePosts() {
    localStorage.setItem(
        "posts",
        JSON.stringify(posts)
    );
}


// Fonction qui créer l'utilisateur qui le connecte et envoie vers son profil
function creerUtilisateur(nom, prenom, email, mdp, PhotoProfil) {
    
    // on cree l'utilisateur avec ses infos
    const utilisateur = {
        nom: nom,
        prenom: prenom,
        email: email,
        mdp: mdp,
        PhotoProfil: PhotoProfil,
        abonnes: []
    };
    // On le stocke dans notre tableau
    utilisateurs.push(utilisateur);

    saveUtilisateurs();

    // Connecte l'utilisateur
    localStorage.setItem(
        "utilisateurActuel",
        JSON.stringify(utilisateur)
    );

    // Envoi sur le profil
    document.location.href="profil.html";
}


function creerPublication(id, userEmail, postText, postImg, datePublication) {
    // on cree le post avec ses infos
    const post = {
        postId: id,
        postUserEmail: userEmail,
        postText: postText,
        postImg: postImg,
        postLikes: [],
        postDate: datePublication
    };

    // On le stocke dans notre tableau
    posts.push(post);

    // Sauvegarde des posts
    savePosts();
}


// Tableau qui va stocker tous nos utilisateurs ou le créer si il n'existe pas
let utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];

// Tableau qui va stocker tous nos posts ou le créer si il n'existe pas
let posts = JSON.parse(localStorage.getItem("posts")) || [];



