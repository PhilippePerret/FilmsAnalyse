'use strict'

const HandTests = {
  class:'HandTests'
, type: 'object'
// Méthode principale appelée pour lancer les tests (par exemple depuis le
// menu, par App)
, initAndRun(options){
    if(undefined === options) options = {}
    log.info('-> HandTests::initAndRun')
    this.init() // sauf le résultat
    if(options.from_last){
      // Pour rejoindre le dernier test effectué. Fonctionnement : on
      // passe en revue tous les tests, jusqu'à trouver celui qui n'est
      // pas complet.
      this.mode_last = true
      this.loadResultats()
    } else {
      this.mode_last = false
      this.initResultats()
    }
    this.run()
  }
// Initialisation des tests manuels
, init(){
    log.info('-> HandTests::init')
    log.info("*** Initialisation des tests manuels (HandTests)")
    this.index_current_htestfile = -1
    delete this._fwindow
    log.info('<- HandTests::init')
  }
, initResultats(){
    // On prépare le résultat final. noter qu'on ne le fait pas
    // si l'on doit rejoindre le dernier test.
    this.resultats = {
      date: new Date().getTime(),
      successCount: 0, failureCount: 0, pendingCount: 0,
      tests:{}
    }
  }
, run(){
    log.info('-> HandTests::run')
    this.fwindow.show()
    this.nextHTestFile()
    log.info('<- HandTests::run')
  }
, nextHTestFile(){
    log.info('-> HandTests::nextHTestFile')
    ++ this.index_current_htestfile
    log.info(`     this.index_current_htestfile = ${this.index_current_htestfile}`)
    let hTestFile = this.HTestFiles[this.index_current_htestfile]
    log.info(`     hTestFile = "${hTestFile}"`)
    if(hTestFile){
      this.currentHtestFile = new HandTestFile(hTestFile)
      this.currentHtestFile.run()
    } else {
      this.resumeTests()
    }
    log.info('<- HandTests::nextHTestFile')
  }

// ---------------------------------------------------------------------
//  MÉTHODES DE RÉSULTATS

  /**
    Fin des tests, provoquée ou normale

    @param {Object}   options   Contenant les résultats
  **/
, resumeTests(){
    let jqo = this.fwindow.jqObj
      , body = jqo.find('.htest-body')
      , res  = this.resultats
      , color
    jqo.find('.htest-footer').hide()
    let msg = `success: ${res.successCount}    failures: ${res.failureCount}     pending: ${res.pendingCount}`
    if (res.failureCount){
      color = 'red'
    } else if (res.pendingCount){
      color = 'orange'
    } else {
      color = 'green'
    }
    body.html(`<pre style="font-family:monospace;font-weight:bold;font-size:1.2em;color:${color}">${msg}</pre>`)
    this.saveResultats()
    body.append(DCreate('DIV',{class:'small italic', inner: "Résultats enregistrés dans ./Tests_manuels/resultats.json."}))
  }


, saveResultats(){
    this.code   = this.resultats
    this.iofile.save({after: this.endSaveResultats.bind(this)})
  }
, endSaveResultats(){
  }

, loadResultats(){
    this.resultats = JSON.parse(fs.readFileSync(this.path,'utf8'))
  }
// ---------------------------------------------------------------------
//  MÉTHODES D'HELPER

, writePath(rpath){ this.writeFoo('path', rpath) }
, writeLibelle(lib){ this.writeFoo('libelle', lib) }
, writeDescription(desc){ this.writeFoo('description', desc) }
, writeNote(note){ this.writeFoo('note', note) }
, writeFoo(what, str){
    this.fwindow.jqObj.find(`.htest-${what} span`).html(str)
  }
, resetStepList(){
    this.fwindow.jqObj.find('ul.htest-steps').html('')
  }
// ---------------------------------------------------------------------
//  MÉTHODES DE CONSTRUCTION

, build(){
  let my = this
  var headers = [
    DCreate('BUTTON', {type: 'button', class:'btn-close'})
  , DCreate('H2', {class: 'htest-libelle', append:[DCreate('SPAN',{inner:'...'})]})
  ]
  headers.push(DCreate('DIV', {class: 'htest-path', append:[
      DCreate('LABEL', {inner: 'Fichier : '})
    , DCreate('SPAN', {inner: '...'})
  ]}))
  this.description && headers.push(DCreate('DIV', {class: 'htest-description explication', append:[
      DCreate('LABEL', {inner: 'Description : '})
    , DCreate('SPAN', {inner: '...'})
  ]}))
  this.note && headers.push(DCreate('DIV', {class: 'htest-note explication', append:[
      DCreate('LABEL', {inner: 'Note : '})
    , DCreate('SPAN', {inner: '...'})
  ]}))

  return [DCreate('DIV', {class:'htest', append: [
    // Header
    DCreate('DIV', {class:'htest-header', append: headers})
    // Le body
  , DCreate('DIV', {class:'htest-body', append:[
      DCreate('UL',{class: 'htest-steps'})
    ]})
    // Les boutons dans le footer
  , DCreate('DIV', {class: 'htest-footer', append: [
      DCreate('BUTTON', {id: 'btn-finir',     inner: 'FINIR'})
    , DCreate('BUTTON', {id: 'btn-next-test', inner: 'Test suivant'})
    , DCreate('BUTTON', {id: 'btn-next-step', inner: 'Étape suivante'})
    , DCreate('SPAN', {class:'separator', style:'display:inline-block;width:100px;'})
    , DCreate('BUTTON', {id: 'btn-step-success', inner: 'OK'})
    , DCreate('BUTTON', {id: 'btn-step-failure', inner: 'ERROR'})
    ]})

  ]})]
}

, observe(){
  let jqo = this.fwindow.jqObj

  jqo.find('#btn-next-test').on('click',  this.nextTest.bind(this))
  jqo.find('#btn-next-step').on('click',  this.nextStep.bind(this))
  jqo.find('#btn-finir').on('click',      this.resumeTests.bind(this))
  jqo.find('#btn-step-success').on('click', this.markSuccess.bind(this))
  jqo.find('#btn-step-failure').on('click', this.markFailure.bind(this))

}

, markSuccess(){
    if (false === this.mode_last){
      this.resultats.successCount ++
      this.consigneResCurStep(1)
    }
    this.currentHtestFile.currentHTest.currentStep.markSuccess()
  }
, markFailure(){
    if (false === this.mode_last){
      this.resultats.failureCount ++
      this.consigneResCurStep(0)
    }
    this.currentHtestFile.currentHTest.currentStep.markFailure()
  }
  // Quand on n'utilise ni le bouton OK ni le bouton ERROR
, markPending(){
    if (this.mode_last) return
    this.resultats.pendingCount ++
    this.consigneResCurStep(2)
  }
  // Retourne la clé absolue de l'étape du test courant du fichier courant
, consigneResCurStep(valRes){
    if(undefined === this.resultats.tests[this.currentHtestFile.relpath]){
      this.resultats.tests[this.currentHtestFile.relpath] = {}
    }
    if(undefined === this.resultats.tests[this.currentHtestFile.relpath][this.currentHtestFile.currentHTest.id]){
      this.resultats.tests[this.currentHtestFile.relpath][this.currentHtestFile.currentHTest.id] = {}
    }
    this.resultats.tests[this.currentHtestFile.relpath][this.currentHtestFile.currentHTest.id][this.currentHtestFile.currentHTest.currentStep.index] = valRes
  }
, nextStep(){
  this.markPending()
  this.currentHtestFile.currentHTest.nextStep()
  }
, nextTest(){
  this.currentHtestFile.nextTest()
  }

} // /fin de HandTests
Object.defineProperties(HandTests,{
  path:{
    get(){return path.join(this.folder, 'resultats.json')}
  }
, iofile:{
    get(){return this._iofile||defP(this,'_iofile',new IOFile(this))}
  }
, HTestFiles:{
  get(){
    if(undefined === this._HTestFiles){
      this._HTestFiles = glob.sync(`${this.folder}/**/*.yaml`)
    }
    return this._HTestFiles
  }
}
, fwindow:{
    get(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{x: 600, y:20}))}
}
, folder:{
    get(){return this._folder||defP(this,'_folder',path.join(APPFOLDER,'Tests_manuels'))}
  }
})
