'use strict'


module.exports = function(){
  let openOptions = {
      defaultPath:  null // __dirname
    , message:      'Analyse à ouvrir'
    , properties:   ['openDirectory']
    // , properties:   ['openDirectory', 'createDirectory']
  }
  let files = DIALOG.showOpenDialog(openOptions)
  if (!files) return false
  UI.reset()
  var analyseFolder = files[0]
  if (FAnalyse.load(analyseFolder)){
    // <= L'analyse a pu être chargée
    // => On l'enregistre comme dernière analyse chargée
    Prefs.set({'last_analyse_folder': analyseFolder})
  }
}
