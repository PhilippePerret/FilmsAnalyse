'use strict'

// ---------------------------------------------------------------------
//  CLASS

/**
  Méthode de classe qui charge l'analyse dont le dossier est +aFolder+
  et en fait l'analyse courante.
 */
FAnalyse.load = function(aFolder){
  try {
    this.isDossierAnalyseValid(aFolder) || raise(T('invalid-folder', {fpath: aFolder}))
    UI.startWait(T('loading-analyse'))
    if(current_analyse){
      this.resetAll()
    }
    // Chargement des composants nécessaires
    if(NONE === typeof FAReader) return this.loadReader(this.load.bind(this, aFolder))
    window.current_analyse = new FAnalyse(aFolder)
    current_analyse.load()
    return true
  } catch (e) {
    UI.stopWait()
    return F.error(e)
  }
}

FAnalyse.resetAll = function(){
  // On détruit la section vidéo de l'analyse courante
  current_analyse.videoController.section.remove()
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

// Charger le fichier +path+ pour la propriété +prop+ de façon
// asynchrone.
, loadFile(fpath, prop){
  new IOFile(fpath).loadIfExists({after: this.endLoadingFile.bind(this, fpath, prop)})
}

, endLoadingFile(fpath, prop, data){
  var my = this
  my[prop] = data
  my.onLoaded.bind(my)(fpath)
}


})
