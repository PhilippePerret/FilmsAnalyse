'use strict'

class Test {
  constructor(testName){
    try {
      pourObtenirPathTest // produit l'error pour récupérer le path
    } catch (e) {
      var src = e.stack.split("\n").reverse()[0].split(':')[1]
      var reg = new RegExp(`\/\/${Tests.appPath}\/app\/js\/tests`)
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
    this.cases.push(caseFonction)
  }

  nextCase(){
    var fn_test = this.cases.shift()
    // console.log(fn_test, typeof(fn_test))
    if (!fn_test) return Tests.nextTest()
    try {
      fn_test()
    } catch (e) {
      console.error(e)
    } finally {
      this.nextCase()
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
