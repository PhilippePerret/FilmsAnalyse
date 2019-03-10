'use strict'

const Tests = {
    tests: []
  , nombre_failures:  0
  , nombre_success:   0
  , nombre_pendings:  0
  , loadings: 0

  // ---------------------------------------------------------------------

  , initAndRun:function(){
      this.init()
    }
  , init:function(){
      // Base de l'application (sert notamment pour les paths des tests)
      this.appPath = path.resolve('.')

      this.expected_loadings = 0

      // On charge tous les fichiers système
      // var sysFiles = [
      //   './js/tests/system/Test.js',
      //   './js/tests/system/handy.js'
      // ]
      var sysFiles = fs.readdirSync('./app/js/tests/system', {withFileTypes: ['.js']})
      // On lit tous les tests et on charge les balises
      var testFiles = fs.readdirSync('./app/js/tests/tests', {withFileTypes: ['.js']})

      // Nombre de chargements attendus
      this.expected_loadings += sysFiles.length
      this.expected_loadings += testFiles.length

      // console.log("sysFiles:", sysFiles)
      for(var sysFile of sysFiles){
        this.createScript(sysFile.name, './js/tests/system')
      }

      // console.log("testFiles:", testFiles)
      for(var testFile of testFiles){
        this.createScript(testFile.name, './js/tests/tests')
      }

      this.nombre_success   = 0
      this.nombre_failures  = 0
      this.nombre_pendings  = 0
    }
  , run:function(){
      this.log(RC+RC+RC+'%c============ DÉBUT DES TESTS ==============', STYLE1)
      this.nextTest()
    }
    /**
     * Méthode appelée lorsqu'un nouveau chargement de script est terminé
     */
  , addNewLoading:function(){
      -- this.expected_loadings
      console.log("this.expected_loadings:", this.expected_loadings)
      if (this.expected_loadings === 0){
        // <= Tous les chargements ont été effectués
        // => On peut commencer les tests
        this.run()
      }
    }
  , createScript: function(fpath, inFolder){
      let script = document.createElement('script')
      script.src = path.join(inFolder,fpath)
      document.head.append(script)
      script.onload = function(){
        Tests.addNewLoading()
        script = null
      }
      script.onerror = function(err){
        throw(`Une erreur est malheureusement survenue en chargement le script ${inFolder}/${fpath} : ${err}`)
      }
    }

}
