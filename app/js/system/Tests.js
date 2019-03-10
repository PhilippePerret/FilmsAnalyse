'use strict'


const Tests = {
    tests: []     // liste des instances de tests
  , initAndRun:function(){
      this.init()
      setTimeout(this.run.bind(this),2000)
    }
  , init:function(){
      // On charge tous les fichiers système
      // var sysFiles = [
      //   './js/tests/system/Test.js',
      //   './js/tests/system/handy.js'
      // ]
      var sysFiles = fs.readdirSync('./app/js/tests/system', {withFileTypes: ['.js']})
      // console.log("sysFiles:", sysFiles)
      for(var sysFile of sysFiles){
        this.createScript(sysFile.name, './js/tests/system')
      }
      // On lit tous les tests et on charge les balises
      var testFiles = fs.readdirSync('./app/js/tests/tests', {withFileTypes: ['.js']})
      // console.log("testFiles:", testFiles)
      for(var testFile of testFiles){
        this.createScript(testFile.name, './js/tests/tests')
      }
    }
  , run:function(){
      if (this.tests.length){
        try {
          this.tests.shift().run()
        } catch (e) {
          console.error(e)
        }
      } else {
        this.termine()
      }
    }
  , next:function(){
      this.run()
    }

    /**
     * Méthode pour "terminer" les tests, c'est-à-dire pour afficher les
     * résultats.
     */
  , termine:function(){
      console.log("FIN DES TESTS")
    }
  , addTest:function(itest){
      this.tests.push(itest)
    }
  // ---------------------------------------------------------------------
  //  Méthodes fonctionnelles
  , createScript:function(fpath, inFolder){
      var n = document.createElement('SCRIPT')
      n.src = path.join(inFolder,fpath)
      document.head.append(n)
    }
}
