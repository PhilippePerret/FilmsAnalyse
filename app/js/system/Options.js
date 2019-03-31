'use strict'

/**
  * Objet Options
  * -------------
  * Gestion des options
  */

const Options = {
  class: 'Options'
, type: 'object'

  // Options par défaut
, DEFAULT_DATA: {
      'option_start_when_time_choosed':   true
    , 'option_lock_stop_points':          false
    , 'video_size':                       "medium"
    , 'option_start_3secs_before_event':  false
    , 'option_edit_in_mini_writer':       false
  }

, modified: false
  // Obtenir l'option d'id <opid>
, get(opid, defValue){
    // console.log("-> Options.get", opid, this.data)
    if(undefined === this.data[opid]){
      return defValue || this.DEFAULT_DATA[opid]
    } else {
      return this.data[opid]
    }
  }
// Définir la valeur d'une option
, set(opid, value){
    this.data[opid] = value
    this.onSetByApp(opid, value)
    this.save() // je préfère sauver tout de suite
    // this.modified = true
  }
/**
 * En fonction de l'application, les choses à faire quand on change une
 * option.
 */
, onSetByApp(opid, value){
    // console.log("Options#onSetByApp", opid, value)
    switch (opid) {
      case 'video_size':
        current_analyse.videoController.setSize(null, value)
        break
      case 'option_edit_in_mini_writer':
        UI.miniWriterizeTextFields(null, value)
        break
    }
  }
  /**
   * Méthode appelée au chargement pour appliquer les options choisies
   * Obsolète : normalement, on ne les applique pas, ce sont les éléments
   * qui en ont besoin qui vont les chercher, comme la taille de la vidéo
   * par exemple.
   */
// , apply:function(){
//     for(var opid in this.data){
//       this.onSetByApp(opid, this.data[opid])
//     }
//   }
, setData(data)    { this.data = data }
, saveIfModified() { this.modified && this.save() }
, save(){
    if(!current_analyse) return false
    fs.writeFileSync(this.path, JSON.stringify(this.data),'utf8')
    if(fs.existsSync(this.path)){
      this.modified = false
      return true
    } else {
      throw(`Un problème est survenu à l'enregistrement des options dans "${this.path}"…`)
    }
  }
, load(){
    if(!current_analyse) throw("Impossible de charger les options d'une chose qui n'existe pas…")
    if(fs.existsSync(this.path)){
      this.data = require(this.path)
    } else {
      this.data = this.DEFAULT_DATA
    }
    this.modified = false
  }
}
Object.defineProperties(Options,{
  data:{
      get(){return this._data||defP(this, '_data', this.DEFAULT_DATA)}
    , set(v){this._data = v}
  }
, path:{
      get(){
        this._path || defP(this, '_path', path.join(current_analyse.folder,'options.json'))
        return this._path
      }
}
})
