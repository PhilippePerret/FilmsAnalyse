'use strict'


$(document).ready(() => {
  // On met l'analyse de HER en analyse courante
  console.log("Chargement de l'analyse… ")

  var d = ipc.sendSync('get-screen-dimensions')
  ScreenWidth   = d.width
  ScreenHeight  = d.height

  window.current_analyse = new FAnalyse('./analyses/her')
  // Et on la charge
  current_analyse.load()
  // Note : si le chargement est réussi, l'analyse appelle
  // l'initialisation de l'interface, ce qui charge par exemple
  // la vidéo.

  // MODE_TEST && setTimeout(Tests.initAndRun.bind(Tests),2000)
  MODE_TEST && Tests.initAndRun()


})
