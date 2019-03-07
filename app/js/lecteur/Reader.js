'use strict'
/**
 * Object Reader
 * --------------
 * Pour la lecture de l'analyse
 */

const Reader = {

  // Pour ajouter
  append(node) {
    this.container.append(node)
  }

}
Object.defineProperties(Reader,{
    container: {
      get:function(){
        if(undefined === this._container){
          this._container = document.getElementById('reader')
        }
        return this._container
      }
    }
  , section:{
      get:function(){return document.getElementById('section-reader')}
    }
})
