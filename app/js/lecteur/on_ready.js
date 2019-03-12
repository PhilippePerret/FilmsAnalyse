'use strict'


$(document).ready(() => {

  var d = ipc.sendSync('get-screen-dimensions')
  ScreenWidth   = d.width
  ScreenHeight  = d.height

  if (MODE_TEST) {

    Tests.initAndRun()

  } else {

    console.log("Je vais relever les préférences")
    
    var prefs = Prefs.get(['load_last_on_launching', 'last_analyse_folder'])
    console.log("prefs:", prefs)
    // // On met l'analyse de HER en analyse courante
    // console.log("Chargement de l'analyse… ")
    // // TODO Plus tard, il faudra l'utilisateur charger l'analyse (Ouvrir)
    // // ou définir que la dernière ouverte doit être rechargée (-> préférences)
    // window.current_analyse = new FAnalyse('./analyses/her')
    // // Et on la charge
    // current_analyse.load()
    // // Note : si le chargement est réussi, l'analyse appelle
    // // l'initialisation de l'interface, ce qui charge par exemple
    // // la vidéo.
  }

})
