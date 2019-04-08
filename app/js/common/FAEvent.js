'use strict'

class FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return ['id', 'type', 'titre', 'time', 'duration', 'content', 'note', 'events', 'documents', 'times']}

/**
  Mémorise tous les events qui ont été créés ou modifiés au cours
  de la séance pour les enregistrer de façon séparée dans un dossier
  de backup, histoire d'avoir une copie en cas de problème. Ce backup
  contiendra donc une sorte d'historique des modifications.
**/
static addModified(evt){
  if(undefined === this.modifieds) this.modifieds = []
  this.modifieds.push(evt.id)
  this.a.modified = true
}

/**
  Méthode qui sauve dans le backup les events modifiés
**/
static saveModifieds(){
  var my = this
  if(undefined === this.modifieds || 0 === this.modifieds.length) return

  var dataModifieds = {}
  for(var mod_id of this.modifieds){
    if(undefined === this.a.ids[mod_id]){
      // <= L'event mod_id n'est pas défini
      // => C'est une destruction qui a été effectuée
      dataModifieds[mod_id] = 'DESTROYED'
    } else {
      dataModifieds[mod_id] = this.a.ids[mod_id].data
    }
  }
  // On peut enregistrer cette liste
  fs.writeFile(my.pathModifieds(), JSON.stringify(dataModifieds), 'utf8', (err) => {
    if(err) throw(err)
    // Sinon, tout est OK, les modifiés ont été sauvegardés
    delete my.modifieds
  })
  dataModifieds = null
}
/**
  Retourne le path du fichier ou mettre les modifiés du moment
**/
static pathModifieds(){return path.join(this.folderModifieds,`${new Date().getTime()}.json`)}
static get folderModifieds(){
  if(undefined === this._folderModifieds){
    this._folderModifieds = path.join(this.a.folderBackup, 'events')
    if(!fs.existsSync(this._folderModifieds)) fs.mkdirSync(this._folderModifieds)
  }
  return this._folderModifieds
}

static get a(){return current_analyse}

// ---------------------------------------------------------------------
//  INSTANCE

/**

  [1] Certaines vieilles versions ne définissaient pas obligatoirement
      la durée de l'event.
**/
constructor(analyse, data){
  this.analyse  = this.a = analyse

  // this.type     = data.type  // Sera défini par la sous-classe
  this.id       = parseInt(data.id,10)
  this.titre    = data.titre    // String
  this.time     = data.time.round(2)     // Number
  this.duration = (data.duration||10).round(2) // Number (seconds) [1]
  this.content  = data.content  // String
  this.note     = data.note     // String

  // Les éléments en relation
  this.events     = data.events     || []
  this.documents  = data.documents  || []
  this.times      = data.times      || []

}

// Dès qu'on marque l'event modifié, ça marque l'analyse modifiée
// On utilise aussi les sauvegardes de protection en mémorisant l'identiant
// de cet event qu'il faudra sauvegarder
set modified(v){
  // console.log(`-> modified de ${this.id} (${this.titre})`)
  this._modified = v
  if(v){
    FAEvent.addModified(this)
    this.a.modified = true
  }
}

reset(){
  delete this._asLink
  delete this._endAt
  delete this._otime
  delete this._horl
  delete this._div
  delete this._contenu
}

// Méthode pratique pour reconnaitre rapidement l'element
get isAEvent(){return true}
get isADocument(){return false}

// ---------------------------------------------------------------------
//  Méthodes d'helper


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
  v = v.round(2)
  if (v != this._duration){
    this._duration  = v
    this.modified   = true
    this.reset()
  }
}
get duration(){return this._duration || (this.type === 'scene' ? 60 : 10)}

// Alias
get description(){return this.content}

// ---------------------------------------------------------------------
//  Méthodes d'association

addDocument(doc_id){
  if(this.documents.indexOf(doc_id) < 0){
    this.documents.push(doc_id)
    this.modified = true
  }
  return true // car on peut, par exemple, vouloir mettre plusieurs balises
              // dans le texte
}
addEvent(event_id){
  if(this.id == event_id){
    return F.error(T('same-event-no-association'))
  } else if (this.events.indexOf(event_id) < 0) {
    this.events.push(event_id)
    this.modified = true
  }
  return true // même remarque que ci-dessus
}

addTime(time){
  if(this.times.indexOf(time) < 0){
    this.times.push(time)
    this.modified = true
  }
}

/**

  Répète la méthode +fn+ sur tous les events associés de
  type +type+ (le nom du type au pluriel, comme la propriété)

  @param {String} type  Soit 'events', 'documents', 'times'
  @return {Void}

**/
forEachAssociate(type, fn){
  if(type==='times' || type === 'time'){
    for(var assoEvent of this[type]){
      if(false === fn(new OTime(assoEvent))) break;
    }
  } else {
    for(var assoEvent of this[type]){
      if(false === fn(this.a.ids[assoEvent])) break;
    }
  }
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
    this.a.reader.append(this)
    this.observe()
  }
  this.makeAppear() // c'est l'opacité qui masque l'event affiché
  // Trop mou ou trop rapide avec scrollIntoView. Rien de vaut la méthode
  // old-school
  this.domReaderObj.parentNode.scrollTop = this.domReaderObj.offsetTop
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

/**
  Retourne le div qui s'affichera dans le reader

  Son contenu propre provient de la méthode `as('full')` donc
  de la méthode `asFull` qui devrait être propre à l'event.

  @return {DOMElement} Le div à placer dans le reader
**/
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
    var cont = DCreate('DIV', {class:'content', inner: this.as('full', FORMATED)})

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


// Méthode de warning pour indiquer que la version d'affichage courante
// est une version commune à tous les events, pas adaptée à l'event en
// particulier. Elle s'affichera jusqu'à ce que l'event en particulier
// possède sa propre méthode d'helper.
get warnCommonMethod(){
  return '<div class="small"><span class="small">Cette version est la version commune d’affichage de l’event. Pour une version personnalisée, créer la méthode `asFull`.</span></div>'
}

divNote(opts){
  if(this.note){
    return `<div class="note"><label>Note : </label>${this.note}</div>`
  } else {
     return ''
  }
}

/**
  Retourne le div des éléments associés qui ajoute des procédés,
  des notes, des informations, etc.
**/
divAssociates(opts){
  let str = ''
  this.events.forEach( ev => str += ev.as('associate', FORMATED, opts) )
  return str
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
    if(undefined === d[prop] || null === d[prop]) continue
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

observe(container){
  var my = this
  var o = this.jqReaderObj
  o.find('.e-tools button.btn-edit').on('click', EventForm.editEvent.bind(EventForm, this))
  BtnPlay.setAndWatch(this.jqReaderObj, this.id)

  /**
  * On rend l'event droppable pour qu'il puisse recevoir d'autres events
  * ainsi que des documents
  **/
  o.droppable({
    accept: '.event, .doc, .dropped-time'
  , tolerance: 'intersect'
  , drop: function(e,ui){
      my.a.associateDropped(my, ui.helper)
    }
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
    , helper: 'clone'
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
get htype(){return 'Évènement'}

}
