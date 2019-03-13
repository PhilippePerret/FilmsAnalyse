'use strict'

/**
  * Objet Options
  * -------------
  * Gestion des options
  */

const Options = {
    class: 'Options'

    // Options par défaut
  , DEFAULT_DATA: {
        'start-when-time-choosed':  true
      , 'lock-stop-points':         false
    }

  , modified: false
    // Obtenir l'option d'id <opid>
  , get:function(opid, defValue){
      return this.data[opid] || defValue
    }
  // Définir la valeur d'une option
  , set:function(opid, value){
      this.data[opid] = value
      this.modified = true
    }
  , setData:function(data){
      this.data = data
    }
  , saveIfModified:function(){
      this.modified && this.save()
    }
  , save: function(){
      if(!current_analyse) return false
      fs.writeFileSync(this.path, JSON.stringify(this.data),'utf8')
      if(fs.existsSync(this.path)){
        this.modified = false
        return true
      } else {
        throw(`Un problème est survenu à l'enregistrement des options dans "${this.path}"…`)
      }
    }
  , load: function(){
      if(!current_analyse) throw("Impossible de charger les options d'une analyse qui n'existe pas…")
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
      get:function(){
        this._data || defineP(this, '_data', this.DEFAULT_DATA)
        return this._data
      }
    , set:function(v){this._data = v}
  }
  , path:{
      get:function(){
        this._path || defineP(this, '_path', path.join(current_analyse.folder,'options.json'))
        // if(undefined === this._path){this._path = path.join(current_analyse.folder,'options.json')}
        return this._path
      }
  }
})

/**
  * Pour pouvoir utiliser la tournure
    this._propriete || defineP(this, '_propriete', valeur)
    return this._propriete
  */
function defineP(obj, prop, val){
  obj[prop] = val
}
