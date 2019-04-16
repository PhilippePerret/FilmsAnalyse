'use strict'

module.exports = function(){
  var my = this
  new FAInfosFilm(current_analyse).display()
}

class FAInfosFilm {
constructor(analyse){
  this.analyse = this.a = analyse
}
display(){ this.fwindow.show() }
close()  { this.fwindow.hide()}
build(){
  let divsInfos = []
  divsInfos.push(DCreate('DIV', {append:[
      DCreate('LABEL', {inner: 'Titre du film'})
    , DCreate('SPAN', {inner: this.a.titre})
    ]}))
  return [
    DCreate('DIV', {class: 'header'})
  , DCreate('DIV', {class:'body', append: divsInfos})
  , DCreate('DIV', {class:'footer', append:[
      DCreate('BUTTON', {type:'button', inner: 'OK', class: 'btn-ok'})
    ]})
  ]
}
observe(){
  this.fwindow.jqObj.find('.btn-ok').on('click', this.close.bind(this))
}

get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{class:'fwindow-listing-type infos-film', x:10, y:10}))}
}
