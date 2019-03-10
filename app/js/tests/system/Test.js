'use strict'

class Test {
  constructor(testName){
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
    if(!fn_test){
      return Tests.next()
    }
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
    console.log(`%c${this.title}`, 'font-weight:bold;font-size:1.2"m;color:blue;')
    try {
      this.nextCase()
    } catch (e) {
      console.error(e)
    } finally {
      Tests.next()
    }
  }
}
