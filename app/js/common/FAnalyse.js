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
    this.events = [] // pour le moment
    this.folder = path.resolve(pathFolder)
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
    }
  }
  set data(v){
    this.filmStartTime = new OTime(v["filmStartTime"])
    this._videoPath    = v.videoPath
  }

  /**
   * Méthode qui permet de (re)définir la vidéo de l'analyse
   */
  setVideoPath(ev, p){
    console.log("p avant = ", p)
    if(undefined === p){ p = $('#video-path').val() }
    console.log("p après = ", p)
    this._videoPath = p
    this.modified   = true
    VideoController.load(p)
    // On peut masquer le champ qui permet de définir la vidéo
    $('#div-video-path').hide();
  }
  get videoPath(){ return this._videoPath }

  /**
   * Création d'un nouvel évènement avec les données +data+
   */
  newThing(type, data){
    var content = $('textarea#event-content').val().trim()

    if(content === ''){
      VideoController.onTogglePlay()
      F.notify("Définir le texte puis taper à nouveau sur le bouton.")
      return null
    } else {
      $('textarea#event-content').val('')
      if(VideoController.controller.paused) VideoController.onTogglePlay()
    }
    if(type == 'scene'){
      // TODO Si c'est une scène, il faut compter son index (en fonction du
      // dernier par rapport aux temps)

    }
    var data = {type: type, time: VideoController.getRTime(), content: content}
    this.events.push(new FAEvent(data))
    this.modified = true
    console.log("Nouvel event ajouté")
  }

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
      this._prop_per_path[this.eventsFilePath]  = 'events'
      this._prop_per_path[this.dataFilePath]    = 'data'
    }
    return this._prop_per_path
  }
  /**
   * Méthode appelée pour sauver l'analyse courante
   */
  save() {
    this.savers = []
    for(var path of this.SAVED_FILES){
      this.savers.push(path)
    }
    for(path of this.SAVED_FILES){
      this.saveFile(path, this.PROP_PER_FILE[path])
    }
  }
  saveFile(path, prop){
    var my = this
    fs.writeFile(path, JSON.stringify(this[prop]),'utf8', (err)=>{
      if(err) throw(err)
      my.setSaved(path)
    })
  }
  setSaved(path){
    this.savers.splice(this.savers.indexOf(path),1)
    if(this.savers.length === 0){
      this.modified = false
      F.notify("Analyse enregistrée avec succès.")
    }
  }

  /**
   * Méthode pour charger l'analyse (courante ou pas)
   *
   * Plus tard, il y aura plusieurs fichiers à charger pour une application,
   * avec tous les éléments, il faudra donc procéder à un chargement asynchrone
   * correct (en lançant tous les chargements et en attendant que l'application
   * soit prête.)
   */
  load(){
    var my = this
    this.loaders = [this.eventsFilePath, this.dataFilePath]
    for(var path of this.loaders){my.loadFile(path, my.PROP_PER_FILE[path])}
  }

  /**
   * Méthode appelé quand l'analyse est prête, c'est-à-dire que toutes ses
   * données ont été chargées et traitées. Si un fichier vidéo existe, on le
   * charge.
   */
  onReady(){
    VideoController.init()
  }

  onLoaded(path){
    this.loaders.splice(this.loaders.indexOf(path), 1)
    if(this.loaders.length == 0){
      this.ready = true
      this.onReady()
      // L'analyse est prêt. On pourrait par exemple lancer la lecture
      // si c'est l'analyseur qui est chargé.
    }
  }

  // Charger le fichier +path+ pour la propriété +prop+ de façon
  // asynchrone.
  loadFile(path, prop){
    var my = this
    if(fs.existsSync(path)){
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw(err)
        my[prop] = JSON.parse(data)
        this.onLoaded(path)
      })
    } else {
      // Si le fichier n'existe pas
      this.onLoaded(path)
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
    var btnGoToStart = $('#btn-go-to-film-start')
    btnGoToStart.css('visibility',(this.filmStartTime === undefined)?'hidden':'visible')
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
