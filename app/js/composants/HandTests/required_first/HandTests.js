'use strict'

const HandTests = {
  class:'HandTests'
, type: 'object'
// Méthode principale appelée pour lancer les tests (par exemple depuis le
// menu, par App)
, initAndRun(){
    log.info('-> HandTests::initAndRun')
    this.init()
    this.run()
  }
// Initialisation des tests manuels
, init(){
    log.info('-> HandTests::init')
    log.info("*** Initialisation des tests manuels (HandTests)")
    this.index_current_htestfile = -1
    log.info('<- HandTests::init')
}
, run(){
    log.info('-> HandTests::run')
    this.nextHTestFile()
    log.info('<- HandTests::run')
  }
, nextHTestFile(options){
    ++ this.index_current_htestfile
    let hTestFile = this.HTestFiles[this.index_current_htestfile]
    if(hTestFile){
      this.currentHtestFile = new HandTestFile(hTestFile, options)
      this.currentHtestFile.run()
    } else {
      this.resumeTests(options)
    }
  }

  /**
    Fin des tests, provoquée ou normale

    @param {Object}   options   Contenant les résultats
  **/
, resumeTests(options){
    let htest_fictif = new HandTest(null, null, {libelle:'Résultat des tests'})
    this.build = htest_fictif.build.bind(htest_fictif)
    this.fwindow.show()
    let jqo = this.fwindow.jqObj
      , body = jqo.find('.htest-body')
    jqo.find('.htest-footer').hide()
    body.html("<p>Je vais marquer les résultats des tests</p>")
}

} // /fin de HandTests
Object.defineProperties(HandTests,{
HTestFiles:{
  get(){
    if(undefined === this._HTestFiles){
      this._HTestFiles = glob.sync(`${this.folder}/**/*.yaml`)
    }
    return this._HTestFiles
  }
}
, fwindow:{
    get(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{}))}
}
, folder:{
    get(){return this._folder||defP(this,'_folder',path.join(APPFOLDER,'Tests_manuels'))}
  }
})
