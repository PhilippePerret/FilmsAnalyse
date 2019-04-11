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

, runHandTests(options){
    if('undefined' === typeof(HandTests)) return this.loadHandTests(this.runHandTests.bind(this))
    HandTests.initAndRun(options)
  }
  /**
    Méthode pour rejouer les tests depuis le dernier
  **/
, runFromLastHandTest(){
    if('undefined' === typeof(HandTests)) return this.loadHandTests(this.runFromLastHandTest.bind(this))
    F.notify('Je dois jouer depuis le dernier test.')
    HandTests.initAndRun({from_last: true})
  }

, loadHandTests(fn_callback){
    if(undefined === this.nbTriesLoadHandTests) this.nbTriesLoadHandTests = 1
    else {
      ++ this.nbTriesLoadHandTests
      if (this.nbTriesLoadHandTests > 5){
        F.error("Trop de tentatives pour charger les tests manuels, je renonce.")
        return false
      }
    }
    if('undefined' === typeof(HandTests)) return System.loadComponant('HandTests', this.loadHandTests.bind(this, fn_callback))
    fn_callback()
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
