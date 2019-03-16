'use strict'
/**
  * Classe BtnPlay
  * --------------
  * Gestion des boutons play/stop des events.
  *
  * @usage
  *
  * Mettre simplement dans le DOM un button de classe <button class="btnplay-<id>"></button>
  *
  */
class BtnPlay {

  // ---------------------------------------------------------------------
  //  CLASSE

  /**
   * Pour placer et surveiller les boutons play/stop des events
   * Cf. Manuel de développement > #bouton_playstop_event
   */
  static setAndWatch(container, ev){
    var btnPlay ;
    if('function' !== typeof ev.id) ev = current_analyse.ids[ev]
    // On boucle sur chaque bouton trouvé qui n'a pas été préparé
    // On reconnait un bouton préparé au fait qu'il a une image (mais on
    // pourrait aussi le reconnaitre à sa classe `btnplay-<id event>`)
    container.find('.btnplay').not(`.btnplay-${ev.id}`).each((i,o) => {
      ev.btnPlay.set(o) // on le prépare
      $(o).bind('click', ev.btnPlay.togglePlay.bind(ev.btnPlay))
    })
  }

  // ---------------------------------------------------------------------
  //  INSTANCE
  //
  // Rappel : une seule instance gère tous les boutons play d'un même
  // event.

  constructor(ev){
    this.event    = ev
    this.id       = ev.id
    // État commun à tous les boutons
    this.playing  = false
  }

  /**
   * Pour préparer un bouton. Dans le code, on ne trouve que
   * `<button class="btnplay left" size=20></button>`
   */
  set(domB){
    domB.innerHTML = this.imgPlay(domB.getAttribute('size'))
    $(domB).addClass(this.class)
  }

  /**
   * Bascule entre le jeu et l'arrêt
   *
   * +e+ Évènement click envoyé, mais pas toujours.
   */
  togglePlay(e){
    var imgBtn ;

    if(e){
      e.stopPropagation()
      e.preventDefault()
    }

    // console.log("videoIsPlaying avant:", !!this.videoIsPlaying)
    // console.log("playing avant:", !!this.playing)

    // Si on est en train de jouer la vidéo, il faut l'arrêter
    if (this.playing){
      this.playing = false
      this.locator.stop()
      imgBtn = this.srcPlay // le bouton start doit être affiché
    } else {
      // Dans tous les cas, si on n'est pas en train de jouer, quand on clique
      // sur le bouton, on rejoint le temps de début de l'event
      this.locator.setRTime(this.startTime)
      // On définit aussi le temps de fin
      this.locator.setEndTime(this.endTime, this.togglePlay.bind(this))
      // Si les options indiquent qu'il faut jouer après le choix d'un temps,
      // alors la vidéo jouera. De la même manière, si la vidéo est en train
      // de déjà jouer, c'est bon
      if( this.videoIsPlaying || this.locator.playAfterSettingTime ){
        this.playing = true
        imgBtn = this.srcStop
      } else {
        imgBtn = this.srcPlay
      }
    }

    // console.log("videoIsPlaying après:", !!this.videoIsPlaying)
    // console.log("playing après:", !!this.playing)

    $(`.${this.class} img`).attr('src', imgBtn)
  }

  // ---------------------------------------------------------------------
  //  Méthodes de DATA

  get startTime(){return this._startTime || defineP(this,'_startTime',this.event.time)}
  get endTime(){return this._endTime || defineP(this,'_endTime',this.startTime+this.event.duration)}

  // ---------------------------------------------------------------------
  //  Méthodes DOM

  imgPlay(size){ return this.imgCodePlay(size) }

  imgCodePlay(size){
    return `<img class="btn-stop-play-event" src="./img/btns-controller/btn-play.png" style="width:${size}px;" />`
  }

  get srcPlay(){return this._srcPlay||defineP(this,'_srcPlay','./img/btns-controller/btn-play.png')}
  get srcStop(){return this._srcStop||defineP(this,'_srcStop','./img/btns-controller/btn-stop.png')}

  // ---------------------------------------------------------------------
  // Raccourcis
  get locator(){ return current_analyse.locator }
  get videoIsPlaying(){ return this.locator.playing }

  // ---------------------------------------------------------------------
  //  Data

  get id(){return this._id||defineP(this,'_id',this.event.id)}
  set id(v){this._id = v}

  // ---------------------------------------------------------------------
  //  Data DOM

  get domBtn(){return this._domBtn || defineP(this,'_domBtn',this.jqBtn[0])}
  get class(){return this._class  || defineP(this,'_class',`btnplay-${this.id}`)}
  get size(){return this._size ||defineP(this,'_size',parseInt(this.jqBtn.attr('size'),10))}


}
