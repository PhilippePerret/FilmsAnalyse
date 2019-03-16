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

  static reset(){
    delete this.currentForm
    delete this._lastId
    delete this._eventForms
    this.videoWasPlaying = false
    $('form.form-edit-event').remove()
  }

  // Les formulaires déjà initiés (et donc cachés dans le DOM)
  static get eventForms(){
    if(undefined===this._eventForms){this._eventForms = {}}
    return this._eventForms
  }
  // static set eventForms(v){this._eventForms = v}

  static get videoController(){ return current_analyse.videoController }

  //
  static onClickNewEvent(ev, eventType){
    if('string' !== typeof(eventType) ){ eventType = eventType.attr('data-type')}
    if (ev) ev.stopPropagation()
    this.videoWasPlaying = !!current_analyse.locator.playing
    if(current_analyse.locator.playing) current_analyse.locator.togglePlay()
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
   * Scene si une scène a été trouvée.
   */
  static filmHasSceneNearCurrentPos(){
    var curtime = parseInt(current_analyse.locator.getRTime(),10)
    var sceneFound = null
    Scene.forEachScene(function(sc){
      if (sceneFound) return // pour accélérer
      if (curtime.between(sc.time - 5, sc.time + 5)){
        sceneFound = sc
      }
    })
    if (sceneFound) return [sceneFound, Math.abs(curtime - sceneFound.time)]
    // console.log("sceneFound:", sceneFound, sceneFound && sceneFound.time)
  }


  static editEvent(ev){
    var eForm
    if(this.playing) this.analyse.locator.togglePlay()
    if(undefined === this.eventForms[ev.id]){
      this.eventForms[ev.id] = new EventForm(ev)
    }
    this.eventForms[ev.id].toggleForm()
  }

  // Pour obtenir un nouvel identifiant
  static newId(){
    return ++ this.lastId // est-ce que ça fonctionne ?
  }
  static get lastId(){
    if (undefined === this._lastId){ this._lastId = -1 }
    return this._lastId
  }
  static set lastId(v){
    this._lastId = v
    // console.log("Last ID mis à ", this._lastId)
  }

  /**
   * Met le formulaire +form+ (instance EventForm) en formulaire courant (donc
   * devant)
   */
  static setCurrent(form){
    if(this.currentForm) this.currentForm.bringToBack()
    this.currentForm = form
    this.currentForm.bringToFront()
  }
  static unsetCurrent(form){
    if(this.currentForm == form){
      this.currentForm = null
    }
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
    this.analyse  = current_analyse // pourra être redéfini plus tard
    switch (typeof foo) {
      case 'string':
        // <= Un type
        // => C'est une création
        this._id    = EventForm.newId()
        this._type  = foo
        this.isNew  = true
        this._time  = this.analyse.locator.getRTime() || 0
        break
      case 'number':
        // <= L'ID de l'évènement
        // => Il faut prendre ses données pour édition
        this._event = current_analyse.getEventById(foo)
        break
      case 'object':
        // <= Les données ou l'évènement lui-même
        // => Prendre les données si c'est l'évènement
        if('function'===typeof(foo.showDiffere)){ this._event = foo }
        else { this._event = current_analyse.getEventById(ev.id) }
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
    if(!this.built){
      this.build()
      this.observeForm()
    }

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
    this[this.visible?'hide':'show']()
  }

  show(){
    this.jqObj.show()
    this.visible = true
    this.jqField('destroy').css('visibility',this.isNew?'hidden':'visible')
    EventForm.setCurrent(this)
  }
  hide(){
    this.jqObj.hide()
    this.visible = false
    EventForm.unsetCurrent(this)
  }
  /**
   * Méthode qui construit le formulaire pour l'évènement
   */
  build(){
    var f = document.createElement('FORM')
    f.id = `form-edit-event-${this.id}`
    f.className = "form-edit-event"
    document.body.appendChild(f)
    f.innerHTML = EVENT_FORM_TEMP.replace(/__EID__/g, this.id).replace(/__SAVE_BUTTON_LABEL__/,this.isNew?'CRÉER':'MODIFIER')
    // document.body.appendChild(EVENT_FORM_TEMP.replace(/__EID__/g, this.id))
    // --- Champs à voir et à masquer --
    this.jqObj.find('.ff').hide()
    this.jqObj.find(`.f${this.type}`).show()
    this.jqObj.find(`.fall`).show()
    this.jqObj.find(`.-f${this.type}`).hide()

    // --- Valeurs définies ---
    this.jqField('id').val(this.id)
    this.jqField('type').val(this.type)
    this.jqField('is_new').val(this.isNew?'1':'0')
    this.jqField('destroy').css('visibility',this.isNew?'hidden':'visible')
    this.jqField('time').val(parseInt(this.analyse.locator.getRTime(),10))
    this.jqObj.find('section.footer span.event-type').html(this.type.toUpperCase())
    this.jqObj.find('section.header span.event-type').html(this.type.toUpperCase())
    this.jqObj.find('section.footer span.event-id').html(`event #${this.id}`)
    this.jqObj.find('section.footer span.event-time').html(new OTime(this.time).horloge)

    // On règle les boutons Play (mais seulement si l'event est défini)
    this.isNew || BtnPlay.setAndWatch(this.jqObj, this.id)

    // On rend les champs horlogeable et durationables
    let horloges = UI.setHorlogeable(f)
    // L'horloge de position de l'évènement
    this.horlogePosition = horloges[`event-${this.id}-time`]
    this.horlogePosition.dispatch({
        time: this.time
      , synchroVideo: true
      , parentModifiable: this
    }).showTime()

    let hdurees = UI.setDurationable(f)
    // L'horloge de durée de l'évènement
    this.horlogeDuration = hdurees[`event-${this.id}-duration`]
    this.horlogeDuration.dispatch({
        duration: this.duration || 10
      , startTime: parseFloat(this.time)
      , synchroVideo: true
      , parentModifiable: this
    }).showTime()

    // Si c'est pour un nœud structurel, il faut peupler le menu des types
    if (this.type === 'stt'){
      var dataStt = (current_analyse._PFA || require('./js/common/PFA/PFA-mini')).DATA_STT_NODES
      var mstt = this.jqObj.find('.event-sttID')
      var o = document.createElement('OPTION')
      o.value = ''
      o.innerHTML = 'Choisir l’ID du nœud'
      mstt.append(o)
      for(var nid in dataStt){
        o = document.createElement('OPTION')
        var dstt = dataStt[nid]
        o.value     = nid
        o.innerHTML = dstt.hname
        mstt.append(o)
      }
    }

    this.built = true
    f = null
  }

  /**
   * Méthode pour ramener le formulaire au premier plan
   */
  bringToFront(){
    this.jqObj.css('z-index', '1000')
  }
  bringToBack(){
    this.jqObj.css('z-index', '50')
  }

  // Retourne l'ID du champ pour la propriété (ou autre) +prop+
  // Par convention, tous les champs ont un ID : "event-<id event>-<property>"
  fieldID(prop){
    return `#event-${this.id}-${prop}`
  }
  jqField(prop){
    return $(this.fieldID(prop))
  }
  domField(prop){
    return document.getElementById(`event-${this.id}-${prop}`)
  }

  observeForm(){
    var my = this
    this.jqObj.on('click', EventForm.setCurrent.bind(EventForm, my))
    this.jqObj.draggable()
    this.jqObj.find('.btn-form-cancel').on('click', my.cancel.bind(my))
    this.jqObj.find('.btn-form-submit').on('click', my.submit.bind(my))
    this.jqObj.find('.btn-form-destroy').on('click', my.destroy.bind(my))

    // Toutes les modifications de texte doivent entrainer une activation du
    // bouton de sauvegarde
    this.jqObj.find('textarea, input, select').on('change', ()=>{this.modified = true})
    my = null
  }


  submit(){
    var my = this

    // Si c'est une modification, on prend le temps initial pour savoir
    // s'il a bougé. S'il n'a pas bougé, il sera inutile de faire l'update
    // dans l'analyse courante
    var initTime = this.isNew ? null : parseInt(this.event.time,10)

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
      this._event = new eClass(current_analyse, data_min)
    } else {
      this.event.data = data_min // ça va les dispatcher
    }
    // Et on dispatche les autres données
    this.event.dispatch(other_data)
    if (this.event.isValid) {
      if(this.isNew){
        // CRÉATION
        current_analyse.addEvent(this.event)
        if('function'===this.event.onCreate) this.event.onCreate()
      } else {
        // ÉDITION
        current_analyse.updateEvent(this.event, {initTime: initTime})
        if('function' === this.event.onModify) this.event.onModify()
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
    if(!confirm("Êtes-vous certain de vouloir détruire à tout jamais cet event ?")) return
    this.jqObj.remove()
    this.analyse.destroyEvent(this.id, this)
  }
  /**
   * En cas d'annulation de l'édition
   */
  cancel(){
    // console.log("Je renonce à l'édition de l'event")
    this.endEdition()
  }

  endEdition(){
    this.hide()
    this.videoWasPlaying && this.analyse.locator.togglePlay()
  }

  // ---------------------------------------------------------------------
  //  Méthode pour les données dans le formulaire

  /**
   * Si c'est une édition, on doit mettre les valeurs courantes dans les
   * champs.
   */
  setFormValues(){
    var prop, sufProp
    // Les valeurs communes
    for(prop of FAEvent.OWN_PROPS){
      if(null === this.event[prop] || undefined === this.event[prop]) continue
      this.jqField(prop).val(this.event[prop])
      // console.log(`J'ai mis le champ '${this.fieldID(prop)}' à "${this.event[prop]}"`)
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
    if(this.event && this.event.sceneType === 'generic') return
    var numero
    if (this.isNew || !this.event.numero) {
      // <= C'est une scène et son numéro n'est pas défini
      // => Il faut définir le numéro de la scène en fonction de son temps
      numero = 1 + current_analyse.getSceneNumeroAt(this.time)
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
    var fields = []
    var idSansPref = null
    $('select,input[type="text"],textarea,input[type="checkbox"]')
      .filter(function(){
        return ( $(this).hasClass(ftype) || $(this).hasClass('fall') ) && !$(this).hasClass(`-${ftype}`)
      })
      .each(function(){
        idSansPref = this.id.replace(`event-${my.id}-`,'') // attention this != my ici
        other_data[idSansPref] = getValOrNull(this.id)
        // Pour vérification
        fields.push(this.id)
      })

    my = null
    return [data_min, other_data]
  }
  //getFormValues

  // ---------------------------------------------------------------------

  get form(){
    if(undefined===this._form){this._form = DGet(`form-edit-event-${this.id}`)}
    return this._form
  }
  get jqObj(){
    if(undefined === this._jqObj){this._jqObj = $(this.form)}
    return this._jqObj
  }
}

// Template du formulaire d'édition de l'évènement
const EVENT_FORM_TEMP = `
  <input type="hidden" id="event-__EID__-id" />
  <input type="hidden" id="event-__EID__-is_new" />
  <input type="hidden" id="event-__EID__-type" />

  <section class="header no-user-selection">
    <span class="event-type">...</span>
  </section>

  <section class="form">

    <!--  DIV SUPÉRIEUR avec : Temps, durée ou numéro -->

    <div class="div-infos-temporelles no-user-selection">
      <button class="btnplay right" size="30"></button>
      <label>Position</label>
      <horloge class="small" id="event-__EID__-time" value="">...</horloge>
      <label>Durée</label>
      <duree id="event-__EID__-duration" class="small durationable">...</duree>
    </div>

    <div class="div-form">
      <label class="ff finfo fpp fdialog fscene fproc">Type</label>
      <label class="ff fstt">Type du Nœud</label>

      <select class="event-sttID ff fstt" id="event-__EID__-sttID">
        <!-- sera rempli automatiquement à l'init de l'UI -->
      </select>

      <select class="ff fscene" id="event-__EID__-sceneType">
        <option value="n/d">N/D</option>
        <option value="generic">Générique</option>
        <option value="expo">Expositionnelle</option>
        <option value="action">Action</option>
        <option value="dialogue">Dialogue</option>
        <option value="rencontre">Rencontre</option>
        <option value="rencontre">Travail</option>
      </select>

      <select class="ff faction" id="event-__EID__-actionType">
        <option value="n/d">(sans type)</option>
        <option value="inner">Physique</option>
        <option value="conflit">Intellectuelle</option>
        <option value="conflit">Artistique</option>
      </select>

      <select class="ff fdialog" id="event-__EID__-dialType">
        <option value="n/d">(sans type)</option>
        <option value="inner">Intérieur</option>
        <option value="conflit">Conflictuel</option>
        <option value="conflit">Confident</option>
        <option value="conflit">informatif</option>
      </select>

      <select class="ff finfo" id="event-__EID__-infoType">
        <option value="n/d">(sans type)</option>
        <option value="pers">Personnage</option>
        <option value="intr">Intrigue</option>
        <option value="them">Thème</option>
      </select>

      <select class="ff fproc" id="event-__EID__-procType">
        <option value="n/d">...</option>
        <option value="pp">Préparation/paiement</option>
        <option value="irdr">Ironie dramatique</option>
        <option value="revc">Révélateur de changement</option>
        <option value="idea">Idéalisation</option>
        <option value="autre">Autre…</option>
      </select>

      <select class="ff fpp" id="event-__EID__-ppType">
        <option value="prep">Préparation</option>
        <option value="expl">Exploitation</option>
        <option value="paie">Paiement/Résolution</option>
        <option value="canc">Annulation</option>
      </select>
    </div>

    <div class="div-form">

      <!-- Champ pour le numéro de la scène -->
      <label class="ff fscene">Num.</label>
      <input type="text" id="event-__EID__-numero" class="temps-secondes ff fscene" disabled>

      <!-- Menu pour l'effet de la scène -->
      <select class="ff fscene" id="event-__EID__-lieu">
        <option value="int">INT.</option>
        <option value="ext">EXT.</option>
        <option value="extint">INT. & EXT.</option>
      </select>

      <!-- Menu pour le lieu de la scène -->
      <select class="ff fscene" id="event-__EID__-effet">
        <option value="jour">JOUR</option>
        <option value="nuit">NUIT</option>
        <option value="noir">NOIR</option>
        <option value="n/d">N.D.</option>
      </select>

    </div>

    <div class="div-form">
      <label for="event-__EID__-titre" class="-fscene">Titre générique (optionnel)</label>
      <label for="event-__EID__-titre" class="ff fscene">Pitch</label>
      <input type="text" id="event-__EID__-titre" class="bold" />
    </div>

    <div class="div-form">
      <label class="ff fscene">Décor</label>
      <label class="ff fdim">Diminutif</label>
      <label class="ff fdim">@</label>
      <label class="ff fqrd">Question</label>
      <label class="ff fpp">Préparation</label>
      <input type="text" class="ff fscene fpp fdim fqrd" id="event-__EID__-inputtext-1" />
    </div>

    <div class="div-form">
      <label class="ff fscene">Sous-décor</label>
      <label class="ff fdim">Signification</label>
      <label class="ff fqrd">Réponse</label>
      <label class="ff fpp">Paiement/résolution</label>
      <input type="text" class="ff fscene fpp fdim fqrd" id="event-__EID__-inputtext-2" />
      <div class="right ff fqrd fpp">
        <label>Temps</label>
        <input type="text" class="small horloge fqrd fpp" id="event-__EID__-tps_reponse" />
      </div>
    </div>

    <div class="div-form">
      <div>
        <label class="ff fscene fbrin">Résumé</label>
        <label class="ff finfo">Information</label>
        <label class="ff fevent faction fqd fpp fstt">Description</label>
        <label class="ff fdialog">Commentaire</label>
        <label class="ff fnote">Contenu de la note</label>
      </div>
      <textarea id="event-__EID__-content" rows="4"></textarea>
    </div>

    <div class="div-form">
      <label class="block">Note subsidiaire</label>
      <textarea id="event-__EID__-note" rows="3"></textarea>
    </div>

    <div class="event-form-buttons no-user-selection">
      <button id="event-__EID__-destroy" class="btn-form-destroy warning small fleft" type="button">Détruire</button>
      <button class="btn-form-cancel cancel small fleft" type="button">Renoncer</button>
      <button class="btn-form-submit main-button" type="button">__SAVE_BUTTON_LABEL__</button>
    </div>
  </section>

  <section class="footer no-user-selection">
    <span class="event-type">...</span>
    <span class="event-id">...</span>
    <span class="event-time">...</span>
  </section>
`
