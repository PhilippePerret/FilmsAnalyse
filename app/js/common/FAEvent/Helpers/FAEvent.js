'use strict'
/**
  Méthodes d'helper des FAEvents

**/
Object.assign(FAEvent.prototype,{
/**
  Renvoie toutes les présentations possible de la scène

  @param {String} format  Le format de retour
  @param {Number} flag    Le drapeau permettant de déterminer les détails
                          du retour, comme la présence des boutons d'édition,
                          l'ajout de la durée, etc.
                          DUREE|TIME|LINKED
  @param {Object} options Options à utiliser (unisité pour le moment)
**/
as(format, flag, opts){
  if (undefined === flag) flag = 0
  // Pour le moment, on lie par défaut (NON !)
  // Pour le moment, on corrige par défaut
  flag = flag | FORMATED

  // console.log("-> as(format, flag)", format, flag)

  var str
  switch (format) {
    case 'short':
      str = this.asShort(opts)
      break
    case 'book':
      // Sortie pour le livre
      str = this.asBook(opts)
      break
    case 'full':
      // Affiche complet, avec toutes les informations
      str = this.asFull(opts)
      break
    case 'associate':
      str = this.asAssociate(opts)
      break
    default:
      str = this.title
  }

  if(flag & LABELLED) str = `<label>${this.htype} #${this.id} : </label> ${str}`

  if(flag & DUREE) str += ` (${this.hduree})`

  if(flag & FORMATED) str = DFormater(str)

  if(flag & EDITABLE){
    // Note : il exclut LINKED
    str = this.linkedToEdit(str)
    console.log("str:", str)
  } else if(flag & LINKED){
    str = this.linked(str)
  }
  return str
}
,
// Version courte commune
asShort(opts){
  console.log("--> [Main]FAEvent#asShort")
  let str = ''
  str += `« ${this.titre} » — ${this.content}`
  if(!opts || !opts.no_warm) str += this.warnCommonMethod
  return str
}
,
// Version livre commune
asBook(opts){
  let str = ''
  str += this.warnCommonMethod
  return str
}
,
// Version complète (reader) commune
// C'est la version qui est ajoutée au `div` contenant les
// boutons d'édition, etc.
asFull(opts){
  if(undefined === opts) opts = {}
  opts.no_warm = true // pour la version short
  let str = ''
  str += `<div class="${this.type} EVT${this.id}">`
  str += `${this.asShort(opts)}`
  str += this.warnCommonMethod
  str += this.divAssociates('events')
  str += this.divAssociates('documents')
  str += this.divAssociates('times')
  str += '</div>'
  return str
}
,
// Version associée, quand l'event est présenté en tant
// qu'associé dans un autre event
asAssociate(opts){
  let str = ''
  str += `<div class="associate ${this.type} EVT${this.id}">`
  str += `<label class="type">${this.htype} : </label>`
  str += `<span class="content">${this.content}</span>`
  str += '</div>'
  return str
}
,
/**
 * Retourne le lien vers l'event
 * Pour remplacer par exemple une balise `event: <id>`
 *
 * Note : si ce texte est modifié, il faut aussi corriger les tests à :
 * ./app/js/TestsFIT/tests/Textes/fatexte_tests.js
 */
asLink(alt_text){
  if(undefined === this._asLink){
    this._asLink = `<a class="lkevent" onclick="showEvent(${this.id})">__TIT__</a>`
  }
  return this._asLink.replace(/__TIT__/, (alt_text || this.title || this.content).trim())
}
,
asLinkToEdit(str){
  if(undefined === this._asLinkToEdit){
    this._asLinkToEdit = `<a class="lkevent" onclick="EventForm.editEvent.bind(EventForm)(${this.id})">__TIT__</a>`
  }
  return this._asLinkToEdit.replace(/__TIT__/, (str || this.title || this.content).trim())
}
,
// Alias
linked(str){ return this.asLink(str) }
,
// Alias
linkedToEdit(str){ return this.asLinkToEdit(str)}
,

/**

  Retourne le div contenant les associés de type +type+ ou un
  string vide.

  @param  {String} type Le type ('event', 'document' ou 'time')
          {Object} Les options.
  @return {String} Le code HTML
**/
divAssociates(type){
  let options
  switch (typeof type) {
    case 'string':
      options = {types: [type]}
      break
    case 'object':
      options = type
      if(undefined === options.types){
        options.types = ['events','documents','times']
      }
      break
    default:
      log.warn("Mauvais argument pour divAssociates: ", type)
      return ''
  }
  var str = ''
  for(type of options.types){
    // console.log("Traitement du type", type)
    if(this[type].length === 0) continue
    str += `<h3>${FATexte.htypeFor(type, {title: true, after: 'associé_e_s'})}</h3>`
    str += `<div class="associates ${type}">`
    this.forEachAssociate(type, function(ev){
      str += ev.asAssociate(options)
    })
    str += '</div>'
  }
  return str
}

})

Object.defineProperties(FAEvent.prototype,{
  link:{
    get(){return `-&gt; <a onclick="current_analyse.locator.setRTime(${this.time})">E #${this.id}</a>`}
  }
})
