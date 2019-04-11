'use strict'
class HandTestStep {
constructor(htest, idx, cmd){
  this.htest    = htest
  this.index    = idx
  this.command  = cmd
}
/**
  On doit "jouer" l'étape.
  Soit c'est une étape automatique (connue), soit il faut simplement l'afficher
  et demander à l'utilisateur de l'exécuter
**/
run(){
  this.show()
  this.observe()
  if(this.isAutomaticStep()){
    if(this.execAndTest()) this.markSuccess()
    else this.markFailure()
  } else {
    // On donne la main à l'utilisateur
  }
}
end(){
  this.LI.addClass('done')
  this.htest.nextStep()
}
show(){
  let liId = `${this.htest.id}-${this.index}`
  this.ULSteps.append(DCreate('LI',{id:liId, inner:this.command, class: 'htest-step running'}))
  this.LI = this.ULSteps.find(`li#${liId}`)
}

markSuccess(){
  this.LI.addClass('success')
  this.end()
}
markFailure(){
  this.LI.addClass('failure')
  this.end()
}

observe(){
  let jqo = this.htest.fwindow.jqObj
    , btn_success = jqo.find('#btn-step-success')
    , btn_failure = jqo.find('#btn-step-failure')

  btn_success.off('click')
  btn_failure.off('click')

  btn_success.on('click',  this.markSuccess.bind(this))
  btn_failure.on('click',  this.markFailure.bind(this))

}


get ULSteps(){return this._ulsteps||defP(this,'_ulsteps', this.htest.fwindow.jqObj.find('ul.htest-steps'))}

}// /fin classe
