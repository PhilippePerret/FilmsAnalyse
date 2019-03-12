'use strict'


// TODO Peut-être les mettre dans des fichier JSON à requérir, en fonction de
// la langue
const ERRORS = {
  "invalid-folder": "Le dossier \"%{fpath}\" n’est pas un dossier d’analyse valide."
}
const MESSAGES = {
  "loading-analyse": "Chargement de l'analyse… "
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
