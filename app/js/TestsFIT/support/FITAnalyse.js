'use strict'

const FITAnalyse = {
    /**
     * Pour mettre l'analyse de dossier +folder+ en analyse courante
     */
    setCurrent:function(folder, resolve, options){
      if(undefined===options){options = {}}
      window.current_analyse = new FAnalyse(`./analyses/${folder}`)
      // En fonction des options
      if(options.remove_events){
        
      }
      // Pour lancer les tests à la fin du chargement
      window.current_analyse.methodeAfterLoading = resolve
      window.current_analyse.load()
    }
}
