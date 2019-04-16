'use strict'

class HandTest {
constructor(htfile, tid, data, options){
  this.htfile   = htfile // {HandTestFile}
  this.id       = tid
  this.data     = data

  this.ref = `<<HandTest id="${this.id}">>`
}

/**
  MÉTHODE PRINCIPALE QUI JOUE LE TEST VOULU
**/
run(){
  log.info(`-> ${this.ref}#run`)
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
  log.info(`<- ${this.ref}#run`)
}
// Passe à l'étape suivante. Soit c'est une étape "automatique" que HandTest
// reconnait et il l'exécute, soit il demande de la faire.
// Dans tous les cas il l'affiche.
nextStep(){
  log.info(`-> ${this.ref}#nextStep`)
  let step_cmd = this.all_steps[++this.index_step] // synopsis + checks
    , step
  log.info(`     this.index_step = ${this.index_step}`)
  log.info(`     step_cmd = "${step_cmd}"`)
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
  log.info(`-> ${this.ref}#end`)
  this.htfile.nextTest()
  log.info(`<- ${this.ref}#end`)
}
// Pour terminer complètement les tests (interruption)
endAll(){
  log.info(`-> ${this.ref}#endAll`)
  HandTests.resumeTests(this.options)
  log.info(`<- ${this.ref}#endAll`)
}

/**
  On écrit toutes les étapes dans la fenêtre, en grisé
**/
writeAllSteps(){
  log.info(`-> ${this.ref}#writeAllSteps`)
  var liId, command, cmdchk
  let ulsteps = HandTests.fwindow.jqObj.find('ul.htest-steps')
  for(var istep in this.all_steps){
    liId    = `${this.id}-${istep}`
    command = this.all_steps[istep]
    if('object' === typeof command && Object.keys(command)[0] == 'check'){
      // => c'est un check à faire
      command = `⚐ ${command['check']}`
    } else if (command.match(/^\/(.*)\/$/)){
      // <= une expression régulière
      // => la raboter pour supprimer les '/.../'
      command = command.substring(1, command.length - 1)
    }
    ulsteps.append(DCreate('LI',{id:liId, inner: command, class: 'htest-step sleeping'}))
  }
  log.info(`<- ${this.ref}#writeAllSteps`)
}

testIsValid(){
  try {
    this.synopsis || raise('Il faut définir le synopsis de ce test (une liste d’étapes à exécuter, certaines automatiques)')
    this.checks   || raise('Il faut définir les checks à effectuer.')
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
    Object.assign(this._all_steps, this.synopsis)
    this._all_steps.push(...this.checks.map(x => `⚐ ${x}`))
    // console.log("this._all_steps:",this._all_steps)
  }
  return this._all_steps
}
get synopsis(){return this.data.synopsis}
get checks(){return this.data.checks || []}
get note(){return this.data.note}
}// /fin HandTest
