'use strict'

const MODE_TEST = process.env.MODE_TEST == "true"
// console.log("MODE_TEST:", MODE_TEST)

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

      // On charge tous les fichiers système
      var sysFirstRequired = glob.sync('./app/js/tests/system_first/**/*.js')

      // Nombre de chargements attendus
      this.expected_loadings = 0
      this.expected_loadings += sysFirstRequired.length
      // console.log("Nombre de scripts requis :", this.expected_loadings)

      this.methode_suite_loading = this.loadSysAndTestsFiles.bind(this)
      for(var relpath of sysFirstRequired){
        this.createScript(relpath)
      }

      this.nombre_success   = 0
      this.nombre_failures  = 0
      this.nombre_pendings  = 0
      this.sys_errors       = []
    }

  , loadSysAndTestsFiles:function(){
      console.log("-> loadSysAndTestsFiles")

      var sysFiles  = glob.sync('./app/js/tests/system/**/*.js')
      var testFiles = glob.sync('./app/js/tests/tests/**/*.js')
      var supFiles  = glob.sync('./app/js/tests/support/**/*.js')

      this.expected_loadings = 0
      this.expected_loadings += sysFiles.length
      this.expected_loadings += testFiles.length
      this.expected_loadings += supFiles.length

      // La méthode qui devra être appelée après le chargement
      this.methode_suite_loading = this.run.bind(this)

      for(var filesFolder of [sysFiles, testFiles, supFiles]){
        // console.log("Fichiers du dossier :", filesFolder, sysFiles)
        for(var relpath of filesFolder){
          this.createScript(relpath)
        }
      }
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
      if (this.expected_loadings === 0){
        // <= Tous les chargements ont été effectués
        // => On peut passer à la suite les tests
        this.methode_suite_loading()
      }
    }
  , createScript: function(fpath){
      let script = document.createElement('script')
      script.src = fpath.replace(/\.\/app/,'.')
      document.head.append(script)
      script.onload = function(){
        Tests.addNewLoading()
        script = null
      }
      script.onerror = function(err){
        throw(`Une erreur est malheureusement survenue en chargement le script ${fpath} : ${err}`)
      }
    }

}
