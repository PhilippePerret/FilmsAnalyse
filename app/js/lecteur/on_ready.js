'use strict'


$(document).ready(() => {
  // On met l'analyse de HER en analyse courante
  console.log("Chargement de l'analyse… ")
  window.current_analyse = new FAnalyse('./analyses/her')
  // Et on la charge
  current_analyse.load()
  // Note : si le chargement est réussi, l'analyse appelle
  // l'initialisation de l'interface, ce qui charge par exemple
  // la vidéo.

})
