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
  @param {Object} options Options à utiliser
                          :no_warn    Si true, pas d'avertissement pour dire que
                                      c'est un modèle non personnalisé par
                                      la sous-classe.
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
    case 'pitch':
      // Pour le méthode qui répondent à la méthode `asPitch`
      // à commencer par la scène
      str = this.asPitch(opts)
      break
    case 'full':
      // Affiche complet, avec toutes les informations
      // TODO Pour le moment, c'est ce format qui est utilisé pour le reader,
      // mais ce n'est peut-être pas la meilleure option.
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

  if(flag & FORMATED) str = DFormater(str, opts)

  if(flag & ESCAPED){
    // Note : il exclut editable et linked
    str = str.replace(/<(.*?)>/g, '')
    str = str.replace(/\"/g, '\\\"')
    str = str.replace(/[\n\r]/,' --- ')
  } else if ( flag & EDITABLE ){
    // Note : il exclut LINKED
    str = this.linkedToEdit(str)
    // console.log("str:", str)
  } else if(flag & LINKED){
    str = this.linked(str)
  }


  return str
}
,
// Version courte commune
asShort(opts){
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
  str += `<span class="${this.type} EVT${this.id}">`
  str += `${this.asShort(opts)}`
  if(!opts || !opts.no_warm) str += this.warnCommonMethod
  str += this.divAssociates('events')
  str += this.divAssociates('documents')
  str += this.divAssociates('times')
  str += '</span>'
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
    this._asLink = `<a class="lkevent" onclick="showEvent(${this.id})">[voir]</a>`
  }
  return `${(alt_text || this.title || this.content).trim()} ${this._asLink}`
}
,
asLinkToEdit(str){
  if(undefined === this._asLinkToEdit){
    this._asLinkToEdit = `<a class="lkevent" onclick="EventForm.editEvent.bind(EventForm)(${this.id})">[edit]</a>`
  }
  return `${(alt_text || this.title || this.content).trim()} ${this._asLinkToEdit}`
}
,
// Alias
linked(str){ return this.asLink(str) }

// Alias
, linkedToEdit(str){ return this.asLinkToEdit(str)}

/**

  Retourne le div contenant les associés de type +type+ ou un
  string vide.

  @param  {String} type Le type ('event', 'document' ou 'time')
          {Object} Les options.
  @return {String} Le code HTML
**/
, divAssociates(type){
    let my = this
    var options
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
        if(undefined === ev){
          log.error(`[FAEvent#divAssociates] Event non défini dans la boucle "forEachAssociate" de l'event #${my.id}:${my.type}`)
        } else {
          str += ev.asAssociate(options)
        }
      })
      str += '</div>'
    }
    return str
  }

, divNote(opts){
    if(this.note){
      return `<div class="note"><label>Note : </label>${this.note}</div>`
    } else {
       return ''
    }
  }

/**
  Retourne le div des éléments associés qui ajoute des procédés,
  des notes, des informations, des documents, etc.
**/
, divAssociates(opts){
    let str = ''
    this.events.forEach( eid => str += FAEvent.get(eid).as('associate', FORMATED, opts) )
    // this.events.forEach( function(ev){
    //   console.log("ev divAssociates:", ev)
    //   str += ev.as('associate', FORMATED, opts)
    // })
    return str
  }


})

Object.defineProperties(FAEvent.prototype,{
  /**
    Retourne le div qui s'affichera dans le reader

    Son contenu propre provient de la méthode `as('full')` donc
    de la méthode `asFull` qui devrait être propre à l'event.

    @return {DOMElement} Le div à placer dans le reader
  **/
  div:{
    get(){
      if (undefined === this._div){
        // flag pour la méthode 'as'
        var asFlag = FORMATED
        if(this.type !== 'scene') asFlag = asFlag | LABELLED
        // L'horloge des outils
        var h = DCreate('SPAN',{
          class:'horloge horloge-event'
        , attrs:{'data-id': this.id}
        , inner: this.otime.horloge
        })
        var be = DCreate('BUTTON', {class: 'btn-edit', inner: '<img src="./img/btn/edit.png" class="btn" />'})
        var br = DCreate('BUTTON', {class: 'btnplay left', attrs: {'size': 22}})

        var etools = DCreate('DIV',{class: 'e-tools', append:[br, be, h]})
        var cont = DCreate('DIV', {class:'content', inner: this.as('full', asFlag)})

        this._div = DCreate('DIV',{
          id: this.domId
        , class: `reader-event event ${this.type} EVT${this.id}`
        , style: 'opacity:0;'
        , attrs: {'data-time':this.time, 'data-id':this.id, 'data-type': 'event'}
        , append: [etools, cont]
        })
      }
      return this._div
    }
  }
, link:{
    get(){return `-&gt; <a onclick="current_analyse.locator.setRTime(${this.time})">E #${this.id}</a>`}
  }
// Méthode de warning pour indiquer que la version d'affichage courante
// est une version commune à tous les events, pas adaptée à l'event en
// particulier. Elle s'affichera jusqu'à ce que l'event en particulier
// possède sa propre méthode d'helper.
, warnCommonMethod: {
    get(){
      return '<div class="small"><span class="small">Cette version est la version commune d’affichage de l’event. Pour une version personnalisée, créer la méthode `asFull`.</span></div>'
    }
  }

})
