'use strict'

class HandTest {
constructor(htfile, tid, data, options){
  this.htfile   = htfile // {HandTestFile}
  this.id       = tid
  this.data     = data
}

/**
  MÉTHODE PRINCIPALE QUI JOUE LE TEST VOULU
**/
run(){
  if (false === this.testIsValid()){
    this.end()
  } else {
    HandTests.writeLibelle(this.libelle)
    HandTests.writeDescription(this.description)
    HandTests.writeNote(this.note)
    this.writeAllSteps()
    this.index_step = -1
    this.nextStep()
  }
}
// Passe à l'étape suivante. Soit c'est une étape "automatique" que HandTest
// reconnait et il l'exécute, soit il demande de la faire.
// Dans tous les cas il l'affiche.
nextStep(){
  ++ this.index_step
  let step_cmd = this.all_steps[this.index_step] // synopsis + verifications
    , step
  if(step_cmd){
    this.currentStep = new HandTestStep(this, this.index_step, step_cmd)
    this.currentStep.run()
  } else {
    // <= Plus d'étape
    // => On passe à la vérification (après avoir enregitré le résultat)
    this.end()
  }
}
end(){
  this.htfile.nextTest()
}
// Pour terminer complètement les tests (interruption)
endAll(){
  HandTests.resumeTests(this.options)
}

/**
  On écrit toutes les étapes dans la fenêtre, en grisé
**/
writeAllSteps(){
  var liId
  let ulsteps = HandTests.fwindow.jqObj.find('ul.htest-steps')
  for(var istep in this.all_steps){
    liId = `${this.id}-${istep}`
    ulsteps.append(DCreate('LI',{id:liId, inner:this.all_steps[istep], class: 'htest-step sleeping'}))
  }
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

// ---------------------------------------------------------------------
//  PROPRIÉTÉS D'UN TEST

get libelle(){return this.data.libelle || this.data.titre }
get description(){return this.data.description}
get all_steps(){
  if (undefined === this._all_steps){
    this._all_steps = []
    Object.assign(this._all_steps, this.verifications)
    Object.assign(this._all_steps, this.synopsis)
  }
  return this._all_steps
}
get synopsis(){return this.data.synopsis}
get verifications(){return this.data.verifications || []}
get note(){return this.data.note}
}// /fin HandTest
