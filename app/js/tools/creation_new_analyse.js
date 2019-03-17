'use strict'

const NewAnalyse = {
  askForFolder: function(){
    let openOptions = {
        defaultPath:  null // __dirname
      , message:      'Dossier de la nouvelle analyse (le créer si nécessaire)'
      , properties:   ['openDirectory', 'createDirectory']
    }
    let files = DIALOG.showOpenDialog(openOptions)
    if (!files) return false
    var analyseFolder = files[0]
    // Si c'est un dossier qui contient déjà une analyse, on produit une erreur
    if(FAnalyse.isDossierAnalyseValid(analyseFolder)){
      return F.error(T('already-analyse-folder'))
    } else {
      return analyseFolder
    }
  }
    /**
     * Renvoie :
     *    false   en cas d'erreur (interrompt la procédure)
     *    null    en cas de non choix de vidéo NON : IL FAUT LE FILM
     *    path    le path au fichier vidéo en cas de succès
     */
  , askForVideo: function(){
      let openOptions = {
          defaultPath:  null // __dirname
        , message:      'Fichier vidéo du film (.mp4, .ogg ou .webm)'
        , properties:   ['openFile']
        , filters: [
            {name:"Films", extensions: ["mp4", "ogg", "webm"]}
        ]
      }
      let files = DIALOG.showOpenDialog(openOptions)
      if (!files) return F.error(T('video-required'))
      var videoPath = files[0]
      // Note : l'extension est correcte puisqu'on limite aux extensions
      // acceptées. Donc, pour le moment, aucune vérification n'est utile
      return videoPath
    }
}


module.exports = function(){
  let folderPath, videoPath
  try {
    // On demande le dossier pour la nouvelle analyse
    folderPath = NewAnalyse.askForFolder()
    folderPath || raise('Dossier invalide')
    // On demande le path du fichier vidéo
    videoPath = NewAnalyse.askForVideo()
    videoPath !== false || raise('Vidéo invalide')
    // Tout est OK, on peut initialiser une nouvelle analyse
    var analyse = new FAnalyse(folderPath)
    analyse.videoPath = videoPath
    analyse._videoSize = 'medium'
    analyse.save()
    // console.log("analyse.data :", analyse.data)
    window.current_analyse = analyse
    UI.reset()
    F.notify(T('conf-created-analyse'))
    window.current_analyse.load()
  } catch (e) {
    console.log(e)
  }
}
