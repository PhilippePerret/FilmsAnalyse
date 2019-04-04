'use strict'
/**
 * Class Locator
 * -------------
 * Pour la gestion d'un locateur vidéo
 */

class Locator {

constructor(analyse){
  this.analyse = this.a = analyse
}

// Pour savoir si la vidéo est en train de jouer
get playing(){return this._playing || false}
set playing(v){ this._playing = v}

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
  Méthode qui met en route et arrête la vidéo

  Elle est notamment appelée quand on presse le bouton
  PLAY principal.

 */
togglePlay(ev){
  var pauser = this.playing === true
  if (pauser) {
    //
    // => PAUSE
    //
    this.video.pause()
    $(this.btnPlay).removeClass('actived')
    this.playing = false
    this.desactivateHorloge()
    this.setPlayButton(this.playing)
  } else {
    //
    // => PLAY
    //
    this.resetAllTimes()
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

// ---------------------------------------------------------------------
//  MÉTHODES DE NAVIGATION DANS LA VIDÉO

stop(){
  this.playing && this.togglePlay()
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
  Grande méthode qui règle le temps de la vidéo.

  Mais elle fait beaucoup plus que ça puisque c'est la méthode
  qui est appelée systématiquement quand on change un temps.

  Notamment, elle :

  * règle la vidéo au temps (exact voulu)
  * règle l'horloge principale
  * règle l'indicateur de position (timeline sous la vidéo)
  * indique les partie et sous-partie dans lesquelles on se
    trouve, pour le paradigme absolu ou le paradigme relatif
    au film.
  * cherche et indique la scène courante (if any)

  [1] Note : cette méthode ne doit surtout pas être appelée de façon
  récursive par le play, car elle initialise tous les temps mémorisés
  qui permettent de gagner de la puissance, comme par exemple le temps
  de la prochaine scène ou du temps d'arrêt (cf. `resetAllTimes`).

  +time+  @Number Nombre de secondes depuis le début de la vidéo
          Note : appeler la méthode `setRTime` pour envoyer un
          temps dit "réel", c'est-à-dire par rapport au début
          défini du film.
 */
setTime(time, dontPlay){
  // console.log("-> setTime", time)

  // Initialisation de tous les temps. Cf. [1]
  this.resetAllTimes()

  // On ne peut envoyer qu'un nombre, voyons.
  if(isNaN(time)){
    console.error(`${time} n'est pas un temps. Je ne bouge pas la vidéo.`)
    return
  }

  // Réglage de la vidéo. L'image au temps donné doit apparaitre
  this.video.currentTime = time

  // Réglage de l'horloge principale.
  this.oMainHorloge.time = time

  if(!dontPlay){
    // Si l'on n'a pas précisé explicitement qu'on ne voulait
    // pas démarrer la vidéo, on doit voir si on doit le
    // faire.
    // Et on doit le faire si :
    //  - elle n'est pas déjà en train de jouer
    //  - l'option de démarrer après le choix d'un temps est
    //    activée.
    if(this.playAfterSettingTime === true && !this.playing){
      this.togglePlay()
    }
  }

  // Si la vidéo ne joue pas, on force l'actualisation de tous
  // les éléments, reader, horloge, markers de structure, etc.
  this.video.paused && this.actualizeALL()

}

// ---------------------------------------------------------------------
//  MÉTHODES DOM

// Réglage du bouton PLAY en fonction de +running+ (qui est this.playing)
setPlayButton(running){
  this.btnPlay.innerHTML = running ? this.imgPauser : this.imgPlay
}

/**
 * Méthode qui affiche les évènements qui se trouvent à +time+
 * (avec une marge de plus ou moins 10 secondes)
 * Note : la méthode est appelée toutes les 3 secondes
 */
showEventsAt(time){
  this.eventsAt(time).forEach(ev => ev.showDiffere())
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

/**
  Méthode qui ré-initialise les valeurs qui vont servir à surveiller
  les temps en cours de lecture, pour connaitre le temps d'arrêt par
  exemple ou le temps de la prochaine scène.
  Ces valeurs doivent être ré-initialisées à chaque lancement de la
  vidéo.
**/
resetAllTimes(){
  delete this.wantedEndTime
  delete this.wantedEndTimeCallback
  delete this.timeNextScene
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

goToPrevScene(){
  let method = () => {
    if (this.a.prevScene){
      this.setTime(this.a.prevScene.time)
    }
    else F.notify(`La scène ${FAEscene.current.numero} n'a pas de scène précédente.`)
  }
  this.timerPrevScene = setTimeout(method, 1000)
  method()
}
stopGoToPrevScene(){
  clearTimeout(this.timerPrevScene)
  delete this.timerPrevScene
}
goToNextScene(){
  // console.log("-> goToNextScene")
  let method = () => {
    if (this.a.nextScene){
      this.setTime(this.a.nextScene.time)
    }
    else F.notify(`La scène ${FAEscene.current.numero} n'a pas de scène suivante.`)
  }
  this.timerNextScene = setTimeout(method, 500)
  method()
}
stopGoToNextScene(){
  clearTimeout(this.timerNextScene)
  delete this.timerNextScene
}
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
getTimeRound(){ return Math.round(this.getTime() * 100) / 100 }

/**
 * Méthode qui récupère le temps courant du film et retourne une instance
 * OTime
 *
 */
getOTime(){
  return new OTime(this.currentTime)
}
// Retourne une instance OTime du temps réel (actualisé chaque fois)
getROTime(){
  if(undefined === this._getROTime){
    this._getROTime = new OTime(this.getRTime())
  } else {
    this._getROTime.updateSeconds(this.getRTime())
  }
  return this._getROTime
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
// Version arrondi à seulement 2 décimales
getRTimeRound(t){
  return Math.round(this.getRTime(t) * 100) / 100
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
    this.intervalTimer = setInterval(my.actualizeALL.bind(my), 1000/40)
  }
  my = null
}

desactivateHorloge(){
  if(this.intervalTimer){
    clearInterval(this.intervalTimer)
    this.intervalTimer = null
  }
}

/**
  Méthode principale qui va se charger de tout actualiser,
  c'est-à-dire l'horloge, le reader (events proches) et le
  indicateur de structure.
**/
actualizeALL(){
  var curt = this.currentRTime
  this.actualizeHorloge(curt)
  this.videoController.positionIndicator.positionneAt(curt)
  this.actualizeReader(curt)
  this.actualizeMarkersStt(curt)
  this.actualizeCurrentScene(curt)
  curt = null
}

actualizeHorloge(curt){
  if(undefined === curt) curt = this.currentRTime
  this.horloge.innerHTML = this.getRealTime(curt)
  this.horloge_real.innerHTML = this.getRealTime(this.video.currentTime)
  this.oMainHorloge.time = curt
}

actualizeReader(curt){
  if(undefined === curt) curt = this.currentRTime
  // Afficher les events autour du temps courant
  this.showEventsAt(curt)
  // Arrêter de jouer si un temps de fin est défini et qu'il est dépassé
  if(this.wantedEndTime && this.currentTime > this.wantedEndTime){
    this.togglePlay()
    if('function'===typeof this.wantedEndTimeCallback) this.wantedEndTimeCallback()
  }
}

/*
  De la même manière qu'on actualise l'horloge et le reader, on
  actualise la marque des parties et des zones à côté de
  l'horloge principale

  TODO Pour le moment, on vient ici tous les 40ème de secondes
  et on fait l'opération de checker dans les tables. On pourrait
  améliorer les choses en retenant le temps suivant à attendre
  et en s'en retournant tout de suite après (c'était un peu l'idée
  avant de revenir à quelque chose de plus efficace).
  Pour attendre le temps suivant, il suffit de prendre le start
  de l'élément suivant dans chaque table.
 */
actualizeMarkersStt(curt){
  // console.log("-> actualizeMarkersStt", curt)
  var vid = this.videoController
  if(undefined === curt) curt = this.currentRTime
  if(undefined === this.a.PFA.TimesTables) this.a.PFA.setTimesTables()
  if(undefined === this.nextTimes) {
    this.nextTimes = {'Main-Abs': null, 'Main-Rel': null, 'Sub-Abs':null, 'Sub-Rel': null}
  }
  // On doit répéter pour les quatre tables, heureusement petites,
  // pour trouver :
  //  - la partie absolue
  //  - la partie relative (if any)
  //  - la zone absolue
  //  - la zone relative si elle existe

  var kmar, node, name, nexT
  for(var ma of ['Main','Sub']){
    for(var ar of ['Abs','Rel']){
      kmar = `${ma}-${ar}`
      if(this.nextTimes[kmar] && this.nextTimes[kmar] > curt){
        // <= Le temps courant (curt) n'a pas encore atteint
        //    le prochain temps (nextTimes[key]) dans la table
        //    kmar
        // => On continue.
        continue
      }
      var res = this.getSttNameFor(curt, ma, ar)
      node = res[0]
      name = res[1]
      nexT = res[2]
      // Malheureusement, ça ne fonctionne pas avec :
      // [node, name, nextTime] = this.getSttNameFor(curt, ma, ar)
      vid.setMarkStt(ma, ar, node, name)
      this.nextTimes[kmar] = Math.round(nexT)
    }
  }

}

/**
  On renseigne la scène courante.

  Cette méthode cherche la scène courante et la scène
  suivante. Elle met la scène courante en affichage (et
  dans current_analyse) et elle mémorise le temps suivant
  pour ne pas avoir à chercher toujours le temps.

  @param {Float} curt  Le temps courant

 */
actualizeCurrentScene(curt){
  // console.log("-> actualizeCurrentScene")
  if(this.timeNextScene && curt < this.timeNextScene) return
  var resat = FAEscene.atAndNext(curt)
  if(resat){
    this.a.currentScene = resat.current
    // console.log("Courante scène mise à ", this.a.currentScene.numero)
    this.timeNextScene  = resat.next ? resat.next.time : this.a.duration
  }
}

// ---------------------------------------------------------------------

/**
  Tourne le nom, le noeud et le prochain temps pour le noeud
  structurel correspondant au temps courant de la vidéo.
**/
getSttNameFor(curt, mainSub, absRel){
  var table = this.a.PFA.TimesTables[`${mainSub}s-${absRel}`/* p.e. 'Subs-Abs' */]
    , len = table.length
    , dtime
    , i = 0
    , nextTime = null
  for(;i<len;++i){
    dtime = table[i]
    if(curt.between(dtime.start, dtime.end - 0.01)){
      nextTime = table[i+1] ? table[i+1].start : null
      return [dtime.node, dtime.name, nextTime]
    }
    if(dtime.start > curt && !nextTime){
      nextTime = dtime.start
    }
  }
  return [null, null, nextTime]
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
  if(this.video.paused) this.actualizeALL()
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
