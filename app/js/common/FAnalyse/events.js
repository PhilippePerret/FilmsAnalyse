'use strict'
/**

  Module contenant toutes les méthodes d'instance de
  FAnalyse qui gèrent les events.

**/

Object.assign(FAnalyse.prototype,{

  /**
    Méthode qui procède à l'association entre deux éléments/objets
    de l'analyse.
    Mais contrairement à la méthode `getBaliseAssociation` qui retourne
    une balise à insérer dans le texte (p.e. `{{event: 12}}`), cette
    méthode crée une association simple en dehors des textes.
  **/
  associateDropped(obj, dropped){
    var dropped_type = dropped.attr('data-type')
    if(undefined === dropped) throw(T('data-type-required-for-association'))
    var dropped_id = dropped.attr('data-id') // pas toujours défini
    if (dropped_id && dropped_id.match(/^([0-9]+)$/)) dropped_id = parseInt(dropped_id,10)
    switch (dropped_type) {
      case 'event':
        obj.addEvent(dropped_id)
        break
      case 'document':
        // Associer le document
        // Note : soit il est défini dans le `data-id` soit c'est
        // le document courant.
        obj.addDocument(dropped_id||FAWriter.currentDoc.id || FAWriter.currentDoc.type)
        break
      case 'time':
        // Associer le temps courant
        obj.addTime(this.locator.getRTimeRound())
        break
      default:
        throw(T('unknown-associated-type', {type: dropped_type}))
    }
  }


/**
* Associateur
* Cette méthode associe l'élément droppé +domEl+ à l'instance +obj+ qui
* peut être, en substance, n'importe quel élément de l'analyse, un event, un
* document, etc.
*
  @param  {Instance} obj  L'instance d'un objet quelconque qui peut être associé
  @param {DOMElement} domEl L'helper qui a été déplacé sur l'objet
  @param  {MoveEvent} e     L'évènement triggué

  @return {String|Null} la balise qui sera peut-être à insérer dans le champ de saisie,
* si c'est un champ qui a reçu le drop
* Retourne false si un problème est survenu
**/
,
getBaliseAssociation(obj, domEl, e){
  // console.log("-> getBaliseAssociation", obj, domEl)
  var balise
    , domEl_type = domEl.attr('data-type')
    , domEl_id

  // console.log({
  //   obj: obj, domEl:domEl, e:e
  // })

  if(undefined === domEl_type)throw("L'élément droppé devrait définir son data-type:", domEl)
  domEl_id = domEl.attr('data-id')
  // Note : le domEl_id, contrairement au domEl_type, n'est pas toujours
  // défini, quand on traite le document édité courant, par exemple, ou que
  // c'est un temps qu'on draggue.

  if(e.target.className.match(/\bhorloge\b/)){
    if(domEl.hasClass('dropped-time')){
      return domEl.attr('data-value') // l'horloge
    }
    F.notify(`Je ne sais pas encore récupérer le temps d'un objet de type "${domEl_type}"`, {error:true})
    return '0,0'
  }

  // On transforme toujours en entier un nombre string
  if (domEl_id && domEl_id.match(/^([0-9]+)$/)) domEl_id = parseInt(domEl_id,10)

  switch (domEl_type) {
    case 'document':
      if(undefined === domEl_id){
        // => Le document édité
        domEl_id = FAWriter.currentDoc.id || FAWriter.currentDoc.type
      }
      if (false === obj.addDocument(domEl_id)) return null
      balise = `{{document:${domEl_id}}}`
      break
    case 'event':
      // Pour un event, il faut toujours que l'ID soit défini
      if (undefined === domEl_id) throw("Il faut toujours définir l'ID de l'event, dans l'attribut data-id.")
      if (false === obj.addEvent(domEl_id)){
        return null
      }
      var isScene = this.ids[domEl_id].type == 'scene'
      balise = `{{${isScene?'scene':'event'}:${domEl_id}}}`
      break
    case 'time':
      balise = `{{time:${domEl.attr('data-time')}}}`
      break;
    default:
      throw("Le type de l'élément droppé est inconnu. Je ne sais pas comment le traiter…", domEl_type)
      return false
  }
  return balise
}

})
