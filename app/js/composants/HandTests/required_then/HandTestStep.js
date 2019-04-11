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
  this.write()
  if(this.isAutomaticStep()){
    // Note : on doit passer par les méthodes de HandTests pour pouvoir
    // mémoriser le résultat
    if(this.execAndTest()) HandTests.markSuccess()
    else HandTests.markFailure()
  } else {
    // On donne la main à l'utilisateur
  }
}
end(){
  this.LI.addClass('done')
  this.htest.nextStep()
}
write(){
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


get ULSteps(){return this._ulsteps||defP(this,'_ulsteps', HandTests.fwindow.jqObj.find('ul.htest-steps'))}

}// /fin classe
