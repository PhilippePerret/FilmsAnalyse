'use strict'


const App = {
  class: 'App'
, type: 'object'
, ready: false
, onReady(){
    console.log("App est prête.")
    UI.init()
    if (MODE_TEST) {
      Tests.initAndRun()
    } else {
      // Voir si les préférences demandent que la dernière analyse soit chargée
      // et la charger si elle est définie.
      FAnalyse.checkLast()
    }
  }
}

const AppLoader = {
  class:  'AppLoader'
, type:   'object'
, REQUIRED_MODULES: [
      ['common', 'FAnalyse']
    , ['common', 'FAEvents']
  ]
, start(){
    this.requiredModules = Object.assign([], this.REQUIRED_MODULES)
    this.requireNext()
  }
, requireNext(){
    // console.log("-> requireNext")
    if(this.requiredModules.length){
      // <= Il y a encore des modules à charger
      // => On poursuit
      let [folder, subfolder] = this.requiredModules.shift()
      System.loadJSFolders(`./app/js/${folder}`, [subfolder], this.requireNext.bind(this))
    } else {
      // <= Il n'y a plus de modules à charger
      // => On est prêt
      this.onReady()
    }
  }

, onReady(){
    App.ready = true
    App.onReady()
  }
}

// On démarre le chargement
AppLoader.start()
