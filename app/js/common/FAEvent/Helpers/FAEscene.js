'use strict'
/**
  Méthodes d'helper pour la sous-classe FAEscene

**/
Object.assign(FAEscene.prototype,{

/**
  Version courte propre au scène
  Pour les scènes, le résumé (content) et le pitch (titre) peuvent
  commencer par le même texte. Dans ce cas-là, on ne prend que le
  résumé.
**/
asShort(opts){
  // console.log("-> FAEscene#asShort")
  let str = ''
  if (this.resume.match(new RegExp(`^${RegExp.escape(this.pitch)}`))){
    return this.resume
  } else {
    return `sc. ${this.numero}. ${this.pitch} — ${this.resume}`
  }
}

,
/**
  Sortie complète de l'event, par exemple pour le reader
**/
asFull(opts){
  if(undefined === opts) opts = {}
  let str = ''
  opts.noTime = true
  str += this.asBook(opts)
  str += this.divNote(opts)
  str += this.divAssociates(opts)
  return str
}

,
asBook(opts){
  return  this.f_scene_heading(opts).outerHTML
          + this.f_pitch.outerHTML
}

,
f_scene_heading(opts){
  // console.log("-> FAEscene#f_scene_heading")
  if(undefined === opts) opts = {}
  var headingElements = []
  if(this.numero){
    headingElements.push(DCreate('SPAN', {class:'scene-numero', inner: `${this.numero}. `}))
  } else {
    headingElements.push(DCreate('SPAN', {class: 'scene-numero', inner: 'GÉNÉRIQUE'}))
  }
  if(this.lieu){
    headingElements.push(DCreate('SPAN', {class:'scene-lieu', inner: `${this.lieu.toUpperCase()}. `}))
  }
  if(this.effet){
    headingElements.push(DCreate('SPAN', {class:'scene-effet', inner: this.effet.toUpperCase()}))
  }
  if(this.decor){
    headingElements.push(DCreate('SPAN', {inner:' – '}))
    headingElements.push(DCreate('SPAN', {class:'scene-decor', inner: this.decor.toUpperCase()}))
  }
  if(this.sous_decor){
    headingElements.push(DCreate('SPAN', {inner: ' : '}))
    headingElements.push(DCreate('SPAN', {class:'scene-sous-decor', inner: this.sous_decor.toUpperCase()}))
  }
  if(!opts.noTime){
    headingElements.push(DCreate('SPAN', {class:'scene-time', inner: ` (${new OTime(this.time).horloge_simple})`}))
  }
  // On peut assembler l'entête
  return DCreate('DIV', {class: 'scene-heading', append: headingElements})
}

// ,
// /**
//  * Div construit pour la scène
//  */
// formateContenu(){
//   console.log("-> FAEscene#formateContenu")
//   var h
//   if(this.isGenerique){ h = "GÉNÉRIQUE" }
//   else {
//     var decor  = this.decor ? ` — ${FATexte.deDim(this.decor)}` : ''
//     var sdecor = this.sous_decor ? ` : ${FATexte.deDim(this.sous_decor)}` : ''
//     h = `${this.numeroFormated}. ${(this.lieu || 'INT').toUpperCase()}. ${(this.effet || 'jour').toUpperCase()}${decor}${sdecor}`
//   }
//   this._formated = `<div class="scene-heading">${h}</div><span class="scene-resume">${FATexte.deDim(this.content)}</span>`
//   return this._formated
// }

,
/**
 * Retourne le lien vers l'event
 * Pour remplacer par exemple une balise `event: <id>`
 *
 * Note : si ce texte est modifié, il faut aussi corriger les tests à :
 * ./app/js/TestsFIT/tests/Textes/fatexte_tests.js
 */
asLink(alt_text){
  if(undefined === this._asLink){
    this._asLink = `<a class="lkscene" onclick="showScene(${this.numero})">__TIT__</a>`
  }
  return this._asLink.replace(/__TIT__/, (alt_text || `scène ${this.numero} : « ${this.pitch} »`).trim())
}
})

Object.defineProperties(FAEscene.prototype,{
  f_pitch:{
    get(){
      if(undefined === this._f_pitch){
        this._f_pitch = DCreate('DIV', {class:'scene-pitch', inner: this.pitch})
      }
      return this._f_pitch
    }
  }
  , numeroFormated:{
    get(){
      if(undefined===this._numeroFormated){
        this._numeroFormated = `<span class="numero-scene" data-id="${this.id}">${this.numero}</span>`
      }
      return this._numeroFormated
    }
  }
})
