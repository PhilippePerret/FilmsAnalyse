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
 * +options+
 *  :type   Peut définir le format précis de retour, quand la donnée existe
 *          'number'  => retourne un Int
 *          'float'   => retourne un flottant
 */
function getValOrNull(domId, options){
  if(domId.substr(0,1)!='#') domId = `#${domId}`
  var v = $(`${domId}`).val().trim()
  if ( v === "" ) return null
  else if ('object' === typeof options){
    if(options.type === 'number') v = parseInt(v,10)
    if(options.type === 'float') v = parseFloat(v)
  }
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
function listen(cible, ename, objet, method, param){
  if('string'===typeof(cible)){cible = DGet(cible)}
  try {
    if(undefined === param){
      cible.addEventListener(ename, objet[method].bind(objet))
    } else {
      cible.addEventListener(ename, objet[method].bind(objet, param))
    }
  } catch (e) {
    console.error({
      cible: cible, ename: ename, method: method, objet: objet, param: param
    })
    throw("Impossible d'écouter le DOM élément défini ci-dessus :", e)
  }
}
function listenClick(cible, objet, method, param){listen(cible,'click',objet,method, param)}
