'use strict'

class Test {
  constructor(testName){
    try {
      pourObtenirPathTest // produit l'error pour récupérer le path
    } catch (e) {
      var src = e.stack.split("\n").reverse()[0].split(':')[1]
      var reg = new RegExp(`\/\/${Tests.appPath}\/${Tests.MAINFOLDER}`)
      src = src.replace(reg,'.').trim()
      this.srcRelPath = src
    }
    this.title = testName
    this.cases = []
    Tests.addTest(this)
  }

  /**
   * Création d'un nouveau cas
   */
  case(caseName, caseFonction){
    this.cases.push(new TCase(caseName, caseFonction));
  }

  nextCase(){
    // console.log("-> Test#nextCase")
    var my = this
    var tcase = this.cases.shift()
    if(!tcase){ return Tests.nextTest() }
    // On joue le test et on passe au suivant
    try {
      tcase.run().then(my.nextCase.bind(my));
    } catch (e) {
      console.log(`ERROR TEST: ${e}`)
      return Tests.nextTest()
    } finally {
      my = null
    }
  }

  /**
   * Pour jouer le test
   */
  run(){
    Tests.showTestTitle(this.title, this.srcRelPath)
    this.nextCase()
  }
}

const TCase = function(intitule, fn_test){
  this.intitule = intitule;
  this.fn       = fn_test;
};
TCase.prototype.run = function(){
  var my = this ;
  Tests.log(`%c---> Cas : ${my.intitule}`, STYLE3);
  return new Promise(function(ok,ko){
    try{
      var res = my.fn()
      if(res && res.constructor.name == 'Promise'){
        res.then(ok)
      } else {
        ok()
      };
    } catch(err){
      Tests.add_sys_error(my, err)
    }
  })
}
