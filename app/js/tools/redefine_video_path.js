'use strict'

const NewAnalyse = {
    /**
     * Renvoie :
     *    false   en cas d'erreur (interrompt la procédure)
     *    null    en cas de non choix de vidéo NON : IL FAUT LE FILM
     *    path    le path au fichier vidéo en cas de succès
     */
    askForVideo: function(){
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
    // On demande le path du nouveau fichier vidéo
    videoPath = NewAnalyse.askForVideo()
    videoPath !== false || raise('Vidéo invalide')
    current_analyse.videoPath = videoPath
    current_analyse.videoController.load(videoPath)
  } catch (e) {
    console.log(e)
  }

}
