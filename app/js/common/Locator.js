'use strict'
/**
 * Class Locator
 * -------------
 * Pour la gestion d'un locateur vidéo
 */

class Locator {

  constructor(analyse){
    this.analyse      = analyse
  }

  // Pour savoir si la vidéo est en train de jouer
  get playing(){return this._playing || false}
  set playing(v){ this._playing = v}

  // ---------------------------------------------------------------------
  //  Gestion des points d'arrêt
  get stop_points(){
    if (undefined === this._stop_points) this._stop_points = []
    return this._stop_points
  }
  set stop_points(v){ this._stop_points = v}

  goToNextStopPoint(){
    if(undefined === this._i_stop_point) this._i_stop_point = -1
    ++ this._i_stop_point
    if(this._i_stop_point > this.stop_points.length - 1) this._i_stop_point = 0
    if(undefined === this.stop_points[this._i_stop_point]){
      F.notify(T('no-stop-point'))
    } else {
      this.setTime(this.stop_points[this._i_stop_point])
    }
  }
  addStopPoint(time){
    if(current_analyse.options.get('option_lock_stop_points')) return
    if (this.stop_points.indexOf(time) > -1) return
    this.stop_points.length > 2 && this.stop_points.shift()
    this.stop_points.push(time)
  }

  init(){
    var my = this

    this.videoController = this.analyse.videoController
    this.video = this.analyse.videoController.controller

    // Le bouton pour rejoindre le début du film. Il n'est défini que si
    // ce temps est défini pour l'analyse courante
    this.analyse.setButtonGoToStart()

    // On prépare l'horloge principale (pour qu'elle soit sensible aux
    // déplacements de souris)
    this.prepareMainHorloge()

    my = null
  }

  prepareMainHorloge(){
    // Rend horlogeable l'horloge principale qui doit permettre de se
    // déplacer dans le film avec la souris.
    var horloges = UI.setHorlogeable(DGet('div-video-top-tools'), {synchro_video: true})
    this.oMainHorloge = horloges['main-horloge']
  }


  // L'instance DOMHorloge de l'horloge principale
  get oMainHorloge(){return this._oMainHorloge}
  set oMainHorloge(v){
    v.dispatch({
        time: this.getRTime()
      , synchroVideo: true
      , unmodifiable: true // pour ne pas la marquer modifiée
    })
    this._oMainHorloge = v
  }

  // ---------------------------------------------------------------------
  //  Méthode de navigation dans la vidéo (play, stop, etc.)
  /**
   * Méthode appelée quand on presse le bouton Play
   */
  togglePlay(ev){
    var pauser = this.playing === true
    if (pauser) {
      this.video.pause()
      $(this.btnPlay).removeClass('actived')
      this.playing = false
      this.desactivateHorloge()
      this.setPlayButton(this.playing)
    } else {
      // On mémorise le dernier temps d'arrêt pour y revenir avec le bouton
      // stop.
      var curT = this.getTime()
      // Pour gérer l'Autoplay Policy de Chromium
      var videoPromise = this.video.play()
      if (videoPromise !== undefined) {
        videoPromise.then( _ => {
          // Autoplay started!
          this.lastStartTime = curT
          this.addStopPoint(curT)
          $(this.btnPlay).addClass('actived')
          this.playing = true
          this.activateHorloge()
          this.setPlayButton(this.playing)
        }).catch(error => {
          // Autoplay was prevented.
          // Show a "Play" button so that user can start playback.
          // Pouvoir mettre cette alerte, en cas de début fort
          console.warn("Autoplay prevented, ok.")
          this.setPlayButton(this.playing)
        });
      }
    }
    // console.log("<- togglePlay")
  }

  // Réglage du bouton PLAY en fonction de +running+ (qui est this.playing)
  setPlayButton(running){
    this.btnPlay.innerHTML = running ? this.imgPauser : this.imgPlay
  }

  stop(){
    if(this.playing)this.togglePlay()
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
    var curTime = this.getTime()

    // Si le film jouait, on doit l'arrêter
    if(this.playing) this.togglePlay()

    if(curTime > this.lastStartTime){
      // <= Le temps courant est supérieur au dernier temps de départ
      // => on revient au dernier temps de départ
      this.setTime(this.lastStartTime)
    } else if (this.hasStartTime && curTime > (this.analyse.filmStartTime + 5)){
      // <= le temps courant est au-delà des 5 secondes après le début du film
      // => On revient au début du film
      this.setTime(this.analyse.filmStartTime)
    } else {
      // Sinon, on revient au début de la vidéo
      this.setTime(0)
    }
    this.actualizeHorloge()
  }

  /**
   * Méthode pour rembobiner de +secs+ seconds (on continue de jouer si
   * on jouait, ou alors on remet en route)
   */
  rewind(secs){
    // console.log("-> rewind")
    var method = ()=>{this.setTime(this.video.currentTime - secs)}
    this.timerRewind = setInterval(method, 100)
    // method = null
  }
  forward(secs){
    // console.log("-> forward")
    var method = ()=>{this.setTime(this.video.currentTime + secs)}
    this.timerForward = setInterval(method, 100)
    // method = null
  }
  stopRewind(){
    // console.log("-> stopRewind")
    clearInterval(this.timerRewind)
    this.timerRewind = null
  }
  stopForward(){
    // console.log("-> stopForward")
    clearInterval(this.timerForward)
    this.timerForward = null
  }

  /**
   * Méthode qui définit le temps du film
   *
   * +time+ doit être un nombre de secondes depuis le DÉBUT DE LA VIDÉO.
   * Utiliser la méthode setRTime pour envoyer en argument le nombre de secondes
   * depuis le début défini du film.
   *
   */
  setTime(time, dontPlay){
    // console.log("-> setTime", time)
    if(isNaN(time)){
      console.error(`${time} n'est pas un temps. Je ne bouge pas la vidéo.`)
      return
    }
    this.video.currentTime = time
    this.oMainHorloge.time = time
    if(!dontPlay){
      if(this.playAfterSettingTime === true && !this.playing){
        this.togglePlay()
      } else if(this.video.paused){ this.actualizeHorloge() }
    }

    // Mettre le temps pour le lecteur d'analyse (afficher les events)
    var rtime = this.getRTime(time)
    this.analyse.reader.resetBeyond(rtime - FAReader.TIME_AROUND, rtime + FAReader.TIME_AROUND)
    this.showEventsAt(rtime)
    // Définir la zone structurelle absolue et relative dans laquelle on se
    // trouve
    this.defineNextZonesStt()
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
  * Méthode qui affiche, en direct, la partie du film dans laquelle on se
  * trouve, au niveau absolu et relatif.
  * La partie absolue est toujours définie, la partie relative dépend des
  * events fournis concernant le film courant.
  *
  * Pour fonctionner facilement, on mémorise dans une table les prochaines
  * parties et leur temps. Dès qu'on arrive à ce temps, on les affiche et on
  * recherche le prochain temps.
  *
  * +rtime+ Le temps "réel" dans le film, c'est-à-dire pas le temps exact de
  *         la vidéo.
  **/
  showCurrentZoneStt(rtime){
    if(undefined === this._nextZonesStt) this.defineNextZonesStt(rtime)
    // // Paradigme absolu
    // this.currentTimeReachEndZone('Sub', 'Abs') && this.resetMarkPart('Sub', 'Abs')
    // this.currentTimeReachEndZone('Sub', 'Rel') && this.resetMarkPart('Sub', 'Rel')
    else this.setAllPartMarksIfTime()
  }

  setAllPartMarksIfTime(){
    for(var ma of ['Main','Sub']){
      for(var ar of ['Abs','Rel']){
        this.setMarkPartIfTime(ma, ar)
      }
    }
  }
  /**
  * Écrit la marque de la partie si son temps est atteint
  **/
  setMarkPartIfTime(mainSub, absRel){
    // Si une partie courant est définie, il faut commencer par la marquer
    if(this._nextZonesStt[`cur${mainSub}Part${absRel}`]){
      var zone = this._nextZonesStt[`cur${mainSub}Part${absRel}`]
      // Afficher la partie
      this.videoController.setMarkPart(mainSub, absRel, zone)

    } else if(this.currentTimeReachPart(mainSub, absRel)){

      this.setMarkPart(mainSub, absRel)
      var propZone = `next${mainSub}Part${absRel}`
      var zone = this._nextZonesStt[propZone]
      if(zone){
        // Mettre la partie next en partie courante
        this._nextZonesStt[`cur${mainSub}Part${absRel}`] = this._PFA.node(zone.id)
        // On doit renseigner le prochain noeud
        this._nextZonesStt[propZone] = zone.next ? this._PFA.node(zone.next) : null
      }
    } else if(this.currentTimeReachEndZone(mainSub, absRel)) this.resetMarkPart(mainSub, absRel)
  }

  /**
  * Retourne true si le temps courant atteint ou dépasse la partie désignée
  * par +mainSub+ et +absRel+
  **/
  currentTimeReachPart(mainSub, absRel){
    var zoneDef = this._nextZonesStt[`next${mainSub}Part${absRel}`]
    return zoneDef && this.currentRTime >= zoneDef[`startAt${absRel}`]
  }
  /**
  * Retourne true si le temps courant atteint ou dépasser le temps défini
  * pour la zone +zone_id+ (property in this._nextZonesStt)
  **/
  currentTimeReachEndZone(mainSub, absRel){
    var zone = this._nextZonesStt[`cur${mainSub}Part${absRel}`]
    return zone && this.currentRTime >= zone[`endAt${absRel}`]
  }
  resetMarkPart(mainSub, absRel){
    var markController = this.videoController[`mark${mainSub}Part${absRel}`]
    markController.html('...')
    // IL FAUT absolument laisser le stt-id dans le champ, même s'il est vide,
    // pour pouvoir trouver le noeud suivant
    // markController.attr('data-stt-id', '')
    this._nextZonesStt[`cur${mainSub}Part${absRel}`] = null
  }
  setMarkPart(mainSub, absRel){
    var propZone = `next${mainSub}Part${absRel}`
    var zone = this._nextZonesStt[propZone]
    if(!zone) return
    // Afficher la partie
    this.videoController.setMarkPart(mainSub, absRel, zone)
  }

  /**
  * Méthode, utilisée pour la précédente, qui détermine au moment de la
  * lecture (actuelle) les zones courantes absolues et relatives qui vont
  * s'afficher à côté de l'horloge.
  **/
  defineNextZonesStt(rtime){
    var my = this, kstt
    if(undefined === rtime) rtime = this.currentRTime
    // console.log("-> this._nextZonesStt (définition)", rtime)
    my._PFA = my.analyse.PFA
    my._nextZonesStt = {}
    my._PFA.forEachNode( nstt => {
      // console.log("Comparaison:", nstt.startAtAbs, rtime)

      // Pour les valeurs absolues
      // Si le temps courant est supérieur au noeud traité, on prend le noeud
      // traité comme noeud courant. Noter qu'on passera en revue tous les
      // noeud avant de trouver le dernier, donc le vrai noeud courant
      if (nstt.startAtAbs <= rtime){
        my._nextZonesStt[`cur${nstt.isMainPart?'Main':'Sub'}PartAbs`] = nstt
      }

      // Pour les valeurs relatives
      if (nstt.startAtRel < rtime){
        my._nextZonesStt[`cur${nstt.isMainPart?'Main':'Sub'}PartRel`] = nstt
        // console.log(`[define] cur${nstt.isMainPart?'Main':'Sub'}PartRel mis à`, nstt.id)
      }

      kstt = `next${nstt.isMainPart?'Main':'Sub'}PartAbs`
      if (!my._nextZonesStt[kstt] && nstt.startAtAbs > rtime){
        my._nextZonesStt[kstt] = nstt
      }

      // Pour les valeurs relatives
      // On en peut traiter que si elle existe
      kstt = `next${nstt.isMainPart}PartRel`
      if (!my._nextZonesStt[kstt] && nstt.startAtRel && nstt.startAtRel > rtime){
        my._nextZonesStt[kstt] = nstt
      }
    }) // fin de la boucle sur tous les noeuds

    this.setAllPartMarksIfTime()
  }
  /**
   * Rejoint le temps "réel" +time+, c'est-à-dire en tenant compte du début
   * défini pour le film
   */
  setRTime(time, dontPlay, evt){
    if(this.hasStartTime) time += this.startTime
    this.setTime(time, dontPlay)
  }

  /**
   * On peut déterminer quand la vidéo devra s'arrêter avec cette méthode
   */
  setEndTime(time, fnOnEndTime){
    if(isNaN(time)){
      console.error(`${time} n'est pas un temps. Je ne définis pas la fin de la vidéo.`)
      return
    }
    if(this.hasStartTime) time += this.startTime
    this.wantedEndTime = parseFloat(time)
    this.wantedEndTimeCallback = fnOnEndTime
  }
  resetEndTime(){
    this.wantedEndTime = null
    this.wantedEndTimeCallback = null
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
    }
  }

  // ---------------------------------------------------------------------
  // Méthodes de données

  get startTime(){
    return this.analyse.filmStartTime // toujours défini
  }
  get currentTime(){
    return this.video.currentTime
  }
  get currentRTime(){return this.getRTime()}

  /**
  * Alias de this.currentTime pour retourner le temps vidéo courant
  **/
  getTime(){ return this.currentTime }

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
    var curt = this.currentRTime
    this.horloge.innerHTML = this.getRealTime(curt)
    this.horloge_real.innerHTML = this.getRealTime(this.video.currentTime)
    this.oMainHorloge.time = curt
    // Définir la zone structurelle absolue et relative dans laquelle on se
    // trouve
    this.showCurrentZoneStt(curt)
    // Placer le curseur de position
    this.videoController.positionIndicator.positionneAt(curt)
  }

  actualizeReader(){
    // Afficher les events autour du temps courant
    this.showEventsAt(this.currentRTime)
    // Arrêter de jouer si un temps de fin est défini et qu'il est dépassé
    if(this.wantedEndTime && this.currentTime > this.wantedEndTime){
      this.togglePlay()
      if('function'===typeof this.wantedEndTimeCallback) this.wantedEndTimeCallback()
    }
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
    return this.analyse && this.analyse.filmStartTime > 0
  }

  get playAfterSettingTime(){
    return this.analyse.options.get('option_start_when_time_choosed')
  }

  // --- DOM ÉLÉMENTS ---
  get horloge(){
    if(undefined===this._horloge){this._horloge=DGet('main-horloge')}
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
