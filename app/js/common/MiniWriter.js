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
  var mw = new MiniWriter(current_analyse, field, this.newId())
  mw.show()
  return mw
}
static newId(){
  if(undefined === this.lastId) this.lastId = 0
  return ++this.lastId
}

constructor(analyse, field, mini_writer_id){
  this.id = mini_writer_id
  this.analyse = this.a = analyse
  // Le champ d'origine, dans lequel on retournera le nouveau texte.
  this.owner   = field
  // État
  this.opened = false
  // État du visualiseur
  this.visualizorOpened = false
  // Le fond est-il masqué
  this.fondMasked = true
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
  On met le texte du propriétaire dans le champ de texte du MiniWriter
**/
setup(){
  this.textField.value = this.owner.value
}
/**
  On synchronize les contenus, c'est-à-dire qu'on met dans le
  champ propriétaire le nouveau texte.
**/
synchronize(){
  this.owner.value = this.textField.value
  this.owner.trigger('change')
}

// ---------------------------------------------------------------------
//  MÉTHODES POUR LE VISUALISEUR

/**
  Méthode appelée toutes les x secondes pour actualiser l'affichage
  dans le visualizor.
**/
updateVisualizor(){
  console.log("-> updateVisualizor dans ", this.oVisualizorContent, this.contents)
  this.oVisualizorContent.html(this.fatexte.formate(this.contents))
}
/**
* Pour mettre en route ou stopper la visualisation
**/
toggleVisualizor(){
  if(this.visualizorOpened){
    clearInterval(this.timerVisualizor)
    delete this.timerVisualizor
    this.oVisualizor.hide()
    this.visualizorOpened = false
  } else {
    this.oVisualizor.show()
    this.visualizorOpened = true
    // On met en route une boucle qui va actualiser régulièrement
    // le texte
    this.timerVisualizor = setInterval(this.updateVisualizor.bind(this), 3000)
    this.updateVisualizor() // un tout de suite
  }
}
toggleMaskFond(){
  this.fwindow.jqObj.css('background', this.fondMasked?'transparent':'rgba(0,0,0,0.74)')
  this.fondMasked = !this.fondMasked
}
/**
  Méthode de construction du mini-writer
 */
build(){
  return [
      DCreate('DIV', {class:'mini-writer-editor', append: [
          DCreate('DIV', {class: 'mini-writer-tools', inner: '[Mettre ici les outils]'})
        , DCreate('DIV', {class:'mini-writer-div-textarea', append : [
            DCreate('TEXTAREA', {id: `mini-writer-${this.id}-content`, class:'mini-writer-content'})
          ]})
        , DCreate('DIV', {class: 'mini-writer-buttons', append: [
            DCreate('INPUT', {type:'checkbox', id: this.idFor('cb-visualizor')})
          , DCreate('LABEL', {inner: 'Visualiser', attrs: {for: this.idFor('cb-visualizor')}})
          , DCreate('INPUT', {type:'checkbox', id: this.idFor('cb-mask-fond'), attrs:{checked:'CHECKED'}})
          , DCreate('LABEL', {inner: 'Fond masqué', attrs: {for: this.idFor('cb-mask-fond')}})
          ]})
      ]})
    , DCreate('DIV', {class:'mini-writer-visualizor', style: 'display:none;', append: [
        DCreate('DIV', {class:'mini-writer-visualizor-content'})
    ]})
    ]
}
observe(){
  // On observe les boutons
  this.oButtons.find(`#${this.idFor('cb-visualizor')}`).on('click', this.toggleVisualizor.bind(this))
  this.oButtons.find(`#${this.idFor('cb-mask-fond')}`).on('click', this.toggleMaskFond.bind(this))
}
idFor(foo){return `mw${this.id}-${foo}`}

// Le contenu du textarea
get contents(){return this.textField.val()}

get textField(){return $(`#${this.domId} .mini-writer-content`)}
get oButtons(){return this._obuttons||defP(this,'_obuttons', $(`#${this.domId} .mini-writer-buttons`))}
get oVisualizor(){return this._ovisualizor||defP(this,'_ovisualizor', $(`#${this.domId} .mini-writer-visualizor`))}
get oVisualizorContent(){return this._ovisualizorContent||defP(this,'_ovisualizorContent', $(`#${this.domId} .mini-writer-visualizor-content`))}
get domId(){return this._domId||defP(this,'_domId',`mini-writer-${this.id}`)}
get fatexte(){return this._fatexte||defP(this,'_fatexte', new FATexte(''))}
get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this, {class:'mini-writer', id:this.domId, y:-20, x:-20}))}
}
