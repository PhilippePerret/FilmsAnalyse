'use strict'
/**
  Ce module contient les méthodes utiles pour faire les tests manuels,
  qui peuvent être appelées depuis les `exec` des définitions des étapes
  automatiques. Voir par exemple `ouvrir l'analyse [etc.]`
**/
Object.assign(HandTests,{
  loadAnalyseAndWait(relpath){
    let fpath = path.join(APPFOLDER,'analyses','tests','MANUELS',relpath)
    if(fs.existsSync(fpath)){
      try {
        FAnalyse.load(fpath, this.endLoadAnalyseAndWait.bind(this))
        return null // null exactement, pour attendre la suite
      } catch (e) {
        console.error(e)
        return 0 // pour marquer faux et poursuivre
      }
    } else {
      F.notice(`L'analyse "./analyse/tests/MANUELS/${relpath}" n'existe pas encore. Il faut que tu la crées, si tu veux automatiser cette étape.`)
      return 0
    }
  }
, endLoadAnalyseAndWait(){
    log.info('-> HandTests::HandTests')
    this.markNormalStep()
    log.info('<- HandTests::HandTests')
  }
})
