'use strict'
/**
 * Class EventForm
 * ---------------
 * Gère le formulaire d'édition et de création d'un évènement de tout type
 *
 * Note : on part du principe qu'il n'y a qu'un EventForm en tant que classe,
 * qui gère seulement l'analyse courante. Quand il y aura plusieurs analyses
 * étudiées en même temps, on ne pourra plus utiliser cet objet, il faudra
 * en créer un par analyse active.
 */
class EventForm {

static init(){
  var my = this

  my = null
}

static get a(){return current_analyse}

static reset(){
  delete this.currentForm
  delete this.lastId
  delete this._eventForms
  this.videoWasPlaying = false
  $('form.form-edit-event').remove()
}

/**
  Pour faire tourner une méthode sur tous les formulaires
  créés.
**/
static forEachForm(fn){
  for(var form_id in this.eventForms){
    if(false === fn(this.eventForms[form_id])) break
  }
}

// Les formulaires déjà initiés (et donc cachés dans le DOM)
static get eventForms(){
  if(undefined===this._eventForms){this._eventForms = {}}
  return this._eventForms
}
// static set eventForms(v){this._eventForms = v}

static get videoController(){ return this.a.videoController }

//
static onClickNewEvent(ev, eventType){
  if('string' !== typeof(eventType) ){ eventType = eventType.attr('data-type')}
  ev && ev.stopPropagation()
  this.videoWasPlaying = !!this.a.locator.playing
  if(this.a.locator.playing) this.a.locator.togglePlay()
  if (eventType == 'scene' && this.notConfirmNewScene() ) return false
  var eForm = new EventForm(eventType)
  this.eventForms[eForm.id] = eForm
  eForm.toggleForm()
}

/**
 * Méthode appelée à la création d'une nouvelle scène, pour s'assurer
 * qu'il n'en existe pas déjà une.
 * @return  true si la scène est trop proche, false si la scène peut être
 *          créée.
 *
 * Plus précisément, la fonction interdit de créer une scène à moins de
 * 2 secondes. Mais si l'autre scène est entre 2 et 10 secondes, elle demande
 * confirmation.
 */
static notConfirmNewScene(){
  var sceneFound = this.filmHasSceneNearCurrentPos()
  if (sceneFound){
    let [iScene, ecart] = sceneFound
    if (ecart < 2) {
      alert(T('scene-to-close'))
      return true
    } else {
      if(!confirm(T('confirm-scene-close',{ecart: ecart}))){
        return true
      }
    }
  }
  return false
}

/**
 * Méthode qui renvoie NULL si le film ne possède pas de scène autour
 * du temps courant (à 10 secondes près) et qui retourne l'instance
 * FAEscene si une scène a été trouvée.
 */
static filmHasSceneNearCurrentPos(){
  var curtime = Math.round(this.a.locator.getRTime())
  var sceneFound = null
  FAEscene.forEachScene(function(sc){
    if (curtime.between(sc.time - 5, sc.time + 5)){
      sceneFound = sc
      return false // pour stopper la boucle
    }
  })
  if (sceneFound) return [sceneFound, Math.abs(curtime - sceneFound.time)]
  // console.log("sceneFound:", sceneFound, sceneFound && sceneFound.time)
}

static editEvent(ev){
  if('number' === typeof ev) ev = this.a.ids[ev]
  var eForm
  this.playing && this.a.locator.togglePlay()
  if(undefined === this.eventForms[ev.id]){
    this.eventForms[ev.id] = new EventForm(ev)
  }
  this.eventForms[ev.id].toggleForm()
}

// Pour obtenir un nouvel identifiant
static newId(){
  if (undefined === this.lastId){ this.lastId = -1 }
  return ++ this.lastId
}

/**
  @return {String}  les <option> définissant les types
                    de scènes définies dans le fichier
                    data/data_scenes.yaml
**/
static optionsTypes(typ){
  if(undefined === this._optionsTypes) this._optionsTypes = {}
  if(undefined === this._optionsTypes[typ]){
    var p = path.join(APPFOLDER,'app','js','data',`data_${typ}.yaml`)
    let dataE = YAML.safeLoad(fs.readFileSync(p,'utf8'))
    var opts = []
    for(var ktype in dataE['types']){
      opts.push(`<option value="${ktype}">${dataE['types'][ktype].hname}</option>`)
    }
    this._optionsTypes[typ] = opts.join(RC)
    opts = null
  }
  return this._optionsTypes[typ]
}

// ---------------------------------------------------------------------
//  INSTANCE

/**
 * Instanciation du formulaire
 *
 *  Il peut être instancié avec :
 *    - le type de l'évènement (=> création)
 *    - avec l'identifiant de l'évènement (=> édition, event à charger)
 *    - avec les données de l'évènement
 *    - avec l'instance de l'évènement
 */
constructor(foo){
  this.isNew    = false
  this.analyse = this.a = current_analyse // pourra être redéfini plus tard
  switch (typeof foo) {
    case 'string':
      // <= Un type
      // => C'est une création
      this._id    = EventForm.newId()
      this._type  = foo
      this.isNew  = true
      this._time  = this.a.locator.getRTime() || 0
      break
    case 'number':
      // <= L'ID de l'évènement
      // => Il faut prendre ses données pour édition
      this._event = this.a.getEventById(foo)
      break
    case 'object':
      // <= Les données ou l'évènement lui-même
      // => Prendre les données si c'est l'évènement
      if('function'===typeof(foo.showDiffere)){ this._event = foo }
      else { this._event = this.a.getEventById(ev.id) }
      break
    default:
      throw("Il faut penser à traiter les autres cas")
  }
  return this
}

get inited(){ return this._initied || false}   // mis à true à l'initialisation
set inited(v){ this._inited = v }

get modified(){return this._modified || false}
set modified(v){
  this._modified = v
  this.jqObj[v?'addClass':'removeClass']('modified')
}

get event(){ return this._event }
get id(){
  if(undefined === this._id){this._id = this.event.id}
  return this._id
}
get type(){
  if(undefined === this._type){this._type = this.event.type}
  return this._type
}
get time(){
  if(undefined === this._time){this._time = this.event.time}
  return this._time
}

/**
 * Initialisation de l'objet, appelée quand l'analyse courante est
 * prête.
 */
init(){
  // console.log("-> EventForm#init")
  if(this.initied){throw("Je ne dois pas pouvoir initier deux fois le formulaire…")}
  if(!this.built) this.fwindow.build().observe()
  if (this.isNew){
    if(this.type === 'scene') this.setNumeroScene()
  } else {
    this.setFormValues()
  }

  this.inited = true
  // console.log("<- EventForm#init")
  return true
}


  /**
   * Pour basculer des boutons d'évènements au formulaire
   */
toggleForm(){
  if(!this.inited){this.init()}
  this.fwindow.toggle.bind(this.fwindow)()
}

onShow(){
  this.jqField('destroy').css('visibility',this.isNew?'hidden':'visible')
  // Les décors peuvent avoir changé à chaque fois
  this.peupleDecors()
}

/**
 * Méthode qui construit le formulaire pour l'évènement
 */
build(){
  return DCreate('FORM', {
    id: `form-edit-event-${this.id}`
  , class: 'form-edit-event'
  , inner: TEMP_EVENT_FORM_BUILDER(this.type)
            .replace(/__EID__/g, this.id)
            .replace(/__SAVE_BUTTON_LABEL__/,this.isNew?'CRÉER':'MODIFIER')
  })
}
afterBuilding(){
  var jqo = this.jqObj
    , typ = this.type
    , eid = this.id
    ;

  // --- Valeurs définies ---
  this.jqf('id').val(eid)
  this.jqf('type').val(typ)
  this.jqf('is_new').val(this.isNew?'1':'0')
  this.jqf('destroy').css('visibility',this.isNew?'hidden':'visible')
  this.jqf('time').html(this.a.locator.getRTime())
  this.jqf('duration').html(this.duration)
  jqo.find('.footer .event-id').html(`event #${eid}`)
  jqo.find('.footer .event-time').html(new OTime(this.time).horloge)

  // On règle les boutons Play (mais seulement si l'event est défini)
  this.isNew || BtnPlay.setAndWatch(jqo, eid)

  // On rend les champs horlogeable et durationables
  let horloges = UI.setHorlogeable(jqo[0])
  // L'horloge de position de l'évènement
  this.horlogePosition = horloges[`event-${eid}-time`]
  this.horlogePosition.dispatch({
      time: this.time
    , synchroVideo: true
    , parentModifiable: this
  }).showTime()

  let hdurees = UI.setDurationable(jqo[0])
  // L'horloge de durée de l'évènement
  this.horlogeDuration = hdurees[`event-${eid}-duration`]
  this.horlogeDuration.dispatch({
      duration: this.duration || 10
    , startTime: parseFloat(this.time)
    , synchroVideo: true
    , parentModifiable: this
  }).showTime()

  // Si c'est pour un nœud structurel, il faut peupler le menu des types
  if (typ === 'stt'){
    var dataStt = (this.a._PFA || require('./js/common/PFA/PFA-mini')).DATA_STT_NODES
    var mstt = jqo.find('.event-sttID')
    mstt.append(DCreate('OPTION', {value: '', inner: 'Choisir l’ID du nœud'}))
    for(var nid in dataStt){
      var dstt = dataStt[nid]
      mstt.append(DCreate('OPTION', {value: nid, inner: dstt.hname}))
    }
  } else if (typ === 'scene'){
    // Si c'est une scène il faut peupler avec les décors existants
    // this.peupleDecors()
    this.peupleTypesScenes()
  } else if (typ === 'proc'){
    // Pour les procédés, tout dépend de là où on en est : si le procédé
    // est défini, il faut l'afficher directement (en le recherchant dans
    // sa catégorie [1]). Sinon, on affiche simplement le menu principal
    // des catégories.
    //
    // [1] Cela rallonge un peu les procédures, mais permet de ne pas avoir
    // un classement trop rigide. En plus, on fait un seul tour pour classer
    // tous les procédés
    //
    // Pour le moment, je mets le menu principal
    if(this.event && this.event.procType){
      // Un procédé précis
    } else {
      this.implementeMenuCategorieProcedes()
    }

  } else if (this.type === 'qrd'){
    // Pour le moment, juste pour empêcher de peupler les types, qui
    // n'existent pas pour les qrd.
    // TODO Mais plus tard, il faudra rationnaliser un peu tout ça.
  } else {
    // Pour les autres types, on a un menu type
    this.peupleTypes()
  }
  jqo = eid = typ = null
  this.built = true
}


// ---------------------------------------------------------------------
//  Méthodes pour les PROCÉDÉS

/**
  Méthode (appelée par FAProcede) qui procède à l'actualisation
  du menu procédé courant (catégorie, sous-catégorie ou procédés)
**/
updateMenusProcedes(){
  let mProcedes     = this.jqObj.find('.div-proc-types select.menu-procedes')
    , mSCategories  = this.jqObj.find('.div-proc-types select.menu-sous-categories-procedes')
    , mCategories   = this.jqObj.find('.div-proc-types select.menu-categories-procedes')
  if(mProcedes.length){
    let proc_id = mProcedes.val()
    this.implementeMenuProcedes(mProcedes.attr('data-cate-id'), mProcedes.attr('data-scate-id'), proc_id)
  } else if (mSCategories.length){
    this.implementeMenuSousCategorieProcedes(mSCategories.attr('data-cate-id'))
  } else {
    this.implementeMenuCategorieProcedes()
  }
}
implementeMenuForProcedes(domMenu, fn_onchange, value){
  if (undefined === value) value = ''
  let menuproc = this.jqObj.find('.div-proc-types select')
  menuproc.off('change')
  menuproc.replaceWith(domMenu)
  menuproc = this.jqObj.find('.div-proc-types select') // l'autre
  menuproc.on('change', this[fn_onchange].bind(this))
  menuproc.val(value) // le premier menu ou le choisi
}

implementeMenuCategorieProcedes(){
  this.implementeMenuForProcedes(
    FAProcede.menuCategories(),
    'onChooseCategorieProcedes'
  )
}
implementeMenuSousCategorieProcedes(cate_id){
  this.implementeMenuForProcedes(
    FAProcede.menuSousCategories(cate_id),
    'onChooseSousCategorieProcedes'
  )
}
implementeMenuProcedes(cate_id, scate_id, value){
  this.implementeMenuForProcedes(
    FAProcede.menuProcedes(cate_id, scate_id,this.id),
    'onChooseProcede', value || ''
  )
}
onChooseCategorieProcedes(e){
  this.implementeMenuSousCategorieProcedes($(e.target).val())
}
onChooseSousCategorieProcedes(e){
  let scate_id = $(e.target).val()
    , cate_id  = $(e.target).attr('data-cate-id')
  if(scate_id == '..'){
    this.implementeMenuCategorieProcedes()
  } else {
    this.implementeMenuProcedes(cate_id, scate_id, this.id)
  }
}
onChooseProcede(e){
  let proc_id = $(e.target).val()
  if(proc_id == '..'){
    // Il faut revenir à la sous-catégorie
    let cate_id  = $(e.target).attr('data-cate-id')
      , scate_id = $(e.target).val('data-scate-id')
    this.implementeMenuSousCategorieProcedes(cate_id)
  } else {
    // On peut en rester là car le menu porte l'identifiant
    // qu'il faut pour ramasser la valeur avec `getFormValues`
  }
}

// /FIN méthodes pour les PROCÉDÉS
// ---------------------------------------------------------------------



// ---------------------------------------------------------------------
//  MÉTHODES POUR LES DÉCORS

onChooseDecor(){
  var decor = this.menuDecors.val()
  this.jqField('inputtext1').val(decor)
  this.peupleSousDecors(decor)
}
onChooseSousDecor(){
  this.jqField('inputtext2').val(this.menuSousDecors.val())
}
peupleDecors(){
  this.menuDecors.html(FADecor.optionsDecors.bind(FADecor))
}
peupleSousDecors(decor){
  this.menuSousDecors.html(FADecor.data[decor].optionsSousDecors.bind(FADecor.data[decor]))
}

get menuDecors(){return this._menuDecors||defP(this,'_menuDecors', this.jqObj.find('select.decors'))}
get menuSousDecors(){return this._menuSousDecors||defP(this,'_menuSousDecors', this.jqObj.find('select.sous_decors'))}

// FIN des menus DECORS
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// MÉTHODES DE GESTION DES TYPES (pour tous les types)

/**
  Méthode pour éditer les types +typ+ en ouvrant leur fichier
  (dans le writer ?)

  Note : le nom 'data_<typ>' correspond au nom du fichier
**/
modifyDataTypes(e, typ){
  if(undefined === typ) typ = this.type
  FAWriter.openDoc(`data_${typ}`)
}

updateTypes(e, typ){
  if(undefined === typ) typ = this.type
  if(EventForm._optionsTypes && EventForm._optionsTypes[typ]){
    delete EventForm._optionsTypes[typ]
  }
  this.peupleTypes(typ)
  F.notify(`Liste des types « ${typ} » actualisée.`)
}
peupleTypes(typ){
  if(undefined === typ) typ = this.type
  this.menuTypes(typ).html(EventForm.optionsTypes(typ))
}
menuTypes(typ){
  return this.jqObj.find(`select.${typ}-types`)
}
// ---------------------------------------------------------------------
//  MÉTHODES POUR LES SCÈNES

peupleTypesScenes(){this.peupleTypes('scene')}
updateTypesScenes(){this.updateTypes(null, 'scene')}

// /Fin méthodes scènes
// ---------------------------------------------------------------------

get jqf(){return this.jqField.bind(this)}

// Retourne l'ID du champ pour la propriété (ou autre) +prop+
// Par convention, tous les champs ont un ID : "event-<id event>-<property>"
fieldID(prop){
  return `#event-${this.id}-${prop}`
}
jqField(prop){
  return $(this.fieldID(prop))
}
domField(prop){
  return DGet(`event-${this.id}-${prop}`)
}

synchronizePitchAndResume(e){
  if(undefined === this.pitchAndResumeSynchronizable){this.checkIfSynchronizable()}
  if(this.pitchAndResumeSynchronizable){
    this.jqField('content').val(this.jqField('titre').val())
  }
}
// Méthode qui regarde si le synopsis est synchronisable avec le pitch
checkIfSynchronizable(e){
  this.pitchAndResumeSynchronizable = this.jqField('content').val() == ''
}

// ---------------------------------------------------------------------
//  Méthodes d'évènement

observe(){
  var my = this
  this.jqObj.find('.btn-form-cancel').on('click', my.cancel.bind(my))
  this.jqObj.find('.btn-form-submit').on('click', my.submit.bind(my))
  this.jqObj.find('.btn-form-destroy').on('click', my.destroy.bind(my))
  // Toutes les modifications de texte doivent entrainer une activation du
  // bouton de sauvegarde
  this.jqObj.find('textarea, input, select').on('change', ()=>{this.modified = true})

  // Quand le type de l'event est scene et que le résumé est vide,
  // on synchronise le pitch avec le résumé
  if(this.type === 'scene' && this.isNew){
    this.jqField('titre').on('keyup', my.synchronizePitchAndResume.bind(my))
    this.jqField('content').on('keyup', my.checkIfSynchronizable.bind(my))
  }

  // Bouton pour actualiser le menu des types de tout élément et pour éditer
  // le fichier de données
  this.jqObj.find('.btn-update-types').on('click', my.updateTypes.bind(my))
  this.jqObj.find('.btn-modify-types').on('click', my.modifyDataTypes.bind(my))

  let dataDrop = Object.assign({}, DATA_DROPPABLE, {
    drop: (e, ui) => {
      var balise = this.a.getBaliseAssociation(this.event, ui.helper, e)
      if(balise && ['', 'INPUT', 'TEXTAREA'].indexOf(e.target.tagName) > -1){
        $(e.target).insertAtCaret(balise)
      } else if(e.target.className.indexOf('event-parent') > -1){
        this.setParent(ui.helper)
      }
    }
  })

  // Les champs d'édition doit pouvoir recevoir des drops
  my.jqObj.find('textarea, input[type="text"], select').droppable(dataDrop)
  my.jqObj.find('.header').droppable(dataDrop)

  // Quand le div pour déposer un parent (ou autre) est affiché, on doit
  // le rendre droppable
  let parentField = my.jqObj.find('div.event-parent')
  if(parentField.is(':visible')) parentField.droppable(dataDrop)

  // Pour savoir si l'on doit éditer dans les champs de texte ou
  // dans le mini-writer
  UI.miniWriterizeTextFields(this.jqObj, this.a.options.get('option_edit_in_mini_writer'))

  // Si l'event est une scène, on observe le menu décor et
  // sous décor
  if(this.type === 'scene'){
    this.menuDecors.on('change', this.onChooseDecor.bind(this))
    this.menuSousDecors.on('change', this.onChooseSousDecor.bind(this))
  } else if (this.type === 'proc'){
    $('button.btn-info-proc').on('click', FAProcede.showDescriptionOf.bind(FAProcede,this.id))// prop aux procédés, celui-là
    $('div.div-proc-types button.update').on('click', FAProcede.updateData.bind(FAProcede)) // ATTENTION : button commun
  }
  my = null
}

submit(){
  var my = this

  // Si c'est une modification, on prend le temps initial pour savoir
  // s'il a bougé. S'il n'a pas bougé, il sera inutile de faire l'update
  // dans l'analyse courante
  var initTime = this.isNew ? null : Math.round(this.event.time)

  var [data_min, other_data] = this.getFormValues()

  // Création d'objet particulier, qui ne sont pas des sous-classes
  // de FAEvent
  switch (data_min.type) {
    case 'dim':
      // TODO Création d'un diminutif
      throw("Je ne sais pas encore créer une DIMINUTIF")
      return
    case 'brin':
      // TODO Création d'un brin
      throw("Je ne sais pas encore créer un BRIN")
      return
  }

  // console.log("Champs trouvés:", fields)
  // console.log("Data finale min:", data_min)
  // console.log("Data finale autres:", other_data)

  // On crée ou on update l'évènement
  if(this.isNew){
    // CRÉATION
    // On crée l'évènement du type voulu
    var eClass = eval(`FAE${data_min.type}`)
    this._event = new eClass(this.a, data_min)
  } else {
    this.event.data = data_min // ça va les dispatcher
  }
  // Et on dispatche les autres données
  this.event.dispatch(other_data)
  if (this.event.isValid) {
    if(this.isNew){
      // CRÉATION
      this.a.addEvent(this.event)
      if('function' === typeof this.event.onCreate) this.event.onCreate()
    } else {
      // ÉDITION
      this.a.updateEvent(this.event, {initTime: initTime})
      if('function' === typeof this.event.onModify) this.event.onModify()
    }
  }

  if (this.event.isValid){
    this.isNew = false // il a été enregistré, maintenant
    this.modified = false
    this.endEdition()
  } else if(this.event.firstErroredFieldId) {
    // En cas d'erreur, on focus dans le premier champ erroné (s'il existe)
    $(this.event.firstErroredFieldId).focus().select()
  }

  my = null
}

/**
 * Demande destruction de l'élément
 */
destroy(){
  if(!confirm(T('confirm-destroy-event'))) return
  this.jqObj.remove()
  this.a.destroyEvent(this.id, this)
}
/**
 * En cas d'annulation de l'édition
 */
cancel(){
  // console.log("Je renonce à l'édition de l'event")
  this.endEdition()
}

endEdition(){
  this.fwindow.hide()
  this.videoWasPlaying && this.a.locator.togglePlay()
}

// ---------------------------------------------------------------------
//  Méthode pour les données dans le formulaire


/**
  Réglage du parent lorsqu'on glisse un event dessus
  (par exemple pour les éléments dynamiques)
  Note : ici, on ne signale aucune erreur, on enregistre simplement l'id
  du parent dans le champ hidden approprié et on règle la valeur du parent
  pour le connaitre.
  C'est à l'event, lors de son enregistrement, de vérifier que la valeur
  est correcte (méthode `isValid`).
**/
setParent(helper){
  let parent_id = parseInt(helper.attr('data-id'),10)
    , pev = this.a.ids[parent_id]
  // On le mémorise dans le champ hidden qui sera soumis
  this.jqField('parent').val(parent_id)
  // On affiche un "résumé" du parent
  this.jqObj.find('.parent-designation').html(DFormater(`Ev.#${pev.id} (${pev.htype}) « ${pev.titre} »`))
}

/**
 * Si c'est une édition, on doit mettre les valeurs courantes dans les
 * champs.
 */
setFormValues(){
  var prop, sufProp, otime
  // Les valeurs communes
  for(prop of FAEvent.OWN_PROPS){
    if(null === this.event[prop] || undefined === this.event[prop]) continue
    if (this.jqField(prop).length){
      this.jqField(prop).val(this.event[prop])
    } else {
      // console.log("Le champs pour la propriété n'existe pas :", prop)
    }
    // console.log(`J'ai mis le champ '${this.fieldID(prop)}' à "${this.event[prop]}"`)
  }
  // Réglage spécial des temps 'time', 'duration', 'tps_reponse'
  for(prop of ['time', 'duration', 'tps_reponse']){
    otime = new OTime(this.event[prop])
    this.jqf(prop).html(prop == 'duration' ? this.event.hduree : otime.horloge)
  }
  // Les valeurs propres au type d'event
  for(prop of this.event.constructor.OWN_PROPS){
    if('string' === typeof(prop)){ // cf. la définition des OWN_PROPS
      sufProp = prop
    } else {
      [prop, sufProp] = prop
    }
    if(null === this.event[prop] || undefined === this.event[prop]) continue
    this.jqField(sufProp).val(this.event[prop])
    // console.log(`J'ai mis le champ '${this.fieldID(sufProp)}' à "${this.event[prop]}"`)
  }
  if(this.type === 'stt'){
    this.domField('sttID').disabled = true
  }
}

setNumeroScene(){
  // On ne numérote pas une scène "générique"
  if(this.event && this.event.isGenerique) return
  var numero
  if (this.isNew || !this.event.numero) {
    // <= C'est une scène et son numéro n'est pas défini
    // => Il faut définir le numéro de la scène en fonction de son temps
    numero = 1 + this.a.getSceneNumeroAt(this.time)
  } else {
    numero = this.event.numero
  }
  this.jqField('numero').val(numero)
  // console.log("type/numero", this.type, numero)
  numero = null
}

/**
 * Méthode qui récupère les valeurs dans le formulaire
 *
 */
getFormValues(){
  var my = this
  // --- Les champs communs à tous les types ---
  var data_min    = {}
  var other_data  = {}

  data_min.id       = getValOrNull(this.fieldID('id'), {type: 'number'})
  data_min.titre    = getValOrNull(this.fieldID('titre'))
  data_min.type     = getValOrNull(this.fieldID('type'))  // p.e. 'scene'
  data_min.isNew    = getValOrNull(this.fieldID('is_new')) === '1'
  data_min.content  = getValOrNull(this.fieldID('content'))
  data_min.note     = getValOrNull(this.fieldID('note'))
  data_min.time     = getValOrNull(this.fieldID('time'), {type: 'horloge'})
  data_min.duration = getValOrNull(this.fieldID('duration'), {type: 'duree'})

  // console.log("data_min:", data_min)

  // On récupère toutes les données (ça consiste à passer en revue tous
  // les éléments de formulaire qui ont la classe "f<type>")
  var ftype = `f${data_min.type}`
    , fields = []
    , idSansPref = null
    , err_msg

  $('select,input[type="text"],input[type="hidden"],textarea,input[type="checkbox"]')
    .filter(function(){
      // On filtre pour ne prendre que les champs valides, c'est-à-dire ceux
      // qui portent la class `f<type>`
      return /* $(this).id && */ ($(this).hasClass(ftype) || $(this).hasClass('fall') ) && !$(this).hasClass(`-${ftype}`)
    })
    .each(function(){
      if(this.id){
        idSansPref = this.id.replace(`event-${my.id}-`,'') // attention this != my ici
        // Des erreurs se produisent parfois ici, je préfère mettre dans un
        // try pour mieux les appréhender
        try {
          var val = getValOrNull(this.id)
        } catch (e) {
          err_msg = `ERREUR dans getValOrNull avec:${RC}this.id: '${this.id}'${RC}idSansPref: '${idSansPref}'${RC}ERREUR: ${e}`
          log.error(err_msg)
          console.error(err_msg)
          F.error(`Erreur avec '${this.id}'. Consultez le log.`)
          val = undefined
        }
        other_data[idSansPref] = val
        // Pour vérification
        fields.push(this.id)
      }
    })

  // console.log({
  //   fields: fields, data_min: data_min, other_data: other_data
  // })
  my = null
  return [data_min, other_data]
}
//getFormValues

// ---------------------------------------------------------------------

// La flying-window contenant le formulaire
get fwindow(){
  return this._fwindow || defP(this,'_fwindow', new FWindow(this,{container: document.body, x: this.videoLeft + 10, y:80}))
}
// Retourne le left de la vidéo (en fait, sa width) pour pouvoir placer, au
// départ, le formulaire à côté d'elle.
get videoLeft(){return this.a.videoController.video.width}
// Le formulaire lui-même
get form(){return this._form || defP(this,'_form', DGet(`form-edit-event-${this.id}`))}
// Idem, normalement, le formulaire
get jqObj(){return this._jqObj || defP(this,'_jqObj', $(this.form))}

}

// Template du formulaire d'édition de l'évènement
const TEMP_EVENT_FORM_BUILDER = require('./js/composants/EventForm_builder.js').bind(EventForm)
