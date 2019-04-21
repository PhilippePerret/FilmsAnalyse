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
                    définis dans chaque fichier data
                    p.e. `data/data_scenes.yaml`. Mais ce fichier peut ne pas
                    exister.
**/
static optionsTypes(typ){
  if(undefined === this._optionsTypes) this._optionsTypes = {}
  if(undefined === this._optionsTypes[typ]){
    var p = path.join(APPFOLDER,'app','js','data',`data_${typ}.yaml`)
    if(false == fs.existsSync(p)) return '' // "dépeuplera" le menu
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
    var mstt = jqo.find('.stt-types')
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
  this.jqField('shorttext1').val(decor)
  this.peupleSousDecors(decor)
}
onChooseSousDecor(){
  this.jqField('shorttext2').val(this.menuSousDecors.val())
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
    this.jqField('longtext1').val(this.jqField('titre').val())
  }
}
// Méthode qui regarde si le synopsis est synchronisable avec le pitch
checkIfSynchronizable(e){
  this.pitchAndResumeSynchronizable = this.jqField('longtext1').val() == ''
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
    this.jqField('longtext1').on('keyup', my.checkIfSynchronizable.bind(my))
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

  // Les champs d'édition répondent au cmd-enter pour soumettre le
  // formulaire (enfin… façon de parler)
  my.jqObj.find('textarea, input[type="text"], input[type="checkbox"], select').on('keydown', this.onKeyDownOnTextFields.bind(this))

  // Quand le div pour déposer un parent (ou autre) est affiché, on doit
  // le rendre droppable
  let parentField = my.jqObj.find('div.event-parent')
  parentField.droppable(dataDrop)

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

  var all_data = this.getFormValues()
  this.isNew = all_data.is_new

  // On crée ou on update l'évènement
  if(this.isNew){
    // CRÉATION
    // On crée l'évènement du type voulu
    var eClass = eval(`FAE${all_data.type}`)
    this._event = new eClass(this.a, all_data)
  } else {
    this.event.dispatch(all_data)
  }
  // Et on dispatche les autres données

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
    this.isNew    = false // il a été enregistré, maintenant
    this.modified = false
    this.endEdition()
  } else if(this.event.firstErroredFieldId) {
    // En cas d'erreur, on focus dans le premier champ erroné (s'il existe)
    $(this.event.firstErroredFieldId).focus().select()
  }

  my = null
}

/**
 * Demande de destruction de l'élément
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
  Note : ici, on ne signale aucune erreur, on enregistre simplement l'id
  du parent dans le champ hidden approprié et on règle la valeur du parent
  pour le connaitre.
  C'est à l'event, lors de son enregistrement, de vérifier que la valeur
  est correcte (méthode `isValid`).
**/
setParent(helper){
  let parent_id = parseInt(helper.attr('data-id'),10)
    , pev = this.a.ids[parent_id]
  if(this.id == parent_id) return F.notify(T('event-not-itself-parent'), {error: true})
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
  var prop, fieldSufid, otime

  for(prop of this.event.constructor.ALL_PROPS){

    // La propriété, dans ALL_PROPS, peut être définie soit par la propriété
    // elle-même (donc un string), soit par un duet avec en première valeur
    // le nom de la propriété, et en seconde valeur le nom du champ qui doit
    // recevoir la valeur de cette propriété
    if('string' === typeof(prop)){ // cf. la définition des OWN_PROPS
      fieldSufid = prop
    } else {
      [prop, fieldSufid] = prop
    }

    if(null === this.event[prop] || undefined === this.event[prop]) continue

    switch(prop){
      case 'duration':
      case 'time':
      case 'tps_reponse':
        otime = new OTime(this.event[prop])
        this.jqf(fieldSufid).html(prop == 'duration' ? this.event.hduree : otime.horloge)
        this.jqf(fieldSufid).attr('value', (prop == 'duration' ? this.event.duree : this.event[prop]).round(2))
        break
      default:
        // Si un champ existe avec cette propriété, on peut la mettre
        if (this.jqField(fieldSufid).length){
          this.jqField(fieldSufid).val(this.event[prop])
        }
    }


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
    , all_data = {}
    , prefId = `event-${this.id}-`
    , prop
    , id
    , val


  // On boucle sur tous les éléments d'édition du formulaire
  var dform = {}
  $(`form#form-edit-event-${this.id}`)
    .find(`select, input[type="text"], input[type="hidden"], input[type="checkbox"], textarea`)
    .each(function(i, o){
      id    = o.id
      // Si un élément n'a pas d'identifiant, c'est qu'il n'est pas à considérer
      if(!id) return
      prop  = id.replace(prefId, '')
      val   = ((prop, val) => {
        // console.log("prop, val init:", prop, val)
        if(null === val) return null
        else if ('n/d' === val) return undefined
        switch(prop){
          // Tout ce qui doit être transformé en nombre
          case 'id':
          case 'parent':
            return parseInt(val,10)
          // Tout ce qui doit être transformé en flottant
          case 'time':
          case 'duration':
            return parseFloat(val).round(2)
          case 'is_new':
            return val == '1'
          default:
            return val
        }
      })(prop, getValOrNull(o.id))
      all_data[prop] = val
      // console.log({id:id, prop:prop, val: val})
    })
    // Les temps
    for(prop of ['time', 'duration']){
      all_data[prop] = parseFloat($(`form#form-edit-event-${this.id} #event-${this.id}-${prop}`).attr('value'))
    }

    // console.log("all_data:", all_data)

    this.isNew = dform.is_new

  my = null
  return all_data // pour le moment


}
//getFormValues

// ---------------------------------------------------------------------
//  Méthodes d'évènements

onKeyDownOnTextFields(e){
  // console.log("-> EventForm#onKeyDownOnTextFields")
  if(e.metaKey){
    if(e.keyCode === KRETURN){
      this.submit()
      return stopEvent(e)
    }
    // else {
    //   stopEvent(e)
    //   console.log("e.keyCode, e.charCode, e.which, e.key", e.keyCode, e.charCode, e.which, e.key)
    //   return false
    // }
  }
  return true
}

// ---------------------------------------------------------------------


// La flying-window contenant le formulaire
get fwindow(){
  return this._fwindow || defP(this,'_fwindow', new FWindow(this,{container: document.body, x: this.left, y:80}))
}
// Position left de la fenêtre du formulaire, pour qu'elle soit bien placée
// par rapport à la vidéo.
get left(){
  if(undefined === this._left){
    let vl = this.a.videoController.video.width
    this._left = vl + Math.round(((ScreenWidth - vl) - 460) / 2)
  }
  return this._left
}
// Le formulaire lui-même
get form(){return this._form || defP(this,'_form', DGet(`form-edit-event-${this.id}`))}
// Idem, normalement, le formulaire
get jqObj(){return this._jqObj || defP(this,'_jqObj', $(this.form))}

}

// Template du formulaire d'édition de l'évènement
const TEMP_EVENT_FORM_BUILDER = require('./js/composants/EventForm_builder.js').bind(EventForm)
