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
    this._propriete || defP(this, '_propriete', valeur)
    return this._propriete
  */
function defP(obj, prop, val){
  obj[prop] = val
  return val
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
 *          'horloge'   =>  C'est une horloge (donc une balise <horloge>) et il
 *                          faut retourner le nombre de secondes et frames
 *          'duree'     =>  C'est une durée (donc une balise <duree>) et il
 *                          faut retourner des secondes et frames.
 */
function getValOrNull(domId, options){
  if(undefined===options) options = {}
  if(domId.substr(0,1)!='#') domId = `#${domId}`
  var field = $(`${domId}`)
  var value ;
  switch (options.type) {
    case 'horloge':
    case 'duree':
      return parseFloat(field.attr('value'))
    default:
      value = field.val().trim()
  }
  if ( value === "" ) return null
  else if(options.type === 'number')  value = parseInt(value,10)
  else if(options.type === 'float')   value = parseFloat(value)

  return value
}

function DGet(DOMId){
  return document.getElementById(DOMId)
}

/**
* Faciliteur pour créer un élément DOM (qui est retourné)
*
* +params+
*     id      Identifiant à donner à l'élément
*     class   La class CSS à appliquer
*     style   L'attribut style
*     inner   L'innerHTML, en dur
*     append  Le ou les éléments DOM à ajouter
*     attrs   Les attributs à définir (hash: attr: valeur, attr: valeur, ...)
*
**/
function DCreate(typeElement, params){
  var e = document.createElement(typeElement)
  if(undefined === params) return e
  if(params.id)     e.id = params.id
  if(params.class)  e.className = params.class
  if(params.style)  e.style = params.style
  if(params.inner)  e.innerHTML = params.inner
  if(params.append){
    if(Array.isArray(params.append)){
      params.append.forEach(el => e.appendChild(el))
    } else {
      e.appendChild(params.append)
    }
  }
  if(params.attrs){
    for(var attr in params.attrs){
      e.setAttribute(attr, params.attrs[attr])
    }
  }
  return e
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



$.fn.extend({
  insertAtCaret: function(myValue) {
    this.each(function() {
      if (document.selection) {
        this.focus();
        var sel = document.selection.createRange();
        sel.text = myValue;
        this.focus();
      } else if (this.selectionStart || this.selectionStart == '0') {
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        var scrollTop = this.scrollTop;
        this.value = this.value.substring(0, startPos) +
          myValue + this.value.substring(endPos,this.value.length);
        this.focus();
        this.selectionStart = startPos + myValue.length;
        this.selectionEnd = startPos + myValue.length;
        this.scrollTop = scrollTop;
      } else {
        this.value += myValue;
        this.focus();
      }
    });
    return this;
  }
});
