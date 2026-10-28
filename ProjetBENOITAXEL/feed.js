if(!getUtilisateurActuel())
{
    document.location.href="accueil.html";
}

///////////////////////////////// FEED

////////////Fonctions au chargement
afficherMiniProfil();

afficherPublications();

afficherUtilisateurs();


// Gestion de la déconnexion (redirige vers la page d'accueil et supprime l'utilisateur actuel)
let btnDeconnexion = document.getElementById("btnDeconnexion");
if(btnDeconnexion){
    btnDeconnexion.addEventListener("click", () => {
        localStorage.removeItem("utilisateurActuel");
        document.location.href="accueil.html";
    })
}
////////////Gauche

// Fonction qui affiche le profil de l'utilisateur connecté
function afficherMiniProfil() {
    const utilisateurActuel = getUtilisateurActuel();
    const miniProfil = document.getElementById("miniProfil");
    const profilHeader = document.getElementById("profilHeader");
    if(miniProfil){
        miniProfil.innerHTML += `<p>${utilisateurActuel.nom}  ${utilisateurActuel.prenom}</p>`;
        document.getElementById("MiniProfilIMG").src = utilisateurActuel.PhotoProfil;
    }
}


let btnProfil = document.getElementById("btnProfil");
if(btnProfil){
    btnProfil.addEventListener("click", () => {
        document.location.href="profil.html";
    })
}



//Publications
// Gestion photo de publications (affichage avant validation)
let postImg = document.getElementById("postImg")
let photopost = document.getElementById("photopost")


if(postImg){
postImg.addEventListener('change', () => {
    const reader = new FileReader();

    reader.readAsDataURL(postImg.files[0]);

    reader.addEventListener('load', () => {
        const url = reader.result;
        photopost.src = url;
        photopost.style.display = "block";
    });
})
}





let btnPost = document.getElementById("btnPost");

if(btnPost) {
    btnPost.addEventListener("click", (e) => {
        e.preventDefault();

        let date = new Date();
        let id = date.valueOf();
        const utilisateurActuel = JSON.parse(localStorage.getItem("utilisateurActuel"));
        const userEmail = utilisateurActuel.email; 
        const postText = document.getElementById("postText").value;
        const postImg = photopost.src;
        let datePublication = date.toLocaleDateString();
        
        document.getElementById("formAddPost").reset();
        photopost.src = "#";
        photopost.style.display = "none";

        creerPublication(id, userEmail, postText, postImg, datePublication);
        afficherPublications();
    })
}






////////////Centre


/// RECHERCHE

// Recuperer le champ de recherche
const recherchePost = document.getElementById("recherchePost");
const recherchePostAuteur = document.getElementById("recherchePostAuteur");

recherchePost.addEventListener("input", filtrePosts);
recherchePostAuteur.addEventListener("input", filtrePosts);

function filtrePosts() {
    document.getElementById("errorSearch").innerHTML = "";

    const textePost = recherchePost.value.toLowerCase();
    const texteAuteur = recherchePostAuteur.value.toLowerCase();

    const items = document.getElementById("postsZone").children;
    let nbAffiche = 0;
    for(let i = 0; i < items.length; i++) {
        const contenuPost = items[i].getElementsByClassName("postText")[0].textContent.toLowerCase();
        const auteurPost = items[i].getElementsByClassName("auteur")[0].textContent.toLowerCase();

        if(contenuPost.includes(textePost) && auteurPost.includes(texteAuteur)) {
            nbAffiche += 1;
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
    if(nbAffiche == 0)
    {
        document.getElementById("errorSearch").innerHTML += `Aucun résultat de recherche !`;
    }

}

function afficherPublications() {
    const postsZone = document.getElementById("postsZone");
    if(postsZone){
        postsZone.innerHTML = "";
        const utilisateurActuel = getUtilisateurActuel();
        const utilisateurs = getUtilisateurs();

        //Tri du tableau pour avoir les posts des abonnements en 1
        let postsTries = posts;
        postsTries.sort((post1, post2) =>{
            const auteur1 = utilisateurs.find((u1) => u1.email == post1.postUserEmail);
            const auteur2 = utilisateurs.find((u2) => u2.email == post2.postUserEmail);


            if(!(auteur1.abonnes.includes(utilisateurActuel.email)) && (auteur2.abonnes.includes(utilisateurActuel.email))){
                return 1;
            }
            if((auteur1.abonnes.includes(utilisateurActuel.email)) && !(auteur2.abonnes.includes(utilisateurActuel.email))){
                return -1;
            }

            return (post2.postId - post1.postId);
        });


        //Affichage
        for (const post of postsTries) {
            for(const utilisateur of utilisateurs)
            {
                if(utilisateur.email == post.postUserEmail)
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

                    if(post.postUserEmail == utilisateurActuel.email) {
                        postsZone.innerHTML += `<div class=postDiv><div class=topPost><div class=userInfoPost><img class=postProfilImg src="${utilisateur.PhotoProfil}"/><div class=namePost><p class=auteur>${utilisateur.nom} ${utilisateur.prenom}</p><p>${post.postDate}</p></div></div><button class="btnsupprimerPost" onclick="supprimerPublication(${post.postId})">Supprimer</button></div><hr><img class=postImg src="${post.postImg}"/><hr><p class=postText>${post.postText}</p><button class=likedIMG onclick="likerPublication(${post.postId})">${textLike}</button><p class=PostNbLikes>${post.postLikes.length}</p></div>`;
                    }
                    else {
                        postsZone.innerHTML += `<div class=postDiv><img class=postProfilImg src="${utilisateur.PhotoProfil}"/><p class = auteur>${utilisateur.nom} ${utilisateur.prenom}</p><p>${post.postDate}</p><hr><img class=postImg src="${post.postImg}"/><hr><p class=postText>${post.postText}</p><button class=likedIMG onclick="likerPublication(${post.postId})">${textLike}</button><p class=PostNbLikes>${post.postLikes.length}</p></div>`;
                    }
                }
            }
        }

    }
}


///////// Liker

function likerPublication(postId) {
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
    afficherPublications();
}

///////// Supression de publication

function supprimerPublication(id) {
    for (let i = 0; i < posts.length; i++) {
            if(posts[i].postId == id) {
                posts.splice(i, 1);
                break;
            }
        }
    savePosts();
    afficherPublications();
}

////////////Droite
function afficherUtilisateurs() {
    const utilisateurActuel = getUtilisateurActuel();
    const rightPart = document.getElementById("rightPart");
    if(rightPart){
        rightPart.innerHTML = "";
        for (const utilisateur of utilisateurs) {
            if(utilisateur.email != utilisateurActuel.email){
                let textSuivi;
                if(utilisateur.abonnes.includes(utilisateurActuel.email))
                {
                    textSuivi = "Ne plus suivre";
                }
                else
                {
                    textSuivi = "Suivre";
                }
                rightPart.innerHTML += `<div class="allUsers"><img class="allUsersImg" src="${utilisateur.PhotoProfil}"/><p>${utilisateur.nom} ${utilisateur.prenom}</p><button class="btnAbonner" onclick=abonnerUtilisateur('${utilisateur.email}')>${textSuivi}</button></div>`;
            }
        }
    }
}

function abonnerUtilisateur(email) {
    const utilisateurActuel = getUtilisateurActuel();

    const utilisateur = utilisateurs.find((user) => user.email === email);

    if(!utilisateur.abonnes.includes(utilisateurActuel.email)) {
        utilisateur.abonnes.push(utilisateurActuel.email);
    }
    else {
        for (let i = 0; i < utilisateur.abonnes.length; i++) {
            if(utilisateur.abonnes[i] == utilisateurActuel.email) {
                utilisateur.abonnes.splice(i, 1);
                break;
            }
        }
    }
    
    saveUtilisateurs();
    afficherUtilisateurs();
    afficherPublications();
}