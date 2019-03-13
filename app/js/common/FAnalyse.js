'use strict'
/**
 * Les instances de class FAnalyse
 * -----------------
 * Pour l'analyse d'un film
 */

class FAnalyse {

  // ---------------------------------------------------------------------
  //  CLASSE

  // Voir si les préférences demandent que la dernière analyse soit chargée
  // et la charger si elle est définie.
  static checkLast(){
    var dprefs = Prefs.get(['load_last_on_launching', 'last_analyse_folder'])
    // console.log("prefs:", dprefs)
    if (!dprefs['load_last_on_launching']) return
    if (!dprefs['last_analyse_folder']) return
    var apath = path.resolve(dprefs['last_analyse_folder'])
    if(fs.existsSync(apath)){
      this.load(apath)
    } else {
      // console.log("Impossible de trouver le dossier :", apath)
      F.error(`Impossible de trouver le dossier de l'analyse à charger :<br>${apath}`)
      Prefs.set({'last_analyse_folder':null})
    }
  }

  /**
   * Méthode appelée par le menu "Nouvelle…" pour créer une nouvelle analyse
   *
   */
  static onWantNewAnalyse(){
    this.checkIfCurrentSavedBeforeExec('creation_new_analyse')
  }
  /**
   * Méthode appelée par le menu "Ouvrir…" pour ouvrir une analyse
   * existante.
   */
  static chooseAnalyse(){
    this.checkIfCurrentSavedBeforeExec('choose_analyse')
  }

  /**
   * Pour choisir une nouvelle analyse ou en créer une nouvelle, il faut
   * d'abord s'assurer que l'analyse courante, si elle existe, a bien été
   * sauvegardée. Si c'est le cas, alors on exécute la méthode suivante.
   */
  static checkIfCurrentSavedBeforeExec(toolName){
    var toolMethod = require(`./js/tools/${toolName}.js`).bind(this)
    if (current_analyse && current_analyse.modified){
      var my = this
      DIALOG.showMessageBox(null, {
          type: 'question'
        , buttons: ['Sauver', 'Annuler', 'Ignorer les changements' ]
        , defaultId: 0
        , title: 'Sauvegarde de l’analyse courante'
        , message: "L'analyse courante a été modifiée. Que souhaitez-vous faire avant de charger la suivante ?"
      }, (reponse) => {
        // console.log("reponse:", reponse)
        switch (reponse) {
          case 0:
            current_analyse.methodAfterSaving = toolMethod()
            current_analyse.save()
            return
          case 1: // Annuler
            return false
          case 2: // ignorer les changements (sauf les data, normal)
            current_analyse.saveData() // toujours enregistrées
            toolMethod()
            break
        }
      })
    } else {
      toolMethod()
    }
  }

  static setGlobalOption(opt_id, opt_value){
    require('./js/tools/global_options.js').setGlobalOption(opt_id, opt_value)
  }
  static toggleGlobalOption(opt_id){
    require('./js/tools/global_options.js').toggleGlobalOption(opt_id)
  }

  /**
   * Méthode qui charge l'analyse dont le dossier est +aFolder+
   */
  static load(aFolder){
    try {
      this.isDossierAnalyseValid(aFolder) || raise(T('invalid-folder', {fpath: aFolder}))
      UI.startWait(T('loading-analyse'))
      window.current_analyse = new FAnalyse(aFolder)
      current_analyse.load()
      return true
    } catch (e) {
      console.error('ERREUR:', e)
      return F.error(e)
    }
  }

  /**
   * Méthode appelée par le menu "Définir vidéo du film courant…"
   */
  static redefineVideoPath(){
    require('./js/tools/redefine_video_path.js')()
  }


  /**
   * Méthode qui checke si le dossier +folder+ est un dossier d'analyse
   * valide. Il doit contenir les fichiers de base. Sinon, proposer à
   * l'user de créer une nouvelle analyse.
   */
  static isDossierAnalyseValid(folder){
    try {
      var eventsPath = path.join(folder,'events.json')
      var dataPath   = path.join(folder,'data.json')
      fs.existsSync(eventsPath) || raise('Le fichier des events est introuvable.')
      fs.existsSync(dataPath)   || raise('Le fichier de data est introuvable.')
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  /**
   * Instanciation de l'analyse à partir du path de son dossier
   */
  constructor(pathFolder){
    this._folder  = path.resolve(pathFolder)
    this.events   = []
  }

  // ---------------------------------------------------------------------
  //  Les données de l'analyse (dans le fichier data)

  /**
   * Retourne les données actuelles de l'analyse
   */
  get data(){
    return {
        folder:           this.folder
      , title:            this.title
      , filmStartTime:    this.filmStartTime.seconds
      , videoPath:        this.videoPath
      , diminutifs:       this.diminutifs
      , lastCurrentTime:  (this.locator ? this.locator.getRTime() : 0)
      , stopPoints:       (this.locator ? this.locator.stop_points : [])
    }
  }
  set data(v){
    this.title                = v.title
    this.filmStartTime        = new OTime(v["filmStartTime"] || 0)
    this._videoPath           = v.videoPath
    this.diminutifs           = v.diminutifs  || {}
    this.lastCurrentTime      = v.lastCurrentTime || 0
    this.stopPoints           = v.stopPoints || []
  }

  get folder()  { return this._folder }
  set folder(v) { this._folder = v}

  get filmStartTime() {
    if(undefined === this._filmStartTime){
      this._filmStartTime = new OTime(0)
    }
    return this._filmStartTime
  }
  set filmStartTime(v){ this._filmStartTime = v }

  get videoPath(){ return this._videoPath }
  set videoPath(v){
    this._videoPath = v
    this.modified = true
  }

  get title(){
    if ( undefined === this._title ){
      this._title = path.basename(this.folder)
    }
    return this._title
  }
  set title(v){ this._title = v ; this.modified = true }

  get lastCurrentTime(){
    if(undefined === this._lastCurrentTime){
      this._lastCurrentTime = this.locator.getRTime()
    }
    return this._lastCurrentTime
  }
  set lastCurrentTime(v){ this._lastCurrentTime = v }

  // ---------------------------------------------------------------------
  //  DATA VOLATILES

  get modified() { return this._modified }
  set modified(v) {
    this._modified = v
  }

  get currentScene(){
    if(undefined === this._current_scene){
      this._current_scene = Scene.sceneAt(this.locator.getRTime())
    }
    return this._current_scene
  }
  set currentScene(v){this._current_scene = v}


  // ---------------------------------------------------------------------
  /**
   * Méthode appelé quand l'analyse est prête, c'est-à-dire que toutes ses
   * données ont été chargées et traitées. Si un fichier vidéo existe, on le
   * charge.
   */
  onReady(){
    this.videoController = new VideoController(this)
    this.locator = new Locator(this)
    this.reader  = new AReader(this)
    this.init()
    this.locator.init()
    this.locator.stop_points = this.stopPoints
    this.reader.init()
    EventForm.init()
    Scene.init()
    this.setOptionsInMenus()
    this.videoController.init()
  }
  /**
   * Méthode appelée lorsque la vidéo elle-même est chargée. C'est le moment
   * où l'on est vraiment prêt.
   */
  setAllIsReady(){
    if (this.videoPath){
      this.locator.setRTime(this.lastCurrentTime)
    }
    UI.stopWait()// toujours, au cas où
    // Si une fonction a été définie pour la fin du chargement, on
    // peut l'appeler maintenant.
    if ('function' == typeof this.methodeAfterLoading){
      this.methodeAfterLoading()
    }
  }

  init(){
    // On met le titre dans la fenêtre
    window.document.title = `Analyse du film « ${this.title} »`
    // Si l'analyse courante définit une vidéo, on la charge et on prépare
    // l'interface. Sinon, on masque la plupart des éléments
    this.videoController.setVideoUI(!!this.videoPath)
    if (this.videoPath){
      this.videoController.load(this.videoPath)
    } else {
      F.error(T('video-path-required'))
      this.setAllIsReady()
    }
  }

  get options(){ return Options }

  /**
   * Réglage des options dans les menus (en asynchrone)
   */
  setOptionsInMenus(){
    // Options générales
    ipc.send('set-option', {menu_id: 'option_start_when_time_choosed', property: 'checked', value: !!this.options.get('option_start_when_time_choosed')})
    ipc.send('set-option', {menu_id: 'option_lock_stop_points', property: 'checked', value: !!this.options.get('option_lock_stop_points')})
    // Options propres à l'analyse courante
    ipc.send('set-option', {menu_id: `size-video-${this.options.get('video_size', 'medium')}`, property: 'checked', value: true})
  }
  // Méthode à lancer après le chargement des données ou après la
  // sauvegarde
  // Pour le moment, ne sert que pour les tests.
  get methodeAfterLoading(){return this._methodeAfterLoading}
  set methodeAfterLoading(v){this._methodeAfterLoading = v}
  get methodAfterSaving(){return this._methodAfterSaving}
  set methodAfterSaving(v){this._methodAfterSaving = v}

  forEachEvent(method, options){
    if(undefined===options){options = {}}
    var i   = options.from || 0
      , len = options.to || this.events.length
      ;
    for(;i<len;++i){
      method(this.events[i])
    }
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
  get vignettesScenesFolder(){
    if(undefined === this._vignettesScenesFolder){
      this._vignettesScenesFolder = path.join(this.folder,'vignettes_scenes')
    }
    return this._vignettesScenesFolder
  }

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
    (this._addEvent||requiredChunk(this,'addEvent')).bind(this)(nev, whenLoading)
  }

  updateEvent(ev, options){
    // TODO Peut-être faut-il replacer l'event à un autre endroit
    if (options && options.initTime != ev.time){
      console.error("Il faut replacer l'event au bon endroit (dans current_analyse.events)")
    }
    if(ev.type === 'scene'){this.updateNumerosScenes()}
    // On marque l'analyse modifiée
    this.modified = true
  // Enfin, s'il est affiché, il faut updater son affichage dans le
    // reader
    ev.updateInReader()
  }

  getEventById(eid){
    return this.ids[eid]
  }

  updateNumerosScenes(){
    var num = 0
    this.forEachEvent(function(ev){
      if(ev.type === 'scene' && ev.sceneType != 'generic'){
        ev.numero = ++num
        // console.log(`Numéro de scène «${ev.pitch} mis à ${ev.numero}»`)
      }
    })
  }

  getSceneNumeroAt(time){
    var current_numero = 0
    var i = 0, len = this.events.length, ev
    for(i;i<len;++i){
      ev = this.events[i]
      if (ev.time > time) {
        return current_numero
      }
      if (ev.type === 'scene' && ev.sceneType != 'generic') { current_numero += 1 }
    }
    // Non trouvé (début)
    return 0
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
   * Appelée par le menu pour sauver l'analyse
   */
  saveIfModified(){
    this.modified && this.save()
  }
  /**
   * Méthode appelée pour sauver l'analyse courante
   */
  save() {
    // On sauve les options toutes seules, ça se fait de façon synchrone
    this.options.saveIfModified()
    this.savers = 0
    this.savables_count = this.SAVED_FILES.length
    for(var fpath of this.SAVED_FILES){
      this.saveFile(fpath, this.PROP_PER_FILE[fpath])
    }
  }
  /**
   * Méthode qui n'est appelée (a priori) qu'à la fermeture de la
   * fenêtre, et au changement d'analyse.
   * @synchrone
   * Elle doit être synchrone pour pour quitter l'application
   * normalement.
   */
  saveData(){
    fs.writeFileSync(this.dataFilePath, JSON.stringify(this.data), 'utf8')
  }

  /**
   * @asynchrone
   */
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
      if(this.methodAfterSaving) this.methodAfterSaving()
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
    var my = this
    var last_id = -1
    this.events = []
    for(var d of v){
      var eClass = eval(`FAE${d.type}`)
      this.addEvent(new eClass(my, d), true)
      // Le 'true' ci-dessus permet de dire à la méthode que ce n'est pas
      // une création d'évènement.
      if(d.id > last_id){last_id = parseInt(d.id,10)}
    }
    // On peut définir le dernier ID dans EventForm (pour le formulaire)
    EventForm.lastId = last_id
    my = null
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
    // Les options peuvent être chargée en premier, de façon synchrone
    // Noter qu'elles seront appliquées plus tard, à la fin.
    this.options.load()
    // Les fichiers à charger
    var loadables = Object.assign([], my.SAVED_FILES)
    // Pour comptabiliser le nombre de fichiers chargés
    this.loaders = 0
    my.loadables_count = loadables.length
    // console.log("loadables:",loadables)
    while(fpath = loadables.shift()){my.loadFile(fpath, my.PROP_PER_FILE[fpath])}
  }

  onLoaded(fpath){
    this.loaders += 1
    if(this.loaders === this.loadables_count){
      // console.log("Analyse chargée avec succès.")
      // console.log("Event count:",this.events.length)
      this.ready = true
      this.onReady()
    }
  }

  // Charger le fichier +path+ pour la propriété +prop+ de façon
  // asynchrone.
  loadFile(fpath, prop){
    (this._loadFile||requiredChunk(this,'loadFile')).bind(this)(fpath,prop)
  }

  /**
   * Méthode qui définit le départ réel du film. Permettra de prendre un
   * bon départ
   */
  setFilmStartTimeAt(){
    (this._setFilmStartTimeAt||requiredChunk(this, 'setFilmStartTimeAt'))()
  }

  /**
   * Règle la visibilité du bouton "Aller au début du film" en fonction de la
   * définition ou non de ce temps
   */
  setButtonGoToStart(){
    $('#btn-go-to-film-start').css('visibility',(this.filmStartTime.seconds===0)?'hidden':'visible')
  }

}
