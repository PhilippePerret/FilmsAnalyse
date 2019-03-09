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

function DGet(DOMId){
  return document.getElementById(DOMId)
}

/**
 * Pour rendre le selecteur +jqId+ visible (visibility)
 */
function toggleVisible(jqId, v){
  $(jqId).css('visibility', v ? 'visible' : 'hidden')
}

// Pour écouter un objet
// p.e. listen(btnPlay, 'click', Controller, 'start')
function listen(cible, ename, objet, method){
  cible.addEventListener(ename, objet[method].bind(objet))
}
function listenClick(cible, objet, method){listen(cible,'click',objet,method)}
