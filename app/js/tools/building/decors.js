'use strict'

module.exports = function(){
  var my = this
  new FADecorsList(current_analyse).display()
}

class FADecorsList {
constructor(analyse){
  this.analyse = this.a = analyse
}
display(){ this.fwindow.show() }
close()  { this.fwindow.hide()}
build(){
  let divsDecors = []
  if(this.a.decors.count === 0){
    divsDecors.push(DCreate('DIV', {inner: 'Aucun décor pour ce film <span class="small">(définissez les scènes pour en ajouter)</span>.', class:'warning'}))
  } else {
    FADecor.forEachDecor(function(decor){
      // les scènes qui n'appartiennent pas à des sous-décors
      var divsScenesMain = []
      decor.forEachScene(function(scene){
        divsScenesMain.push(DCreate('DIV', {inner: scene.as('pitch', FORMATED|EDITABLE|LABELLED)}))
      })
      // Les sous-décors
      var divsSousDecors = []
      decor.forEachSousDecor(function(sousdec){
        var divsScenes = []
        sousdec.forEachScene(function(scene){
          divsScenes.push(DCreate('DIV', {inner: scene.as('pitch', FORMATED|EDITABLE|LABELLED)}))
        })
        divsSousDecors.push(DCreate('DIV', {class:'sous-decor', inner: DFormater(sousdec.name)}))
        divsSousDecors.push(DCreate('DIV', {class:'scenes', append:divsScenes}))
      })
      divsDecors.push(DCreate('DIV', {class:'div-decor', append:[
        DCreate('DIV', {inner: DFormater(decor.name)})
      , DCreate('DIV', {class: 'scenes', append: divsScenesMain })
      , DCreate('DIV', {class:'sous-decors', append:divsSousDecors})
      ]}))
    })
  }

  return [
    DCreate('DIV', {class: 'header', append:[
        DCreate('BUTTON', {type:'button', class:'btn-close'})
      , DCreate('H3', {inner: `Liste des ${FADecor.count} décors`})
      ]})
  , DCreate('DIV', {class:'body', append: divsDecors})
  , DCreate('DIV', {class:'footer', append:[
      DCreate('BUTTON', {type:'button', inner: 'OK', class: 'btn-ok'})
    ]})
  ]
}
observe(){
  this.fwindow.jqObj.find('.btn-ok').on('click', this.close.bind(this))
}

get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{class:'fwindow-listing-type decors', x:10, y:10}))}
}
