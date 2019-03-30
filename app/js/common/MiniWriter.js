'use strict'
/**

  Le miniwriter (class MiniWriter) est un système permettant d'éditer les
  textes avec plus de confort, en offrant notamment une dimension plus grande
  à l'espace de travail et en concentrant l'attention sur le texte.

  Features
  --------
  - Le MiniWriter doit pouvoir s'utiliser pour tous les types de texte, sauf
    peut-être les documents, qui ont leur propre writer
  - On doit pouvoir utiliser tous les snippets avec le mini-writer
  - On doit pouvoir visualiser le rendu de tout texte écrit.
  - On doit pouvoir passer simplement dans miniwriter depuis n'importe quel
    champ d'édition, donc n'importe quel textarea, notamment à partir de
    l'éditeur d'event (EventForm).

**/

class MiniWriter {

/**
* Méthode de classe de création du mini-writer qui permet de le créer à
* l'aide de `MiniWriter.new(<field>)`
**/
static new(field /* DOMElement non jQuery */){
  return new MiniWriter(current_analyse, field, this.newId())
}
static newId(){
  if(undefined === this.lastId) this.lastId = 0
  return ++this.lastId
}

constructor(analyse, field, mini_writer_id){
  this.id = mini_writer_id
  this.analyse = this.a = analyse
  // Le champ d'origine, dans lequel on retournera le nouveau texte.
  this.field   = field
  // État
  this.opened = false
}
toggle(){
  this.fwindow.toggle()
}
show(){
  this.fwindow.show()
}
hide(){
  this.fwindow.hide()
}

/**
  Méthode de construction du mini-writer
 */
build(){
  return [
      DCreate('DIV', {class: 'mini-writer-tools', inner: '[Mettre ici les outils]'})
    , DCreate('TEXTAREA', {id: `mini-writer-${this.id}-content`})
    , DCreate('DIV', {class: 'mini-writer-buttons', inner: '[Mettre ici les boutons]'})
    ]
}
observe(){
  // On observe les boutons
}
get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this, {id:`mini-writer-${this.id}`}))}
}
