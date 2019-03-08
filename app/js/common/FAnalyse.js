'use strict'
/**
 * La class FAnalyse
 * -----------------
 * Pour l'analyse d'un film
 */

class FAnalyse {
  /**
   * Instanciation de l'analyse à partir du path de son dossier
   */
  constructor(pathFolder){
    this._events = [] // au départ
    this._folder = path.resolve(pathFolder)
  }

  get folder()  { return this._folder }
  set folder(v) { this._folder = v}

  get modified() { return this._modified }
  set modified(v) {
    this._modified = v
    $('#btn-save-analyse').css('visibility', v === true ? 'visible' : 'hidden')
  }

  get eventsFilePath(){
    if(undefined===this._events_file_path){
      this._events_file_path = path.join(this.folder,'events.json')
    }
    return this._events_file_path
  }
  get dataFilePath(){
    if(undefined===this._data_file_path){
      this._data_file_path = path.join(this.folder,'data.json')
    }
    return this._data_file_path
  }

  /**
   * Retourne les données actuelles de l'analyse
   */
  get data(){
    return {
        filmStartTime:  this.filmStartTime.seconds
      , videoPath:      this.videoPath
      , diminutifs:     this.diminutifs
      , videoSize:      this.videoSize
    }
  }
  set data(v){
    this.filmStartTime  = new OTime(v["filmStartTime"])
    this._videoPath     = v.videoPath
    this.diminutifs     = v.diminutifs
    this.videoSize      = v.videoSize
  }

  set videoSize(v)  { this._videoSize = v; this.modified = true }
  get videoSize()   { return this._videoSize}

  /**
   * Méthode ajoutant un évènement
   *
   * +nev+ (pour "Nouvel Event"). L'instance FAEvent::<sous classe> de
   * l'évènement à ajouter. Noter qu'elle a déjà été vérifiée et qu'elle est
   * donc parfaitement valide ici.
   *
   * Attention : la méthode est aussi appelée (en cascade) au chargement
   * de l'analyse. +whenLoading+ est true, dans ce cas-là
   */
  addEvent(nev, whenLoading) {
    if(undefined === this.ids){
      this.events = []
      this.ids    = {}
    }
    if (this.events.length){
      // On place l'event à l'endroit voulu dans le film
      var idx_event_before = this.getIndexOfEventAfter(nev.time)
      this.events.splice(idx_event_before, 0, nev)
    } else {
      this.events.push(nev)
    }
    this.ids[nev.id] = nev

    if (!whenLoading) {
      this.locator.addEvent(nev)
      // On place tout de suite l'évènement sur le lecteur
      nev.show()
      this.modified = true
      nev = null
      idx_event_before = null
    }
  }

  getEventById(eid){
    return this.ids[eid]
  }
  /**
   * Méthode qui affiche les évènements qui se trouvent à +time+
   * (avec une marge de plus ou moins 10 secondes)
   * Note : la méthode est appelée toutes les 3 secondes
   */
  showEventsAt(time){
    var evs = this.locator.eventsAt(time)
    // console.log("evs:", evs)
    for(var ev of evs){
      ev.showDiffere()
    }
  }
  /**
   * Formate le texte +txt+ en fonction de l'évènement
   */
  formateTexte(ev){
    var txt = this.deDim(ev.content)
    var h
    switch (ev.type) {
      case 'scene':
        if(ev.sceneType == 'generic'){ h = "GÉNÉRIQUE" }
        else {
          var decor  = ev.decor ? ` — ${this.deDim(ev.decor)}` : ''
          var sdecor = ev.sous_decor ? ` : ${this.deDim(ev.sous_decor)}` : ''
          h = `${(ev.lieu || 'INT').toUpperCase()}. ${(ev.effet || 'jour').toUpperCase()}${decor}${sdecor}`}
        txt = `<span class="scene-heading">${h}</span><span class="scene-resume">${txt}</span>`
        break;
    }
    return txt
  }

  /**
   * Remplace les diminutifs de +txt+ par leur vraie valeur
   */
  deDim(txt){
    if(!txt) return ''
    for(var dim in this.diminutifs){
      var reg = new RegExp(`@${dim}`,'g')
      txt = txt.replace(reg,this.diminutifs[dim])
    }
    return txt
  }
  // /**
  //  * Afficher les évènements de la liste +a_events+
  //  */
  // showEvents(a_events){
  //   for(var e of a_events){e.show()}
  // }
  /**
   * Méthode qui permet de (re)définir la vidéo de l'analyse
   */
  setVideoPath(ev, p){
    if(undefined === p){ p = $('#video-path').val() }
    this._videoPath = p
    this.modified   = true
    VideoController.load(p)
    // On peut masquer le champ qui permet de définir la vidéo
    $('#div-video-path').hide();
  }
  get videoPath(){ return this._videoPath }


  /**
   * Retourne l'index de l'évènement qui se trouve juste après le temps +time+
   *
   * La méthode permet principalement de placer les nouveaux évènements
   */
  getIndexOfEventAfter(time){
    var i = 0
      , len = this.events.length ;
    for(i;i<len;++i) { if(this.events[i].time > time) { return i } }
    return len
  }

  // --- FONCTIONS I/O ----------------------------------------------

  get SAVED_FILES(){
    if(undefined === this._saved_files){
      this._saved_files = [
          this.eventsFilePath
        , this.dataFilePath
      ]
    }
    return this._saved_files
  }
  get PROP_PER_FILE(){
    if(undefined === this._prop_per_path){
      this._prop_per_path = {}
      this._prop_per_path[this.eventsFilePath]  = 'eventsSaved'
      this._prop_per_path[this.dataFilePath]    = 'data'
    }
    return this._prop_per_path
  }
  /**
   * Méthode appelée pour sauver l'analyse courante
   */
  save() {
    this.savers = 0
    this.savables_count = this.SAVED_FILES.length
    for(var fpath of this.SAVED_FILES){
      this.saveFile(fpath, this.PROP_PER_FILE[fpath])
    }
  }
  saveFile(fpath, prop){
    var my = this
    fs.writeFile(fpath, JSON.stringify(this[prop]),'utf8', (err)=>{
      if(err) throw(err)
      my.setSaved(fpath)
    })
  }
  setSaved(path){
    this.savers += 1
    if(this.savers === this.savables_count){
      this.modified = false
      F.notify("Analyse enregistrée avec succès.")
    }
  }

  /**
   * Retourne les évènements sous forme de données simplifiées
   */
  get eventsSaved(){
    var eSaveds = []
    for(var e of this.events){eSaveds.push(e.data)}
    return eSaveds
  }
  // Prend les données dans le fichier events.json et les dispatche dans
  // l'instance d'analyse (au début du travail, en général)
  set eventsSaved(v){
    var last_id = -1
    this.events = []
    for(var d of v){
      var eClass = eval(`FAE${d.type}`)
      this.addEvent(new eClass(d), true)
      // Le 'true' ci-dessus permet de dire à la méthode que ce n'est pas
      // une création d'évènement.
      if(d.id > last_id){last_id = parseInt(d.id,10)}
    }
    // On peut définir le dernier ID dans EventForm (pour le formulaire)
    EventForm.lastId = last_id
  }

  /**
   * Méthode pour charger l'analyse (courante ou pas)
   *
   * Il y aura plusieurs fichiers à charger pour une application,
   * avec tous les éléments, il faut donc procéder à un chargement asynchrone
   * correct (en lançant tous les chargements et en attendant que l'application
   * soit prête.)
   */
  load(){
    var my = this
      , fpath ;
    // Les fichiers à charger
    var loadables = Object.assign([], my.SAVED_FILES)
    // Pour comptabiliser le nombre de fichiers chargés
    this.loaders = 0
    my.loadables_count = loadables.length
    // console.log("loadables:",loadables)
    while(fpath = loadables.shift()){my.loadFile(fpath, my.PROP_PER_FILE[fpath])}
  }

  /**
   * Méthode appelé quand l'analyse est prête, c'est-à-dire que toutes ses
   * données ont été chargées et traitées. Si un fichier vidéo existe, on le
   * charge.
   */
  onReady(){
    VideoController.init()
    EventForm.init()
    this.locator = new Locator(this)
  }

  onLoaded(fpath){
    this.loaders += 1
    if(this.loaders === this.loadables_count){
      this.ready = true
      this.onReady()
    }
  }

  // Charger le fichier +path+ pour la propriété +prop+ de façon
  // asynchrone.
  loadFile(fpath, prop){
    var my = this
    if(fs.existsSync(fpath)){
      fs.readFile(fpath, 'utf8', (err, data) => {
        if (err) throw(err)
        // console.log("data:",data)
        my[prop] = JSON.parse(data)
        my.onLoaded(fpath)
      })
    } else {
      // Si le fichier n'existe pas
      this.onLoaded(fpath)
    }
  }

  /**
   * Méthode qui définit le départ réel du film. Permettra de prendre un
   * bon départ
   */
  setFilmStartTimeAt(otime){
    this.filmStartTime = otime
    this.modified = true
    this.setButtonGoToStart()
  }

  /**
   * Règle la visibilité du bouton "Aller au début du film" en fonction de la
   * définition ou non de ce temps
   */
  setButtonGoToStart(){
    $('#btn-go-to-film-start').css('visibility',(this.filmStartTime === undefined)?'hidden':'visible')
  }

  /**
   * Méthode permettant de rejoindre le début du film
   */
  goToFilmStart(){
    if(undefined === this.filmStartTime){
      F.error("Le début du film n'est pas défini. Cliquer sur le bouton adéquat pour le définir.")
    }else{
      VideoController.setTime(this.filmStartTime.seconds)
    }
  }


}
