// Pour faire apparaitre les formulaires d'incription/de connexion
let btnConnexion = document.getElementById("btnConnexion");
let btnInscription = document.getElementById("btnInscription");
let connexion = document.getElementById("connexion");
let inscription = document.getElementById("inscription");

let acceuil = document.getElementById("acceuil");


if(btnConnexion){
btnConnexion.addEventListener("click", () => {
  if(getComputedStyle(connexion).display != "none"){
    connexion.style.display = "none";
  } else {
    connexion.style.display = "block";
    acceuil.style.display = "none";
  }
})
}
if(btnInscription){
btnInscription.addEventListener("click", () => {
  if(getComputedStyle(inscription).display != "none"){
    inscription.style.display = "none";
  } else {
    inscription.style.display = "block";
    acceuil.style.display = "none";
  }
})
}


// Retour accueil
let retourConnex = document.getElementById("retourConnex");
let retourInsc = document.getElementById("retourInsc");

retourConnex.addEventListener("click", () => {
    connexion.style.display = "none";
    acceuil.style.display = "block";
  }
)

retourInsc.addEventListener("click", () => {
    inscription.style.display = "none";
    acceuil.style.display = "block";
  }
)




// Gestion photo de profil (affichage avant validation)
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






//Gestion connexion et de l'utilisateur actuel à la connexion
const erreurConnexion = document.getElementById("erreurConnexion");
const formConnexion = document.getElementById("formConnexion");
if(formConnexion){
    formConnexion.addEventListener("submit", function (event) {
        event.preventDefault();
        // Recuperation des champs
        const emailConnexion = document.getElementById("emailConnexion").value;
        const mdpConnexion = document.getElementById("mdpConnexion").value;
        let trouve = false;

        //Pour l'instant on le connecte mais gestion d'erreur à faire
        for (const utilisateur of utilisateurs) {
            if(utilisateur.email === emailConnexion && utilisateur.mdp === mdpConnexion){
                localStorage.setItem(
                    "utilisateurActuel",
                    JSON.stringify(utilisateur)
                );
                trouve = true;
            }
        }
        if(trouve) {
            document.location.href="profil.html";
        }
        else {
            erreurConnexion.textContent = "Email ou mot de passe incorrect !";
            return;
        }
        
    });
}

// Gestion stockage incription (au clic du bouton)
const erreurInsc = document.getElementById("erreurInsc");
const formInsc = document.getElementById("formInsc");
if(formInsc){
    formInsc.addEventListener("submit", function (event) {
        event.preventDefault();

        // Recuperation des champs
        const nom = document.getElementById("nom").value;
        const prenom = document.getElementById("prenom").value;
        const email = document.getElementById("email").value;
        const mdp = document.getElementById("mdp").value;
        const confirmationMdp = document.getElementById("confirmationMdp").value;
        
        //Stockage photo
        const PhotoURL = photo.src;


        // Verif des erreurs/contraintes
        if (nom === "") {
            erreurInsc.textContent = "Le nom est obligatoire.";
            return;
        }
        if (prenom === "") {
            erreurInsc.textContent = "Le prénom est obligatoire.";
            return;
        }
        if (email === "") {
            erreurInsc.textContent = "L'email est obligatoire.";
            return;
        }
        if (mdp === "") {
            erreurInsc.textContent = "Le mot de passe est obligatoire.";
            return;
        }
        if (confirmationMdp === "") {
            erreurInsc.textContent = "Vous devez confirmer votre mot de passe.";
            return;
        }
        if (mdp != confirmationMdp) {
            erreurInsc.textContent = "Les mots de passe doivent correspondre";
            return;
        }
        
        //const utilisateurs = getUtilisateurs();
        for(utilisateur of utilisateurs) {
            if(email == utilisateur.email)
            {
                erreurInsc.textContent = "Cet email est déjà utilisé";
                return;
            }

        } 



        // Creation de l'utilisateur
        creerUtilisateur(nom, prenom, email, mdp, PhotoURL);
    });
}