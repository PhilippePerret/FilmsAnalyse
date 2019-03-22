'use strict'
/**
 * Définition des snippets
 */

const Snippets = {
  data: {} // les snippets

, loaded: false
  /**
  * Regarde si +snip+ est un snippet et le retourne.
  * Sinon, retourne null
  **/
, check:function(snip){
    if (undefined === this.data[snip]) return null
    return this.data[snip]
  }
  // Chargement des snippets, si le fichier existe
, load:function(){
    if (false === this.fileExists()) return
    this.data = YAML.safeLoad(fs.readFileSync(this.path,'utf8'))
    this.loaded = true
  }
, init:function(){
    if(this.loaded === false) this.load()
  }
  // Actualiser les data (par exemple après l'édition du document)
, updateData:function(new_data){
    this.data = new_data
    F.notify('Données snippets actualisée.')
  }
, fileExists:function(){return fs.existsSync(this.path)}

}

Object.defineProperties(Snippets,{
  // Chemin d'accès au fichier définissant les snippets
  path:{
    get:function(){return current_analyse.filePathOf('snippets.yaml')}
  }
})
