'use strict'
/**
  Méthodes d'helper pour la sous-classe FAEscene

**/
Object.assign(FAEscene.prototype,{

/**
  La version la plus courte de la scène, pour la marque de scène
  au-dessus de la vidéo, pour le moment, et pour les liens
**/
asPitch(opts){
  if(undefined === this._aspitch){
    this._aspitch = DFormater(`${this.numero}. ${this.pitch}`)
  }
  return this._aspitch
}
,
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
/**
  Pour le livre
  TODO Peut-être qu'il faudrait une appellation qui indique qu'il
  s'agit du scénier (`inScenier`)
**/
asBook(opts){
  var str =  this.f_scene_heading(opts).outerHTML
    , scene_content = ''
  str += '<div class="scene-content">'
  if(this.pitch){
    let re = new RegExp(`^${RegExp.escape(this.pitch)}`)
    if (!(this.content||'--non défini--').match(re)) scene_content += `${this.f_pitch.outerHTML} — `
  }
  scene_content += this.content || '--non défini--'
  // Note : on corrige le contenu ici pour que les notes, s'il y en a, soit
  // contenues dans le div 'scene-content'
  str += DFormater(scene_content)
  str += '</div>' // fin scene-content
  return str
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
    headingElements.push(DCreate('SPAN', {class:'scene-decor', inner: DFormater(this.decor).toUpperCase()}))
  }
  if(this.sous_decor){
    headingElements.push(DCreate('SPAN', {inner: ' : '}))
    headingElements.push(DCreate('SPAN', {class:'scene-sous-decor', inner: DFormater(this.sous_decor).toUpperCase()}))
  }
  if(!opts.noTime){
    headingElements.push(DCreate('SPAN', {class:'scene-time', inner: ` (${new OTime(this.time).horloge_simple})`}))
  }
  // On peut assembler l'entête
  return DCreate('DIV', {class: 'scene-heading', append: headingElements})
}
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
    this._asLink = `<a class="lkscene" onclick="showScene(${this.numero})">[voir]</a>`
  }
  return `${alt_text || this.asPitch()} ${this._asLink}`
}
})

Object.defineProperties(FAEscene.prototype,{
  f_pitch:{
    get(){
      if(undefined === this._f_pitch){
        this._f_pitch = DCreate('span', {class:'scene-pitch', inner: this.pitch})
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
