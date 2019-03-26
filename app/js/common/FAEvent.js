'use strict'


class FAEvent {

static get OWN_PROPS(){return ['id', 'type', 'titre', 'time', 'duration', 'content', 'note', 'events', 'documents']}

constructor(analyse, data){
  this.analyse  = this.a = analyse

  // this.type     = data.type  // Sera défini par la sous-classe
  this.id       = parseInt(data.id,10)
  this.titre    = data.titre    // String
  this.time     = data.time     // Number
  this.duration = data.duration // Number (seconds)
  this.content  = data.content  // String
  this.note     = data.note     // String

  // Les éléments en relation
  this.events     = data.events || []
  this.documents  = data.documents || []

}

// Dès qu'on marque l'event modifié, ça marque l'analyse modifiée
set modified(v){
  this._modified = v
  if(v)this.a.modified = true
}

// Méthode pratique pour reconnaitre rapidement l'element
get isAEvent(){return true}
get isADocument(){return false}

// ---------------------------------------------------------------------
//  Méthodes d'helper

// Un lien cliquable pour se rendre au temps de l'event
get link(){
  return `-&gt; <a onclick="current_analyse.locator.setRTime(${this.time})">E #${this.id}</a>`
}
/**
 * Retourne le lien vers l'event
 * Pour remplacer par exemple une balise `event: <id>`
 *
 * Note : si ce texte est modifié, il faut aussi corriger les tests à :
 * ./app/js/TestsFIT/tests/Textes/fatexte_tests.js
 */
asLink(alt_text){
  if(undefined === this._asLink){
    this._asLink = `<a class="link-to-event" onclick="showEvent(${this.id})">__TIT__</a>`
  }
  return this._asLink.replace(/__TIT__/, (alt_text || this.title || this.content).trim())
}
asLinkScene(alt_text){
  if(undefined === this._asLinkScene){
    this._asLinkScene = `<a class="link-to-scene" onclick="showScene(${this.id})">__TIT__</a>`
  }
  return this._asLinkScene.replace(/__TIT__/, (alt_text || this.title || this.content).trim())
}

// ---------------------------------------------------------------------
//  Propriétés temporelles

// Pour la correspondance de nom, aussi
get startAt(){return this.time}
get endAt(){return this._endAt || defP(this,'_endAt',this.time + this.duration)}

// On utilise un getter et un setter pour réinitialiser d'autres propriétés
get time(){return this._time}
set time(v){ this._time = v ; delete this._horl ; delete this._otime }

get otime(){return this._otime || defP(this,'_otime',new OTime(this.time))}
get horloge(){return this._horl||defP(this,'_horl',this.otime.horloge)}

/**
 * Définition de la durée
 */
set duration(v){
  if('string' === typeof(v)){
    // <= la valeur est un string
    // => on vient du formulaire, il faut traiter
    v = v.trim();
    v = new OTime(v)
    v = v.seconds
  }
  this._duration = v
}
get duration(){return this._duration || 10}

// ---------------------------------------------------------------------
//  Méthodes d'association

addDocument(doc_id){
  this.documents.push(doc_id)
  this.modified = true
  return true
}
addEvent(event_id){
  if(this.id == event_id){
    return F.error(T('same-event-no-association'))
  } else {
    this.events.push(event_id)
    this.modified = true
  }
  return true
}

// ---------------------------------------------------------------------

/**
 * Méthode appelée en cas d'erreur.
 * +evt+ FAEvent concerné
 * +errors+ est une liste de tables qui doivent contenir :
 * :msg     Le message d'erreur
 * :prop    Le nom de la propriété, qui permettra de montrer le champ
 */
onErrors(evt, errors){
  var focusPrefix  = `#event-${evt.id}-`
  var focusFieldId = `${focusPrefix}${errors[0].prop}`
  F.notify(errors.map(function(d){
    $(`${focusPrefix}${d.prop}`).addClass('error')
    return d.msg
  }).join(RC), {error: true, duration: 'auto'})
  if($(focusFieldId).length) evt.firstErroredFieldId = focusFieldId
}
/**
 * Méthode qui affiche l'évènement de manière différée, en tenant compte du
 * temps courant
 */
showDiffere(){
  var my = this
  this.div //pour le construire
  var diff = ((my.time - this.analyse.locator.getRTime()) * 1000) - 300
  if ( diff < 0 ){ // ne devrait jamais arriver
    this.show()
  } else {
    this.timerShow = setTimeout(my.show.bind(my), diff)
  }
}
/**
 * Pour afficher l'évènement dans le reader de l'analyse
 */
show(){
  if(this.jqReaderObj && this.jqReaderObj.length){
    // <= l'objet DOM existe déjà
    // => On a juste à l'afficher
    this.jqReaderObj.show()
  } else {
    // <= L'objet DOM n'existe pas encore
    // => Il faut le construire en appelant this.div
    this.analyse.reader.append(this.div)
    this.observe()
  }
  this.makeAppear() // c'est l'opacité qui masque l'event affiché
}

hide(){
  this.makeDesappear()
  this.jqReaderObj.hide()
}

/**
 * Après édition de l'event, on peut avoir à updater son affichage dans
 * le reader. On va faire simplement un remplacement de div (le div du
 * contenu, pour ne pas refaire les boutons, etc.).
 */
updateInReader(new_idx){
  // Si l'event n'est pas affiché dans le reader (ou autre), on n'a rien
  // à faire. Par prudence, on a quand réinitialisé le _div qui avait peut-
  // être été défini lors d'un affichage précédent
  if(undefined === this.jqReaderObj){
    this._div = undefined
    return
  }
  delete this._contenu
  this.jqReaderObj.find('.content').replaceWith(this.contenu)

  if (undefined !== new_idx /* peut être 0 */) {
    // Si le temps de l'event a changé de façon conséquente, il faut
    // le replacer au bon endroit dans le reader. C'est la valeur de `new_idx`
    // qui le définit, undefined si l'event reste en place ou le nouvel index
    //
    // Rappel : l'new_idx est "calculé" après retrait de l'event de la liste,
    // il faut en tenir compte ici.
    // On met d'abord le noeud en dehors du reader
    $('#section-reader').append(this.jqReaderObj)
    var reader = DGet('reader')
    reader.insertBefore(this.domReaderObj, reader.childNodes[new_idx])

    this.updateInUI()
  }

  this.div.style.opacity = 1
}

/**
 * Les données "communes" qu'on doit actualiser dans tous l'interface, quel
 * que soit l'élément.
 */
updateInUI(){

  // Le temps se trouve toujours dans une balise contenant data-time, avec
  // le data-id défini
  $(`*[data-time][data-id="${this.id}"]`).attr('data-time',this.time)
  // TODO Il faut traiter l'horloge aussi
  $(`.horloge-event[data-id="${this.id}"]`).html(this.horloge)

}


makeAppear(){
  this.jqReaderObj.animate({opacity:1}, 600)
}
makeDesappear(){
  this.jqReaderObj.animate({opacity:0}, 600)
}

// ---------------------------------------------------------------------

get jqReaderObj(){
  if(undefined === this._jq_reader_obj ){
    this._jq_reader_obj = $(`#${this.domId}`)
  }
  if(this._jq_reader_obj.length == 0) this._jq_reader_obj = undefined
  return this._jq_reader_obj
}
get domReaderObj(){return this._domReaderObj||defP(this,'_domReaderObj',this.defineDomReaderObj())}

get domId(){ return `revent-${this.id}`}

get div(){
  if (undefined === this._div){
    // L'horloge des outils
    var h = DCreate('SPAN',{
      class:'horloge horloge-event'
    , attrs:{'data-id': this.id}
    , inner: this.otime.horloge
    })
    var be = DCreate('BUTTON', {class: 'btn-edit', inner: '<img src="./img/btn/edit.png" class="btn" />'})
    var br = DCreate('BUTTON', {class: 'btnplay left', attrs: {'size': 22}})

    var etools = DCreate('DIV',{class: 'e-tools', append:[br, be, h]})
    var cont = DCreate('DIV', {class:'content', inner: this.contenu})

    this._div = DCreate('DIV',{
      id: this.domId
    , class: `event ${this.type} EVT${this.id}`
    , style: 'opacity:0;'
    , attrs: {'data-time':this.time, 'data-id':this.id, 'data-type': 'event'}
    , append: [etools, cont]
    })
  }
  return this._div
}


get contenu(){return this._contenu||defP(this,'_contenu',this.defineContenu())}

// Définition du contenu, soit formaté d'une façon particulière par
// l'event propre, soit le content normal, dediminutivisé
defineContenu(){
  if('function' === typeof this.formateContenu){
    return this.formateContenu()
  } else {
    return this.fatexte.deDim(this.content)
  }
}

get fatexte(){return this._fatext||defP(this,'_fatext', new FATexte(this.content))}

/**
 * Les données qui seront enregistrées
 */
get data(){
  var d = {}
  for(var prop of FAEvent.OWN_PROPS){
    if(null === this[prop] || undefined === this[prop]) continue
    d[prop] = this[prop]
  }
  for(var prop of this.constructor.OWN_PROPS){
    if('string' !== typeof(prop)){ // cf. ci-dessous dans `dispatch`
      prop = prop[0]
    }
    if(null === this[prop] || undefined === this[prop]) continue
    d[prop] = this[prop]
  }
  return d
}

/**
 * Dispatch les données communes (autres que celles qui permettent à
 * l'instanciation et la création)
 */
set data(d){
  var fieldName ;
  for(var prop of FAEvent.OWN_PROPS){
    if(undefined === d[prop] && null === d[prop]) continue
    this[prop] = d[prop]
  }
}

dispatch(d){
  var fieldName ;
  for(var prop of this.constructor.OWN_PROPS){
    if('string' === typeof(prop)){
      // <= Seulement le nom de la propriété donnée
      // => Le champ s'appelle comme la propriété
      fieldName = prop
    } else {
      // <= Own prop donnée sous forme de array avec en première valeur le
      //    nom de la propriété dans l'évènement et en seconde valeur le
      //    nom du champ
      // => On met dans la propriété la valeur du champ
      fieldName = prop[1]
      prop      = prop[0]
    }
    if(undefined === d[fieldName]) continue
    this[prop] = d[fieldName]
  }
}

togglePlay(){
  if(this.playing){
    this.locator.stop()
  } else {
    // On met en route
    var t = this.time
    if(current_analyse.options.get('option_start_3secs_before_event')){t -= 3}
    this.locator.setRTime.bind(this.locator)(t)
    // On détermine la fin du jeu
    this.locator.setEndTime(t + this.duration, this.togglePlay.bind(this))
  }

  this.playing = !this.playing
  if(current_analyse.options.get('option_start_when_time_choosed')){
    this.imgBtnPlay[this.playing?'hide':'show']()
    this.imgBtnStop[this.playing?'show':'hide']()
  }
}

// ---------------------------------------------------------------------
// MÉTHODE D'ÉTAT

get isRealScene(){return this.type === 'scene' && this.sceneType !== 'generic'}

// ---------------------------------------------------------------------
//  DOM ÉLÉMENTS

get imgBtnPlay(){
  return this._imgBtnPlay || defP(this,'_imgBtnPlay',this.btnPlayETools.find('img.btn-play'))
}
get imgBtnStop(){
  return this._imgBtnStop || defP(this,'_imgBtnStop',this.btnPlayETools.find('img.btn-stop'))
}
get btnPlayETools(){
  return this._btnPlayETools || defP(this,'_btnPlayETools', this.jqReaderObj.find('.e-tools .btn-play'))
}

/** ---------------------------------------------------------------------
* Méthodes d'évènements
**/

onDropThing(e, ui){
  this.a.associateDropped(this, ui.helper)
  return stopEvent(e)
}

observe(container){
  var o = this.jqReaderObj
  o.find('.e-tools button.btn-edit').on('click', EventForm.editEvent.bind(EventForm, this))
  BtnPlay.setAndWatch(this.jqReaderObj, this.id)

  /**
  * On rend l'event droppable pour qu'il puisse recevoir d'autres events
  * ainsi que des documents
  **/
  o.droppable({
    accept: '.event, .doc'
  , tolerance: 'intersect'
  , drop: this.onDropThing.bind(this)
  , classes: {'ui-droppable-hover': 'survoled'}
  })
  /**
   * On rend l'event draggable pour pouvoir le déplacer sur un élément
   * dans lequel il doit être ajouté.
   * Mais pour que ça fonctionne, il faut le overflow du container soit
   * momentanément retiré, sinon l'event passe "en dessous" quand on le
   * déplace.
   */
  o.draggable({
      revert: true
    // , stack: 'section#section-eventers div.eventer div.pan-events'
    // , start: function(event, ui) { $(this).css("z-index", a++); }
    , classes:{
        'ui-draggable-dragging': 'myHighlight'
      }
    , start: ev => {
        if(container){
          container.old_overflow = container.css('overflow')
          container.css('overflow','visible')
        }
      }
    , stop: ev => {
        if(container){
          container.css('overflow', container.old_overflow)
        }
      }
  })
}

get locator(){return this.analyse.locator}

  // ---------------------------------------------------------------------
  // Gestion du Bouton BtnPlay
  // Cf. Le manuel de développement
  get btnPlay(){return this._btnPlay||defP(this,'_btnPlay',new BtnPlay(this))}

  // Pour définir le dom obj de l'event dans le Reader
  defineDomReaderObj(){
    var obj
    if (this.jqReaderObj) obj = this.jqReaderObj[0]
    return obj
  }

}

// Pour la compatibilité avec les autres types
class FAEevent extends FAEvent {
  constructor(analyse, data){
    super(analyse, data)
    this.type = 'event'
  }
  get div(){
    return super.div
  }
}
