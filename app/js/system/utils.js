'use strict'

/**
 * Méthode qui reçoit l'identifiant d'un élément DOM et retourne sa valeur
 * ou null s'il est vide.
 */
function getValOrNull(domId){
  var v = $(`#${domId}`).val().trim()
  if ( v === "" ) return null
  return v
}
