'use strict'

// ---------------------------------------------------------------------
//  CLASS

/**
  Méthode de classe qui charge l'analyse dont le dossier est +aFolder+
  et en fait l'analyse courante.
 */
FAnalyse.load = function(aFolder){
  try {
    log.info(`[FAnalyse::load] Load analyse « ${aFolder} »`)
    this.isDossierAnalyseValid(aFolder) || raise(T('invalid-folder', {fpath: aFolder}))
    UI.startWait(T('loading-analyse'))
    this.resetAll()
    window.current_analyse = new FAnalyse(aFolder)
    current_analyse.load()
    return true
  } catch (e) {
    log.error(e)
    UI.stopWait()
    return F.error(e)
  }
}

FAnalyse.resetAll = function(){
  log.info("-> [FAnalyse::resetAll] Réinitialisation complète")
  // On détruit la section vidéo de l'analyse courante
  if(window.current_analyse){
    // <= Il y a une analyse courante
    // => On doit tout initialiser
    current_analyse.videoController.remove()
    current_analyse.reader.remove()

    FAEscene.reset()

    delete current_analyse.videoController
    delete current_analyse.locator
    delete current_analyse.reader
    delete current_analyse.stater
  }
  // $('#section-videos').html()
  log.info("<- [FAnalyse::resetAll] Réinitialisation complète")
}

// ---------------------------------------------------------------------
//  INSTANCE
Object.assign(FAnalyse.prototype, {
/**
  Méthode pour charger l'analyse (courante ou pas)

  Il y aura plusieurs fichiers à charger pour une application,
  avec tous les éléments, il faut donc procéder à un chargement asynchrone
  correct (en lançant tous les chargements et en attendant que l'application
  soit prête.)

*/
load(){
  log.info("-> FAnalyse#load")
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
  while(fpath = loadables.shift()){
    my.loadFile(fpath, my.PROP_PER_FILE[fpath])
  }
  log.info("<- FAnalyse#load (mais traitement asynchrone)")
}

, onLoaded(fpath){
  this.loaders += 1
  // console.log("-> onLoaded", fpath, this.loaders)
  if(this.loaders === this.loadables_count){
    // console.log("Analyse chargée avec succès.")
    // console.log("Event count:",this.events.length)
    this.ready = true
    this.onReady()
  }
}

/**
  Méthode appelé ci-dessu quand l'analyse est prête, c'est-à-dire que toutes ses
  données ont été chargées et traitées. Si un fichier vidéo existe, on le
  charge.
 */
, onReady(){
    if(NONE === typeof FAReader) return this.loadReader(this.onReady.bind(this))
    if(NONE === typeof FAWriter) return this.loadWriter(this.onReady.bind(this))
    if(NONE === typeof FAProtocole) return this.loadProtocole(this.onReady.bind(this))
    if(NONE === typeof FAStater) return this.loadStater(this.onReady.bind(this))
    this.videoController = new VideoController(this)
    this.locator = new Locator(this)
    this.reader  = new FAReader(this)
    this.init()
    this.locator.init()
    this.locator.stop_points = this.stopPoints
    this.reader.show()//pour le moment, on affiche toujours le reader au démarrage
    EventForm.init()
    FAEscene.init()
    FAEqrd.reset().init()
    FAPersonnage.reset().init()
    this.setOptionsInMenus()
    this.videoController.init()
  }



// Charger le fichier +path+ pour la propriété +prop+ de façon
// asynchrone.
, loadFile(fpath, prop){
  new IOFile(fpath).loadIfExists({after: this.endLoadingFile.bind(this, fpath, prop)})
}

, endLoadingFile(fpath, prop, data){
  var my = this
  if('function' === typeof my[prop]){
    my[prop](data)
  } else {
    my[prop] = data
  }
  my.onLoaded.bind(my)(fpath)
}


})
