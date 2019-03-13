'use strict'

/**
 * Retourne la fonction voulu
 *
 * Note : pour le moment, ça ne fonctionne que pour des instances. Il faudrait
 * faire un test pour voir si bindee.constructor existe.
 *
 * @usage
    methode(arg1, arg2)CROCHET_OUVERT
      (this._methode || requireChunk(this, 'methode')).bind(this)(arg1, arg2)
    CROCHET_FERME

    La méthode doit être définie dans ./js/chunks/<this.constructor>/<methode>.js de
    la façon suivante :
    module.exports = function(arg1, arg2){
      //... code de la fonction
    }
    Pour la clarté
 */
function requiredChunk(bindee, methodName){
  bindee.constructor.prototype[`_${methodName}`] = require(`./js/chunks/${bindee.constructor.name}/${methodName}.js`)
  return bindee[`_${methodName}`].bind(bindee) // sera déjà bindée
}

/**
  * Pour pouvoir utiliser la tournure
    this._propriete || defineP(this, '_propriete', valeur)
    return this._propriete
  */
function defineP(obj, prop, val){
  obj[prop] = val
}


/**
 *
  Pour pouvoir utiliser des tournures comme :
    try {
      maCondition || raise(messageDerreur)
    } catch(e){
      console.log(e) // affiche le messageDerreur
    }
  … dans des blocs try

  Note : parce que `maCondition || throw(message d'erreur)` est
  impossible.
 */
function raise(msg){throw(msg)}

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
    console.error("Impossible d'écouter le DOM élément défini ci-dessous :", e)
    console.error({
      cible: cible, ename: ename, method: method, objet: objet, param: param
    })
  }
}
function listenClick(cible, objet, method, param){listen(cible,'click',objet,method, param)}
function listenMDown(cible, objet, method, param){listen(cible,'mousedown',objet,method, param)}
function listenMUp(cible, objet, method, param){listen(cible,'mouseup',objet,method, param)}
