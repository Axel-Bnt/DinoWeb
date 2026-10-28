if(!getUtilisateurActuel())
{
    document.location.href="accueil.html";
}

afficherProfil();
afficherDashboard();
afficherDernierePublication();

/////////////////////////////Profil

// Fonction qui affiche le profil de l'utilisateur connecté
function afficherProfil() {
    const utilisateurActuel = getUtilisateurActuel();
    const infosDiv = document.getElementById("infos");
    if(infosDiv){
        infosDiv.innerHTML = `<p>${utilisateurActuel.nom}  ${utilisateurActuel.prenom}</p><p>${utilisateurActuel.email}</p>`;
        document.getElementById("ProfilIMG").src = utilisateurActuel.PhotoProfil;
    }
}

// Gestion de la déconnexion (redirige vers la page d'accueil et supprime l'utilisateur actuel)
let btnDeconnexion = document.getElementById("btnDeconnexion");
if(btnDeconnexion){
    btnDeconnexion.addEventListener("click", () => {
        localStorage.removeItem("utilisateurActuel");
        document.location.href="accueil.html";
    })
}

// Gestion du boutton pour aller au fil
let btnGoFeed = document.getElementById("btnGoFeed");
if(btnGoFeed){
    btnGoFeed.addEventListener("click", () => {
        document.location.href="feed.html";
    })
}

function afficherDashboard()
{
    const utilisateurActuel = getUtilisateurActuel();
    const stats = document.getElementById("stats");
    stats.innerHTML = "";

    let nbAbonnes = utilisateurActuel.abonnes.length;

    //let posts = getPosts();
    let nbLikes = 0;
    let nbPosts = 0;
    for (const post of posts) {
        if(post.postUserEmail == utilisateurActuel.email)
        {
            nbLikes += post.postLikes.length;
            nbPosts += 1;
        }
    }
    stats.innerHTML += `<p>Tableau de bord</p><div id=Bloc><div id=nbFollower class=statBloc>👥Nombre d'abonnes :<br> ${nbAbonnes}</div><div id=nbLikes class=statBloc>💚Nombre de likes recus :<br> ${nbLikes}</div><div id=nbPosts class=statBloc>✍️​Nombre de posts :<br> ${nbPosts}</div></div>`;
}


function afficherDernierePublication()
{
    const utilisateurActuel = getUtilisateurActuel();
    const postProfil = document.getElementById("postProfil");
    postProfil.innerHTML = "";
    //let posts = getPosts();

    let lastPostID;
    // la dernière fois que l'on assigne correspond à la dernière publication
    for(const post of posts)
    {
        if(post.postUserEmail == utilisateurActuel.email)
        {
            lastPostID = post.postId;
        }
    }
    let nb = 0;
    for(const post of posts)
    {
        if(post.postId == lastPostID)
        {
            let textLike;
            if(post.postLikes.includes(utilisateurActuel.email))
            {
                textLike = "🦖Retirer le like";
            }
            else
            {
                textLike = "🥚Liker";
            }
            nb += 1;
            postProfil.innerHTML += `<div class=postDiv><div class=topPost><div class=userInfoPost><img class=postProfilImg src="${utilisateurActuel.PhotoProfil}"/><div class=namePost><p>${utilisateurActuel.nom} ${utilisateurActuel.prenom}</p><p>${post.postDate}</p></div></div><button class="btnsupprimerPost" onclick="supprimerPublicationProfil(${post.postId})">Supprimer</button></div><hr><img class=postImg src="${post.postImg}"/><hr><p class=postText>${post.postText}</p><button class=likedIMG onclick="likerPublicationProfil(${post.postId})">${textLike}</button><p class=PostNbLikes>${post.postLikes.length}</p></div>`;
        }
    }
    if(nb == 0)
    {
        postProfil.innerHTML += `<div id=noPostText><p id=logo>🦖</p><p id=pasPublications>Toujours pas de publication ! N'hésite pas à partager avec les autres dinos !<p></div>`;
    }
}

function supprimerPublicationProfil(id) {
    for (let i = 0; i < posts.length; i++) {
            if(posts[i].postId == id) {
                posts.splice(i, 1);
                break;
            }
        }
    savePosts();
    afficherDernierePublication();
    afficherDashboard();
}

function likerPublicationProfil(postId) {
    const utilisateurActuel = getUtilisateurActuel();

    const post = posts.find((p) => p.postId === postId);

    if(!post.postLikes.includes(utilisateurActuel.email)) {
        post.postLikes.push(utilisateurActuel.email);
    }
    else {
        for (let i = 0; i < post.postLikes.length; i++) {
            if(post.postLikes[i] == utilisateurActuel.email) {
                post.postLikes.splice(i, 1);
                break;
            }
        }
    }
    savePosts();
    afficherDernierePublication();
    afficherDashboard();
}


let btnModif = document.getElementById("btnModif");

let modification = document.getElementById("modification");
let blocProfil = document.getElementById("blocProfil");

btnModif.addEventListener("click", () => {
  if(getComputedStyle(modification).display != "none"){
    modification.style.display = "none";
  } else {
    modification.style.display = "block";
    blocProfil.style.display = "none";
  }
})


// Retour profil
let retourModif = document.getElementById("retourModif");

retourModif.addEventListener("click", () => {
    modification.style.display = "none";
    blocProfil.style.display = "flex";
  }
)

// Gestion photo modif
let photo = document.getElementById("photo");
let PhotoProfil = document.getElementById("PhotoProfil")

if(PhotoProfil){
PhotoProfil.addEventListener('change', () => {
    const reader = new FileReader();

    reader.readAsDataURL(PhotoProfil.files[0]);

    reader.addEventListener('load', () => {
        const url = reader.result;
        photo.src = url;
    });
})
}


const erreurModif = document.getElementById("erreurModif");
const formModif = document.getElementById("formModif");
if(formModif){
    // Champs préremplis (hors mdp)
    const utilisateurActuel = getUtilisateurActuel();
    document.getElementById("ModifNom").value = utilisateurActuel.nom;
    document.getElementById("prenom").value = utilisateurActuel.prenom;
    document.getElementById("email").value = utilisateurActuel.email;
    document.getElementById("photo").src = utilisateurActuel.PhotoProfil;

    // Pour vérif
    const mdp = utilisateurActuel.mdp;
    const email = utilisateurActuel.email;

    formModif.addEventListener("submit", function (event) {
        event.preventDefault();

        const utilisateurs = getUtilisateurs();
        const utilisateur = utilisateurs.find((user) => user.email === utilisateurActuel.email);

        // Recuperation des champs
        const ModifNom = document.getElementById("ModifNom").value;
        const prenom = document.getElementById("prenom").value;
        const NvEmail = document.getElementById("email").value;
        
        const AncienMdp = document.getElementById("AncienMdp").value;
        const NouveauMdp = document.getElementById("NouveauMdp").value;
        const ConfirmationNouveauMdp = document.getElementById("ConfirmationNouveauMdp").value;
        
        //Stockage photo
        const PhotoURL = document.getElementById("photo").src;


        // Verif des erreurs/contraintes
        if (ModifNom === "") {
            erreurModif.textContent = "Le nom est obligatoire.";
            return;
        }
        if (prenom === "") {
            erreurModif.textContent = "Le prénom est obligatoire.";
            return;
        }
        if (NvEmail === "") {
            erreurModif.textContent = "L'email est obligatoire.";
            return;
        }
        if (AncienMdp === "") {
            erreurModif.textContent = "Vous devez renseigner votre ancien mot de passe.";
            return;
        }
        if (NouveauMdp === "") {
            erreurModif.textContent = "Le mot de passe est obligatoire.";
            return;
        }
        if (ConfirmationNouveauMdp === "") {
            erreurModif.textContent = "Vous devez confirmer votre mot de passe.";
            return;
        }
        if (NouveauMdp != ConfirmationNouveauMdp) {
            erreurModif.textContent = "Les mots de passe doivent correspondre";
            return;
        }
        
        for(user of utilisateurs) {
            if(NvEmail == user.email && NvEmail != email)
            {
                erreurModif.textContent = "Cet email est déjà utilisé";
                return;
            }
        }

        if( AncienMdp != mdp)
        {
            erreurModif.textContent = "L'ancien mot de passe est incorrect";
            return;
        }


        // On modifie les infos utilisateur
        utilisateur.nom = ModifNom;
        utilisateur.prenom = prenom;
        utilisateur.email = NvEmail;
        utilisateur.mdp = NouveauMdp;
        utilisateur.PhotoProfil = PhotoURL

        // Infos likes
        for(const post of posts)
        {
            for(let i = 0; i < post.postLikes.length; i++)
            {
                if(post.postLikes[i] == email)
                {
                    post.postLikes[i] = NvEmail;
                }
            }
        }

        // Infos abonnes
        for(const users of utilisateurs)
        {
            for(let i = 0; i < users.abonnes.length; i++)
            {
                if(users.abonnes[i] == email)
                {
                    users.abonnes[i] = NvEmail;
                }
            }
        }

        // Infos email post
        for(const post of posts)
        {
            if(post.postUserEmail == email)
            {
                post.postUserEmail = NvEmail;
            }
        }

        savePosts();
        saveUtilisateurs();

        localStorage.setItem(
            "utilisateurActuel",
            JSON.stringify(utilisateur)
        );
        afficherProfil();
        afficherDernierePublication();

        //Force le rechargement pour si on retourne sur le formulaire
        document.location.href="profil.html";
    });
}