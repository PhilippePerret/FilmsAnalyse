'use strict'


// TODO Peut-être les mettre dans des fichier JSON à requérir, en fonction de
// la langue
const ERRORS = {
  "invalid-folder": "Le dossier \"%{fpath}\" n’est pas un dossier d’analyse valide."
, "already-analyse-folder": "Ce dossier est déjà un dossier d'analyse ! Utiliser le menu « Ouvrir… » pour l'ouvrir."
, "--- FILES ---": ""
, "code-to-save-is-empty":"Le code à sauver est vide, malheureusement."
, "error-while-saving-file": "Une erreur s'est produite à l'enregistrement du fichier. Il ne contient pas le bon nombre d'octets.<br>%{fpath}."
, "temp-file-empty-stop-save": "Le code du fichier temporaire est malheureusement vide. Je dois interrompre la procédure de sauvegarde du fichier.<br>%{fpath}"
, "temps-file-unfound": "Le fichier temporaire est introuvable. Je dois interrompre la procédure d'enregistrement.<br>%{fpath}"
, "--- VIDÉO ---": ""
, "video-path-required": "Il faut indiquer la vidéo du film, en actionnant le menu « Analyse > Choisir la vidéo du film »."
, "video-required": "La vidéo du film est absolument requise pour analyser le film…<br>Astuce : utilisez une autre vidéo si vous voulez travailler « à blanc »."
, "---- SCÈNES ---":""
, "scene-to-close": "Une scène se trouve à moins de 2 secondes. Impossible d'en créer une autre si proche…"
}
const MESSAGES = {
  "conf-created-analyse": "Nouvelle analyse créée avec succès."
, "loading-analyse": "Chargement de l'analyse… "
, "--- messages VIDÉO ---":""
, "no-stop-point": "Aucun point d'arrêt n'est encore défini. Déplacez-vous dans la vidéo pour les définir (à chaque lancement de la vidéo)."
, "--- messages SCÈNES ---":""
, "confirm-scene-close": "Une scène se trouve à %{ecart} secondes. Voulez-vous vraiment créer cette scène ?"
}

/**
 * Gestion des "translation"
 * Les messages sont définis dans ERRORS et MESSAGES, on envoie à cette
 * méthode la clé +lid+ (pour "Locale Id"), avec éventuellement la table
 * des remplacement +lrep+ (pour "Locales Replacement") et la méthode retourne
 * le texte.
 *
 * Les variables s'écrivent `%{<variable name>}` dans le texte (comme les
 * template ruby).
 */
const T = function(lid, lrep){
  var str = ERRORS[lid] || MESSAGES[lid]
  if(undefined===str){
    throw(`L'identifiant de message/error "${lid}" est inconnu de nos services…`)
  }
  if(lrep){
    for(var k in lrep){
      var reg = new RegExp(`%\{${k}\}`, 'g')
      // console.log("str:",str)
      str = str.replace(reg, lrep[k])
    }
  }
  return str
}
