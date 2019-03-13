'use strict'
/**
 * Class Locator
 * -------------
 * Pour la gestion d'un locateur vidéo
 */

class Locator {

  constructor(analyse){
    this.analyse = analyse
  }

  // Pour savoir si la vidéo est en train de jouer
  get playing(){return this._playing || false}
  set playing(v){ this._playing = v}

  init(){
    var my = this

    this.video = this.analyse.videoController.controller

    // Le bouton pour rejoindre le début du film. Il n'est défini que si
    // ce temps est défini pour l'analyse courante
    this.analyse.setButtonGoToStart()

    my = null
  }

  // ---------------------------------------------------------------------
  //  Méthode de navigation dans la vidéo (play, stop, etc.)

  /**
   * Méthode appelée quand on presse le bouton Play
   */
  togglePlay(ev){
    // console.log("-> togglePlay")
    var pauser = this.playing === true
    this.btnPlay.innerHTML = pauser ? this.imgPlay : this.imgPauser
    if(pauser){
      this.video.pause()
      $(this.btnPlay).removeClass('actived')
      this.playing = false
      this.desactivateHorloge()
    } else {
      this.video.play()
      $(this.btnPlay).addClass('actived')
      this.playing = true
      this.activateHorloge()
    }
    // console.log("<- togglePlay")
  }

  /**
   * Méthode pour rembobiner au début du film (si on est après et qu'il est
   * défini) ou au début de la vidéo
   *
   * Note : le -5 ci-dessous permet de cliquer deux fois sur le bouton pour
   * revenir tout au début (sinon, on revient toujours au début défini du
   * film)
   */
  stopAndRewind(){
    if(this.hasStartTime && this.getRTime() > 5){
      // <= le temps courant est au-delà des 5 secondes après le début du film
      // => On revient au début du film
      this.setTime(this.analyse.filmStartTime.seconds)
    } else {
      // Sinon, on revient au début de la vidéo
      this.setTime(0)
    }
    // Si le film jouait, on doit l'arrêter
    if(this.playing) this.togglePlay()
    this.actualizeHorloge()
  }

  /**
   * Méthode pour rembobiner de +secs+ seconds (on continue de jouer si
   * on jouait, ou alors on remet en route)
   */
  rewind(secs){
    this.setTime(this.video.currentTime - secs)
  }
  forward(secs){
    this.setTime(this.video.currentTime + secs)
  }

  /**
   * Méthode qui définit le temps du film
   *
   * +time+ doit être un nombre de secondes depuis le DÉBUT DE LA VIDÉO.
   * Utiliser la méthode setRTime pour envoyer en argument le nombre de secondes
   * depuis le début défini du film.
   *
   */
  setTime(time){
    // console.log("-> setTime", time)
    this.video.currentTime = time
    if(this.playAfterSettingTime === true && !this.playing){
      this.togglePlay()
    } else if(this.video.paused){ this.actualizeHorloge() }

    // Mettre le temps pour le lecteur d'analyse (afficher les events)
    var rtime = this.getRTime(time)
    this.analyse.reader.resetBeyond(rtime - 60, rtime + 60)
    this.showEventsAt(rtime)
    // Définir la scène courante de l'analyse
    this.analyse.currentScene = Scene.sceneAt(rtime)
  }

  /**
   * Méthode qui affiche les évènements qui se trouvent à +time+
   * (avec une marge de plus ou moins 10 secondes)
   * Note : la méthode est appelée toutes les 3 secondes
   */
  showEventsAt(time){
    var evs = this.eventsAt(time)
    // console.log("evs:", evs)
    for(var ev of evs){
      ev.showDiffere()
    }
  }

  /**
   * Rejoint le temps "réel" +time+, c'est-à-dire en tenant compte du début
   * défini pour le film
   */
  setRTime(time, dontPlay, evt){
    if(this.hasStartTime) time += this.startTime
    this.setTime(time, dontPlay)
  }

  // ---------------------------------------------------------------------

  /**
   * Méthode permettant de rejoindre le début du film
   */
  goToFilmStart(){
    if(undefined === this.analyse.filmStartTime){
      F.error("Le début du film n'est pas défini. Cliquer sur le bouton adéquat pour le définir.")
    }else{
      this.setTime(this.startTime)
      if(!this.playing) this.togglePlay()
    }
  }

  // ---------------------------------------------------------------------
  // Méthodes de données

  get startTime(){
    if(this.analyse.filmStartTime){
      return this.analyse.filmStartTime.seconds
    } else { return 0 }
  }
  get currentTime(){
    return this.video.currentTime
  }
  get currentRTime(){return this.getRTime()}

  /**
   * Méthode qui récupère le temps courant du film et retourne une instance
   * OTime
   *
   */
  getOTime(){
    return new OTime(this.currentTime)
  }
  /**
   * (Number) Retourne le temps rectifié. Il peut être négatif.
   *
   * Si +t+ est fourni, on renvoie le temps réel de ce temps, sinon on
   * prend le temps courant
   */
  getRTime(t){
    if(undefined === t){ t = this.currentTime }
    if(this.hasStartTime){ t -= this.startTime }
    return t
  }

  // ---------------------------------------------------------------------
  //  Méthode de formatage

  // Retourne une horloge sous la forme [-]h:mm:ss:ff
  getRealTime(s){
    var negative = s < 0
    if(negative){s = -s}
    // console.log("s = ",s)
    if(undefined === this._horloger){
      this._horloger = new OTime(s)
    } else {
      this._horloger.updateSeconds(s)
    }
    return `${negative?'-':' '}${this._horloger.horloge}`
  }

  // ---------------------------------------------------------------------

  /**
   * Méthode pour activer l'horloge qui dépend du début défini pour le
   * film (ou le début en cas d'erreur). Elle marche au frame près
   */
  activateHorloge(){
    var my = this
    if (this.intervalTimer){
      this.desactivateHorloge()
    } else {
      if (!this.hasStartTime){
        this.horloge_real.style.visibility = 'hidden'
      }
      this.intervalTimer = setInterval(my.actualizeHorloge.bind(my), 1000/40)
      // Toutes les x secondes, on essaie d'actualiser l'affichage des
      // évènements autour du temps courant
      this.intervalReader = setInterval(my.actualizeReader.bind(my), 3000)
    }
    my = null
  }
  desactivateHorloge(){
    if(this.intervalTimer){
      clearInterval(this.intervalTimer)
      this.intervalTimer = null
    }
    if(this.intervalReader){
      clearInterval(this.intervalReader)
      this.intervalReader = null
    }
  }
  actualizeHorloge(){
    this.horloge.innerHTML = this.getRealTime(this.currentRTime)
    this.horloge_real.innerHTML = this.getRealTime(this.video.currentTime)
  }

  actualizeReader(){
    this.showEventsAt(this.currentRTime)
  }

  /**
   * Méthode qui retourne les évènements proches du temps +time+
   */
  eventsAt(time) {
    var trancheTime = parseInt(time - (time % 5),10)
    // On commence à chercher 10 secondes avant (on pourra changer ce nombre)
    var fromTranche = trancheTime // - 20
    var toTranche   = trancheTime // + 20
    // On prend tous les évènements dans ce temps
    var evs = []
    var evsBT = this.eventsByTrancheTime
    for(var tranche = fromTranche; tranche <= toTranche; tranche+=5){
      // console.log("Recherche dans la tranche : ", tranche)
      if(undefined === evsBT[tranche]) continue
      for(var i=0, len=evsBT[tranche].length;i<len;++i){
        evs.push(this.analyse.ids[evsBT[tranche][i]])
      }
    }
    return evs
  }

  /**
   * Ajoute l'évènement +ev+ à la liste par tranche (à sa création par exemple)
   */
  addEvent(ev){
    var tranche = parseInt(ev.time - (ev.time % 5),10)
    if(undefined === this.eventsByTrancheTime[tranche]){
      // <= La tranche n'existe pas encore
      // => On la crée et on ajoute l'identifiant de l'event
      this._events_by_tranche_time[tranche] = [ev.id]
    } else {
      // <= La tranche existe déjà
      // => Placer l'évènement pile à l'endroit voulu
      var len = this.eventsByTrancheTime[tranche].length
      // console.log("tranche:",tranche)
      // console.log("this.eventsByTrancheTime[tranche]:", this.eventsByTrancheTime[tranche])
      // console.log("this._events_by_tranche_time[tranche]:", this._events_by_tranche_time[tranche])
      var etested
      for(var i=0;i<len;++i){
        etested = this.analyse.getEventById(this._events_by_tranche_time[tranche][i])
        if (etested.time > ev.time){
          this._events_by_tranche_time[tranche].splice(i, 0, ev.id)
          break
        }
      }
    }
  }

  // ---------------------------------------------------------------------
  // Méthodes DOM


  // Méthode qui cache la table indiquant les temps courants
  hideCurrentTime(){
    $('#curtime-video-1').hide();
  }

  /**
   * Méthode appelée par le bouton "Temps courant" pour obtenir le temps
   * courant.
   * Plusieurs données sont données :
   *  - temps courant de la vidéo en horloge
   *  - temps courant de la vidéo en seconde
   *  - temps courant du film en horloge
   *  - temps courant du film en secondes
   *
   * Note : le temps est également mis dans le clipboard
   */
  getAndShowCurrentTime(){
    var videoTC = this.getOTime()
    $('#curtime-video-1 .curtime-video-horloge').val(videoTC.horloge)
    $('#curtime-video-1 .curtime-video-seconds').val(videoTC.secondsInt)
    if(this.hasStartTime){
      var filmTC  = new OTime(this.getRTime())
      $('#curtime-video-1 .curtime-film-horloge').val(filmTC.horloge)
      $('#curtime-video-1 .curtime-film-seconds').val(filmTC.secondsInt)
      clip(filmTC.horloge)
    } else {
      clip(videoTC.horloge)
    }
    $('#curtime-video-1').show();
    $('#curtime-video-1 .field-curtime-film').css('visibility',this.hasStartTime?'visible':'hidden')
  }

  /**
   * Méthode appelée pour se rendre au temps voulu.
   * Le temps peut être défini comme on veut, en seconds, en horloge, etc.,
   * et il tient compte d'un début défini (puisqu'il utilise la méthode
   * `getRTime`).
   */
  goToTime(ev){
    var t = new OTime($('#requested_time').val()).seconds
    if(this.hasStartTime){ t += this.startTime }
    this.setTime(t)
    // En pause, il faut forcer l'affichage du temps
    if(this.video.paused) this.actualizeHorloge()
  }

  // ---------------------------------------------------------------------
  /**
   * Propriété qui contient les évènements de l'analyse courante par tranche de
   * temps de 5 secondes.
   */
  get eventsByTrancheTime(){
    if(undefined === this._events_by_tranche_time){
      this._events_by_tranche_time = {}
      var i = 0, len = this.analyse.events.length, e, t
      for(i;i<len;++i){
        e = this.analyse.events[i]
        var t = parseInt(e.time - (e.time % 5),10)
        if(undefined === this._events_by_tranche_time[t]){
          this._events_by_tranche_time[t] = []
        }
        this._events_by_tranche_time[t].push(e.id)
      }
      // console.log("this._events_by_tranche_time:",this._events_by_tranche_time)
    }
    return this._events_by_tranche_time
  }

  // ---------------------------------------------------------------------
  // Méthodes d'état
  get hasStartTime(){
    return this.analyse && this.analyse.filmStartTime && this.analyse.filmStartTime.seconds > 0
  }

  get playAfterSettingTime(){
    return this._play_after_setting_time || false /* pour le moment */
  }
  set playAfterSettingTime(v){ this._play_after_setting_time = v }

  // --- DOM ÉLÉMENTS ---
  get horloge(){
    if(undefined===this._horloge){this._horloge=DGet('horloge')}
    return this._horloge
  }
  get horloge_real(){
    if(undefined===this._horloge_real){this._horloge_real=DGet('horloge_real')}
    return this._horloge_real
  }
  get btnPlay(){
    if(undefined === this._btnPl){this._btnPl = DGet('btn-real-play')}
    return this._btnPl
  }
  get btnRewindStart(){
    if(undefined===this._btnRwdSt){this._btnRwdSt = DGet('btn-stop')}
    return this._btnRwdSt
  }
  get imgPauser(){
    return '<img src="./img/btns-controller/btn-pause.png" />'
  }
  get imgPlay(){
    return '<img src="./img/btns-controller/btn-play.png" />'
  }
}
