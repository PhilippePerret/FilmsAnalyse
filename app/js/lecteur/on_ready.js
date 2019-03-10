'use strict'


$(document).ready(() => {
  // On met l'analyse de HER en analyse courante
  console.log("Chargement de l'analyse… ")

  var d = ipc.sendSync('get-screen-dimensions')
  ScreenWidth   = d.width
  ScreenHeight  = d.height

  if (MODE_TEST) {
    Tests.initAndRun()
  } else {
    // TODO Plus tard, il faudra l'utilisateur charger l'analyse (Ouvrir)
    // ou définir que la dernière ouverte doit être rechargée (-> préférences)
    window.current_analyse = new FAnalyse('./analyses/her')
    // Et on la charge
    current_analyse.load()
    // Note : si le chargement est réussi, l'analyse appelle
    // l'initialisation de l'interface, ce qui charge par exemple
    // la vidéo.
  }

})
