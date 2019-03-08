'use strict'
/**
 * Class EventForm
 * ---------------
 * Gère le formulaire d'édition et de création d'un évènement de tout type
 */
class EventForm {

  static init(){
    // Tous les boutons pour créer un nouvel élément doivent réagir
    // au click.
    var my = this
    $('#buttons-new-event button').on('click', function(ev){ EventForm.onClickNewEvent.bind(EventForm)(ev, $(this)) })
    my = null
  }

  static onClickNewEvent(ev, o){
    ev.stopPropagation()
    this.videoWasPlaying = !!VideoController.playing
    if(VideoController.playing) VideoController.onTogglePlay()
    new EventForm(o.attr('data-type')).toggleForm()
  }

  // Pour obtenir un nouvel identifiant
  static newId(){
    return ++ this.lastId // est-ce que ça fonctionne ?
  }
  static get lastId(){
    if (undefined === this._lastId){ this._lastId = -1 }
    return this._lastId
  }
  static set lastId(v){ this._lastId = v }

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
    var ev
    this.isNew = false
    switch (typeof foo) {
      case 'string':
        // <= Un type
        // => C'est une création
        this.id     = EventForm.newId()
        this.type   = foo
        this.isNew  = true
        this.time   = VideoController.getRTime() || 0
        break
      case 'number':
        // <= L'ID de l'évènement
        // => Il faut prendre ses données pour édition
        ev = FAnalyse.getEventById(foo)
        break
      case 'object':
        // <= Les données ou l'évènement lui-même
        // => Prendre les données si c'est l'évènement
        if('function'===typeof(foo.showDiffere)){ ev = foo }
        else { ev = FAnalyse.getEventById(ev.id) }
        break
      default:
        throw("Il faut penser à traiter les autres cas")
    }
  }

  get inited(){ return this._initied || false}   // mis à true à l'initialisation
  set inited(v){ this._inited = v }

  /**
   * Initialisation de l'objet, appelée quand l'analyse courante est
   * prête.
   */
  init(){
    if(this.initied){throw("Je ne dois pas pouvoir initier deux fois le formulaire…")}
    this.toggleForm(false)
    this.observeForm()
    this.inited = true
  }

    /**
     * Pour basculer des boutons d'évènements au formulaire
     */
  toggleForm(){
    if(!this.built){
      this.build()
      this.observeForm()
    }
    this[this.visible?'hide':'show']()
  }

  show(){
    this.jqForm.show()
    this.visible = true
    EventForm.setCurrent(this)
  }
  hide(){
    this.jqForm.hide()
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
    this.jqForm.find('.ff').hide()
    this.jqForm.find(`.f${this.type}`).show()
    this.jqForm.find(`.fall`).show()
    this.jqForm.find(`.-f${this.type}`).hide()

    // --- Valeurs définies ---
    $(this.fieldID('id')).val(this.id)
    $(this.fieldID('type')).val(this.type)
    $(this.fieldID('is_new')).val(this.isNew?'1':'0')
    $(this.fieldID('time')).val(parseInt(VideoController.getRTime(),10))
    this.jqForm.find('section.footer span.event-type').html(this.type.toUpperCase())
    this.jqForm.find('section.footer span.event-id').html(`event #${this.id}`)
    this.jqForm.find('section.footer span.event-time').html(new OTime(this.time).horloge)
    this.built = true
    f = null
  }

  /**
   * Méthode pour ramener le formulaire au premier plan
   */
  bringToFront(){
    this.jqForm.css('z-index', '1000')
  }
  bringToBack(){
    this.jqForm.css('z-index', '50')
  }

  // Retourne l'ID du champ pour la propriété (ou autre) +prop+
  // Par convention, tous les champs ont un ID : "event-<id event>-<property>"
  fieldID(prop){
    return `#event-${this.id}-${prop}`
  }

  observeForm(){
    var my = this
    this.jqForm.on('click', EventForm.setCurrent.bind(EventForm, my))
    this.jqForm.draggable()
    this.jqForm.find('.btn-form-cancel').on('click', my.cancel.bind(my))
    this.jqForm.find('.btn-form-submit').on('click', my.submit.bind(my))
    my = null
  }


  submit(){

    // TODO On doit récupérer toutes les données
    var data_min = {}
    data_min.id       = getValOrNull(this.fieldID('id'))
    data_min.type     = getValOrNull(this.fieldID('type'))  // p.e. 'scene'
    data_min.isNew    = getValOrNull(this.fieldID('is_new'))

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

    data_min.time     = parseInt(getValOrNull(this.fieldID('time')),10)
    data_min.note     = getValOrNull(this.fieldID('note'))
    data_min.duration = getValOrNull(this.fieldID('duration'))
    data_min.content  = getValOrNull(this.fieldID('content'))

    // On récupère toutes les données (ça consiste à passer en revue tous
    // les éléments de formulaire qui ont la classe "f<type>")
    var ftype = `f${data_min.type}`
    var fields = []
    var other_data = {}
    var idSansPref = null
    $('select,input[type="text"],textarea,input[type="checkbox"]')
      .filter(function(){
        return $(this).hasClass(ftype)
      })
      .each(function(){
        idSansPref = this.id.replace(/event\-(?:[0-9]+)\-/,'')
        other_data[idSansPref] = getValOrNull(this.id)
        // Pour vérification
        fields.push(this.id)
      })

    console.log("Champs trouvés:", fields)
    console.log("Data finale min:", data_min)
    console.log("Data finale autres:", other_data)

    // On crée ou on update l'évènement
    if(data_min.is_new == '0'){
      // ÉDITION
      throw("Je ne sais pas encore traiter la modification de données")
    } else {
      // CRÉATION
      // On crée l'évènement du type voulu
      var eClass = eval(`FAE${data_min.type}`)
      var e = new eClass(data_min)
      // Et on lui dispatch les autres données
      console.log("e avant:", e)
      e.dispatch(other_data)
      console.log("e après:", e)
      // On ajoute l'évènement à l'analyse, mais seulement s'il est valide
      if (e.isValid) current_analyse.newEvent(e)
    }
    if (e.isValid){
      this.endEdition()
    } else {
      // En cas d'erreur, on focus dans le premier champ erroné
      $(e.firstErroredFieldId).focus().select()
    }
  }

  /**
   * En cas d'annulation de l'édition
   */
  cancel(){
    console.log("Je renonce à l'édition de l'event")
    this.endEdition()
  }

  endEdition(){
    this.hide()
    // Si la vidéo jouait quand on a créé l'évènement, on la remet en route
    if(this.videoWasPlaying)VideoController.onTogglePlay()
  }

  get form(){
    if(undefined===this._form){this._form = document.getElementById(`form-edit-event-${this.id}`)}
    return this._form
  }
  get jqForm(){
    if(undefined === this._jqForm){this._jqForm = $(this.form)}
    return this._jqForm
  }
}

// Template du formulaire d'édition de l'évènement
const EVENT_FORM_TEMP = `
  <input type="hidden" id="event-__EID__-id" />
  <input type="hidden" id="event-__EID__-is_new" />
  <input type="hidden" id="event-__EID__-type" />
  <input type="hidden" id="event-__EID__-time" />

  <section class="form">

    <!-- Un div flottant pour définir la durée (pour tous) -->
    <div id="div-duration" class="ff fall -fscene fright">
      <label for="event-__EID__-duration">Durée</label>
      <input type="text" id="event-__EID__-duration" class="temps-secondes" placeholder="[[h,]m,]secs">
    </div>

    <div class="div-form">
      <label class="ff finfo fpp fdialog fscene fproc">Type</label>

      <select class="ff fscene" id="event-__EID__-sceneType">
        <option value="generic">Générique</option>
        <option value="expo">Expositionnelle</option>
        <option value="action">Action</option>
        <option value="dialogue">Dialogue</option>
        <option value="rencontre">Rencontre</option>
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

      <!-- Menu pour l'effet de la scène -->
      <select class="ff fscene" id="event-__EID__-lieu">
        <option value="int">INT.</option>
        <option value="ext">EXT.</option>
        <option value="extint">INT. & EXT.</option>
      </select>

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
        <label class="ff fevent faction fqd fpp">Description</label>
        <label class="ff fdialog">Commentaire</label>
      </div>
      <textarea id="event-__EID__-content" rows="4"></textarea>
    </div>

    <div class="div-form">
      <label class="block">Note</label>
      <textarea id="event-__EID__-note" rows="3"></textarea>
    </div>

    <div class="event-form-buttons">
      <button class="btn-form-cancel fleft" type="button">Renoncer</button>
      <button class="btn-form-submit" type="button">__SAVE_BUTTON_LABEL__</button>
    </div>
  </section>

  <section class="footer">
    <span class="event-type">...</span>
    <span class="event-id">...</span>
    <span class="event-time">...</span>
  </section>
`
