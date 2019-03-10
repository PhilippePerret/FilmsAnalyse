'use strict'

const FITAnalyse = {

    /**
     * Pour mettre l'analyse de dossier +folder+ en analyse courante
     */
    setCurrent:function(folder, options){
      window.current_analyse = new FAnalyse(`./analyses/${folder}`)
      window.current_analyse.load()
    }
}
