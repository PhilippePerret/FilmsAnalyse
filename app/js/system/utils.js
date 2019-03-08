'use strict'

// Pour mettre dans le presse-papier
const { clipboard } = electron.remote
function clip(str){
  clipboard.writeText(str) ;
  F.notify(`${str} -> presse-papier`)
};
/**
 * Méthode qui reçoit l'identifiant d'un élément DOM et retourne sa valeur
 * ou null s'il est vide.
 * Note : il faut impérativement passer un ID, avec ou sans le dièse.
 */
function getValOrNull(domId){
  if(domId.substr(0,1)!='#') domId = `#${domId}`
  var v = $(`${domId}`).val().trim()
  if ( v === "" ) return null
  return v
}
