'use strict'

const APPFOLDER = path.resolve('.')


$(document).ready(() => {

  var d = ipc.sendSync('get-screen-dimensions')
  ScreenWidth   = d.width
  ScreenHeight  = d.height

  UI.init()

  if (MODE_TEST) {

    Tests.initAndRun()

  } else {

    // Voir si les préférences demandent que la dernière analyse soit chargée
    // et la charger si elle est définie.
    FAnalyse.checkLast()

    // $('#reader').focus()

  }

})
