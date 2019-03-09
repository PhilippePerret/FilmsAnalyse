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

  get otime(){
    if(undefined === this._otime) this._otime = new OTime(this.time)
    return this._otime
  }

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
  get duration(){return this._duration}

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
    evt.firstErroredFieldId = focusFieldId
  }
  /**
   * Méthode qui affiche l'évènement de manière différée, en tenant compte du
   * temps courant
   */
  showDiffere(){
    var my = this
    this.div //pour le construire
    var diff = ((my.time - this.analyse.videoController.getRTime()) * 1000) - 300
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
    if(this.jqReaderObj){
      this.jqReaderObj.show()
    } else {
      this.analyse.reader.append(this.div)
      this.observe()
    }
  }

  get jqReaderObj(){
    if(undefined === this._jq_reader_obj ){
      this._jq_reader_obj = $(`#${this.domId}`)
      if(this._jq_reader_obj.length == 0) this._jq_reader_obj = undefined
    }
    return this._jq_reader_obj
  }

  get domId(){ return `revent-${this.id}`}

  get div(){
    if (undefined === this._div){
      var n = document.createElement('DIV')
      n.className = `event ${this.type}`
      n.id = this.domId

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
      br.innerHTML = '<img src="./img/btn/play.png" class="btn" />'
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
        // Contenu non formaté
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
  observe(){
    var o = this.jqReaderObj
    o.find('.e-tools button.btn-edit').on('click', EventForm.editEvent.bind(EventForm, this))
    o.find('.e-tools button.btn-play').on('click', this.videoController.setRTime.bind(this.videoController, this.time))
  }

  get videoController(){return this.analyse.videoController}
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
