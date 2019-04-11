'use strict'


const App = {
  class: 'App'
, type: 'object'
, ready: false
, onReady(){
    UI.init()
    log.info("--- APP READY ---")
    if (MODE_TEST) {
      Tests.initAndRun()
    } else {
      FAnalyse.checkLast()
    }
  }

, runHandTests(){
    if(undefined === this.nbTriesRunHandTests) this.nbTriesRunHandTests = 1
    else {
      ++ this.nbTriesRunHandTests
      if (this.nbTriesRunHandTests > 10){
        F.error("Trop de tentatives pour charger les tests manuels, je renonce.")
        return
      }
    }
    if('undefined' === typeof(HandTests)) return System.loadComponant('HandTests', this.runHandTests.bind(this))
    HandTests.initAndRun()
  }
}// /fin App

const AppLoader = {
  class:  'AppLoader'
, type:   'object'
, REQUIRED_MODULES: [
      ['common', 'FAnalyse']
    , ['common', 'FAEvents']
    , ['common', 'FAEvent']
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
