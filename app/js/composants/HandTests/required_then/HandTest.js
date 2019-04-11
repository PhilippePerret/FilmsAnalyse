'use strict'

class HandTest {
constructor(htfile, tid, data, options){
  this.htfile   = htfile // {HandTestFile}
  this.id       = tid
  this.data     = data
  this.options  = options || {position:{left:400, top:100}}// position de la fenêtre
  // console.log("data:", this.data)
}

/**
  MÉTHODE PRINCIPALE QUI JOUE LE TEST VOULU
**/
run(){
  this.fwindow.show()
  if (false === this.testIsValid()){
    this.end()
  } else {
    this.index_step = -1
    this.nextStep()
  }
}
// Passe à l'étape suivante. Soit c'est une étape "automatique" que HandTest
// reconnait et il l'exécute, soit il demande de la faire.
// Dans tous les cas il l'affiche.
nextStep(){
  ++this.index_step
  let step_cmd = this.all_steps[this.index_step] // synopsis + verifications
    , step
  if(step_cmd){
    step = new HandTestStep(this, this.index_step, step_cmd)
    step.run()
  } else {
    // <= Plus d'étape
    // => On passe à la vérification (après avoir enregitré le résultat)
    this.end()
  }
}
end(){
  let pos = this.fwindow.jqObj.position()
  this.fwindow.remove()
  this.htfile.nextTest(Object.assign(this.options,{position: pos}))
}
// Pour terminer complètement les tests (interruption)
endAll(){
  this.fwindow.remove()
  HandTests.resumeTests(this.options)
}


testIsValid(){
  try {
    this.synopsis || raise('Il faut définir le synopsis de ce test (une liste d’étapes à exécuter, certaines automatiques)')
  } catch (e) {
    F.error("Test invalide : " + e)
    return false
  }
  return true
}

build(){
  let my = this
  var headers = [
    DCreate('BUTTON', {type: 'button', class:'btn-close'})
  , DCreate('H2', {inner: this.libelle})
  ]
  let relpath = this.htfile ? this.htfile.relpath : '...'
  headers.push(DCreate('DIV', {class: 'htest-path', inner: `<label>Fichier : </label>${relpath}`}))
  this.description && headers.push(DCreate('DIV', {class: 'explication', inner: `<label>Description : </label>${this.description}`}))
  this.note && headers.push(DCreate('DIV', {class: 'explication', inner: `<label>Note : </label>${this.note}`}))

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
observe(){
  let jqo = this.fwindow.jqObj

  jqo.find('#btn-next-step').on('click',  this.nextStep.bind(this))
  jqo.find('#btn-next-test').on('click',  this.end.bind(this))
  jqo.find('#btn-finir').on('click',      this.endAll.bind(this))

  // On replace la fenêtre
  // console.log("Position forcée de la fenêtre :", this.options.position)
  jqo.css({'left':`${this.options.position.left}px`, 'top': `${this.options.position.top}px`})
}


// ---------------------------------------------------------------------
//  PROPRIÉTÉS D'UN TEST

get libelle(){return this.data.libelle || this.data.titre }
get description(){return this.data.description}
get all_steps(){
  if (undefined===this._all_steps){
    this._all_steps = Object.assign([], this.verifications, this.synopsis)
  }
  return this._all_steps
}
get synopsis(){return this.data.synopsis}
get verifications(){return this.data.verifications || []}
get note(){return this.data.note}
get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this, {y:this.options.position.top, x:this.options.position.left}))}
}// /fin HandTest
