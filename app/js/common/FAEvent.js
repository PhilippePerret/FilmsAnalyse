'use strict'


class FAEvent {

  constructor(analyse, data){
    this.analyse  = analyse

    // this.type     = data.type  // Sera défini par la sous-classe
    this.id       = parseInt(data.id,10)
    this.titre    = data.titre    // String
    this.time     = data.time     // Number
    this.duration = data.duration // Number (seconds)
    this.content  = data.content  // String
    this.note     = data.note     // String

    this.events   = data.events


  }

  // ---------------------------------------------------------------------
  //  Méthodes d'helper

  // Un lien cliquable pour se rendre au temps de l'event
  get link(){
    return `-&gt; <a onclick="current_analyse.locator.setRTime(${this.time})">E #${this.id}</a>`
  }

  // ---------------------------------------------------------------------
  //  Propriétés temporelles

  get otime(){return this._otime || defineP(this,'_otime',new OTime(this.time))}
  get horloge(){return this._horl||defineP(this,'_horl',this.otime.horloge)}

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
    if(!this.jqReaderObj){
      this.analyse.reader.append(this.div)
      this.observe()
    }
    this.makeAppear() // c'est l'opacité qui masque l'event affiché
  }

  /**
   * Après édition de l'event, on peut avoir à updater son affichage dans
   * le reader. On va faire simplement un remplacement de div.
   */
  updateInReader(){
    if(undefined === this.jqReaderObj) return // il n'existe pas
    this._div = undefined
    this.jqReaderObj.replaceWith(this.div)
    this.div.style.opacity = 1
    this.observe()
  }

  makeAppear(){
    this.jqReaderObj.animate({opacity:1}, 600)
  }

  get jqReaderObj(){
    if(undefined === this._jq_reader_obj ){
      this._jq_reader_obj = $(`#${this.domId}`)
    }
    if(this._jq_reader_obj.length == 0) this._jq_reader_obj = undefined
    return this._jq_reader_obj
  }

  get domId(){ return `revent-${this.id}`}

  get div(){
    if (undefined === this._div){
      var n = document.createElement('DIV')
      n.className = `event ${this.type}`
      n.id = this.domId
      n.style.opacity = 0
      n.setAttribute('data-time', this.time)

      var etools = document.createElement('DIV')
      etools.className = 'e-tools'
      var h = document.createElement('SPAN')
      h.className = "horloge"
      h.innerHTML = this.otime.horloge
      var be = document.createElement('BUTTON')
      be.className = 'btn-edit'
      be.innerHTML = '<img src="./img/btn/edit.png" class="btn" />'
      var br = document.createElement('BUTTON')
      br.className = 'btn-play'
      br.innerHTML =
          '<img src="./img/btns-controller/btn-play.png" class="small-btn-controller btn-play" />'
        + '<img src="./img/btns-controller/btn-stop.png" class="small-btn-controller btn-stop" style="display:none" />'
      etools.append(br)
      etools.append(be)
      etools.append(h)

      var c = document.createElement('DIV')
      c.className = 'content'
      var contenu
      if(undefined === this.formated){
        // Contenu formaté
        contenu = current_analyse.deDim(this.content)
      } else {
        // Contenu formaté par la sous-instance
        contenu = this.formated
      }
      c.innerHTML = contenu
      n.append(etools)
      n.append(c)
      this._div = n
    }
    return this._div
  }

  static get OWN_PROPS(){return ['id', 'type', 'titre', 'time', 'duration', 'content', 'note', 'events']}

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
  get imgBtnPlay(){
    return this._imgBtnPlay || defineP(this,'_imgBtnPlay',this.btnPlayETools.find('img.btn-play'))
  }
  get imgBtnStop(){
    return this._imgBtnStop || defineP(this,'_imgBtnStop',this.btnPlayETools.find('img.btn-stop'))
  }
  get btnPlayETools(){
    return this._btnPlayETools || defineP(this,'_btnPlayETools', this.jqReaderObj.find('.e-tools .btn-play'))
  }

  observe(){
    var o = this.jqReaderObj
    o.find('.e-tools button.btn-edit').on('click', EventForm.editEvent.bind(EventForm, this))
    o.find('.e-tools button.btn-play').on('click', this.togglePlay.bind(this))
  }

  get locator(){return this.analyse.locator}
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
