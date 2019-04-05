'use strict'

const APPFOLDER = path.resolve('.')


$(document).ready(() => {

  var d = ipc.sendSync('get-screen-dimensions')
  ScreenWidth   = d.width
  ScreenHeight  = d.height

  // ATTENTION : QUAND ON PASSE ICI, TOUT N'EST
  // PAS ENCORE CHARGÉ CAR CERTAINS MODULES  SONT
  // CHARGÉS DE FAÇON DYNAMIQUE. C'EST LA MÉTHODE
  // `App.onReady` QUI DÉTERMINE VRAIMENT LA FIN
  // DU CHARGEMENT DE L'APPLICATION ET LE DÉMARRAGE

})
