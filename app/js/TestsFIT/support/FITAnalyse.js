'use strict'

const FITAnalyse = {
    analyse: null // analyse courante des tests
    /**
     * Pour mettre l'analyse de dossier +folder+ en analyse courante
     */
  , setCurrent:function(folder, options, resolve){
      console.log("-> setCurrent")
      var my = this
      if(undefined === options){options = {}}
      window.current_analyse = new FAnalyse(`./analyses/${folder}`)
      this.analyse = window.current_analyse
      // En fonction des options
      if( options.remove_events ){
        if (folder == 'simple3scenes') throw("Impossible de détruire les events de simple3scenes (on doit les garder absolument)")
        else this.removeEvents(options)
      }

      if (undefined === resolve){
        // <= l'argument resolve n'est pas défini
        // => Il faut retourner une promesse
        console.log("On retourne une promesse")
        return new Promise(ok => {
          my.analyse.methodeAfterLoading = ok
          this.analyse.load()
        })
      } else {
        // Pour lancer les tests à la fin du chargement
        this.analyse.methodeAfterLoading = resolve
        this.analyse.load()
      }
    }
    /**
      * Méthode sauvant l'analyse courant (this.analyse)
      * @asynchrone
      */
  , save: function(){
      return new Promise(ok => {
        this.analyse.methodAfterSaving = ok
        this.analyse.save()
      })
    }

    /**
      * Destruction des évènements.
      * Noter que maintenant on ne détruit plus le fichier, on le vide
      */
  , removeEvents:function(){
      fs.writeFileSync(this.analyse.eventsFilePath,'[]','utf8')
      this.analyse._events  = []
      this.analyse.ids      = {}
      EventForm.lastId      = -1
      $('#reader').html('')
      $('.form-edit-event').remove() // toutes
    }
}

FITAnalyse.load = FITAnalyse.setCurrent
