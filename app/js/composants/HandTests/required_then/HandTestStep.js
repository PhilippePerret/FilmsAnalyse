'use strict'
class HandTestStep {
constructor(htest, idx, cmd){
  this.htest    = htest
  this.index    = idx
  this.command  = cmd

  this.ref = `<<HandTestStep htest="${this.htest.id}" index=${this.index}>>`
}
/**
  On doit "jouer" l'étape.
  Soit c'est une étape automatique (connue), soit il faut simplement l'afficher
  et demander à l'utilisateur de l'exécuter
**/
run(){
  log.info(`-> ${this.ref}#run`)
  this.LI.removeClass('sleeping').addClass('running')
  if(this.isCheck()){
    log.info('   -- CHECK --')
    if(this.execTheCheck()) HandTests.markSuccess()
    else HandTests.markFailure()
  } else if(this.isAutomaticStep()){
    log.info('   -- TEST AUTOMATIQUE --')
    // Note : on doit passer par les méthodes de HandTests pour pouvoir
    // mémoriser le résultat
    // Trois réponses (explicites) sont possibles :
    //  1. true   => C'est un succès. On le marque et on passe à la suite
    //  2. false  => C'est un échec. On le marque et on passe à la suite
    //  3. null   => Test asynchrone qui appellera lui-même la marque et la
    //               suite
    let res = this.execAndTest()
    // console.log("RETOUR DE execAndTest : ", res)
    if(res === true) HandTests.markSuccess()
    else if (res === false) HandTests.markFailure()
    else if (res === null) return
    else throw("Le retour de execAndTest n'est pas valide (true, false ou null attendu)")
  } else if (HandTests.mode_last) {
    log.info('   -- mode_last --')
    // Si on est en mode "last", c'est-à-dire qu'on cherche le dernier
    // test exécuté, et que ce tests a été fait, on poursuit
    var res = HandTests.resultats.tests
    // console.log("res au départ", res)
    res = res[this.htest.htfile.relpath]
    // console.log("res du fichier courant:", res)
    if(undefined === res){
      // <= pas de donnée pour le fichier courant
      // => on s'arrête là pour attendre la réponse
      // console.log("Pas de réponse, on s'arrête là")
    } else {
      // <= il y a une donnée pour le fichier courant
      // => On doit chercher s'il y a une réponse pour le test courant
      res = res[this.htest.id]
      // console.log("res du test courant dans le fichier courant:", res)
      if(undefined === res){
        // <= pas de donnée pour ce test du fichier courant
        // => on s'arrête là pour attendre la réponse
        // console.log("Pas de réponse, on s'arrête là")
      } else {
        // <= Une donnée pour ce test du fichier courant
        // => On doit chercher s'il la réponse à cette étape ou cette
        //    vérification a été donnée
        res = res[this.index]
        // console.log("res de l'étape ou la vérification dans le test courant du fichier courant:", res)
        if(undefined === res){
          // <= Pas de donnée pour cette étape/vérification
          // => on peut s'arrêter là
          HandTests.mode_last = false
        } else {
          // <= Cette étape/vérification a été traitée
          // => on doit poursuivre
          switch (res) {
            case 0: this.markFailure(); break
            case 1: this.markSuccess(); break
            case 2: this.end(); break
          }
        }
      }
    }
  } else {
    log.info('   -- Attente réponse user --')
    // On donne la main à l'utilisateur
  }
  log.info(`<- ${this.ref}#run`)
} // /run

end(){
  log.info(`-> ${this.ref}#end`)
  this.LI.addClass('done')
  this.htest.nextStep()
  log.info(`<- ${this.ref}#end`)
}

markSuccess(){
  this.LI.addClass('success')
  this.end()
}
markFailure(){
  this.LI.addClass('failure')
  this.end()
}

get liId(){return this._liId||defP(this,'_liId', `${this.htest.id}-${this.index}`)}
get LI(){return this._li || defP(this,'_li', this.ULSteps.find(`li#${this.liId}`))}
get ULSteps(){return this._ulsteps||defP(this,'_ulsteps', HandTests.fwindow.jqObj.find('ul.htest-steps'))}

}// /fin classe
