'use strict'
/**
* Extension de FAWriter pour gérer l'entrée dans le champ textarea du texte
**/

const KeyUpAndDown = {
  class: 'KeyUpAndDown'
, type: 'Object'

, init(){
    this.inTextField.stopTab        = this.inTextField.stopTab.bind(this)
    this.inTextField.replaceTab     = this.inTextField.replaceTab.bind(this)
    this.inTextField.replaceSnippet = this.inTextField.replaceSnippet.bind(this)
    this.inTextField.moveParagraph  = this.doMoveParagraph.bind(this)
    this.inTextField.toggleComments = this.doToggleComments.bind(this)
    this.inTextField.insertCrochet  = this.doInsertCrochet.bind(this)
    this.inTextField.insertChevrons = this.doInsertChevrons.bind(this)
  }
, inTextField:{
  // Méthode appelé quand on joue la touche TAB
    stopTab(e, sel){
      return stopEvent(e)
    }
    // Remplace la touche tabulation, dans le selector +sel+,
    // par le texte +remp+
  , replaceTab(e, sel, remp){
      sel.insert(remp)
      return stopEvent(e)
    }
  , replaceSnippet(e, sel){
      var snip = sel.beforeUpTo(' ', false, {endRC: true})
      snip === null || Snippets.checkAndReplace(sel, snip)
      // return stopEvent(e)
    }
    // Méthode appelée pour déplacer un paragraphe dans le texte
  , moveParagraph(e, sel, toUp){
      return this.doMoveParagraph(e, sel, toUp)
    }
  , toggleComments(e, sel, args){
      return this.doToggleComments(e, sel, args)
  }
  , insertCrochet(e, sel){
      return this.doInsertCrochet(e, sel)
  }
  , insertChevrons(e, sel){
      return this.doInsertChevrons(e, sel)
  }
}

/**
  Les touche Up et Down quand on se trouve en dehors d'un champ de
  texte.
  TODO Attention, pour le moment, ça n'est pas implémenté.
**/
, outTextField:{

  }
}

KeyUpAndDown.doInsertCrochet = function(e, sel){
  sel.insert('}')
  sel.set(sel.startOffset-1, sel.startOffset-1)
  return true
}
KeyUpAndDown.doInsertChevrons = function(e, sel){
  sel.set(sel.startOffset-1, null)
  sel.insert('«  »')
  sel.set(sel.startOffset-2, sel.startOffset-2)
}
KeyUpAndDown.doToggleComments = function(e, sel, args){
  var {before: debCom, after: endCom} = args
  console.log("debCom, endCom:", debCom, endCom)
  if(sel.line.substring(0,debCom.length) == debCom){
    // <= La ligne commence par '# '
    // => Il faut décommenter
    sel.startOffset = sel.startLineOffset
    sel.endOffset = sel.startLineOffset + debCom.length
    sel.insert('')
    if(endCom){
      sel.startOffset = sel.endLineOffset - endCom.length
      sel.endOffset   = sel.endLineOffset
      sel.insert('')
    }
  } else {
    // <= La ligne ne commence pas par '# '
    // => Il faut la commenter (l'ex-commenter)
    sel.goToLineStart()
    sel.insert(debCom)
    if(endCom){
      sel.goToLineEnd()
      sel.insert(endCom)
    }
  }
}
KeyUpAndDown.doMoveParagraph = function(e, sel, toUp){
  var sOffset, decFromStart, parag
  // Prendre le paragraphe courant
  var befText = sel.beforeUpTo(RC, false)
  if(befText === null){
    // <= Pas de RC avant
    // => On est en haut
    if(toUp) return
    decFromStart = 0
  } else {
    decFromStart = befText.length
  }
  // On se déplace au début du paragraphe
  sel.set(sel.startOffset - befText.length, null)
  // On cherche la fin du paragraphe (en la prenant)
  var aftText = sel.afterUpTo(RC, true)
  if(aftText === null){
    // <= Pas de RC après
    // => On est tout en bas du document. Il faut s'arrêter là si
    //    c'est la descente qui est demandée
    if(!toUp) return
  }
  // On place la fin de la sélection à cet endroit
  sel.set(null, sel.endOffset + aftText.length)
  // On mémorise le paragraphe (car on va l'enlever et le remettre
  // plus haut ou plus bas)
  parag = sel.contents
  // console.log(`Le paragraphe à coller: "${parag}"`)
  // On efface le paragraphe
  sel.remplace('')
  if(toUp){
    // On doit remonter d'un signe pour se placer dans le paragraphe
    // précédent
    sOffset = sel.startOffset - 1
    sel.set(sOffset, sOffset)
    // On cherche le début du paragraphe précédent
    befText = sel.beforeUpTo(RC, false)
    if(befText === null){
      // <= Pas de retour chariot avant
      // => C'est le premier paragraphe
      sOffset = 0
    } else if (befText.length) {
      // <= Le texte précédent à une longueur
      // => Ce n'est pas un paragraphe vide
      sOffset = sel.startOffset - befText.length
    } else {
      sOffset = null // pas de déplacement à faire
    }
    if(sOffset !== null) sel.set(sOffset, sOffset)
  } else {
    // On doit descendre le paragraphe
    aftText = sel.afterUpTo(RC, false)
    if (aftText === null){
      // <= pas de retour chariot après
      // => On est arrivé en bas
      sOffset = sel.fieldValue.length - 1
      // Il faut ajouter un retour de chariot au paragraph
      parag = `${RC}${parag.substring(0, parag.length -1)}`
    } else if (aftText.length) {
      // Si on trouve encore des retours chariot après
      sOffset = sel.startOffset + aftText.length + 1
    } else {
      sOffset = sel.startOffset + 1
    }
    // On se déplace à l'endroit où le paragraphe doit êre recollé
    if ( sOffset !== null ) sel.set(sOffset, sOffset)
  }
  // Et on colle ici le paragraphe
  sel.remplace(parag)
  // On remonte au début du paragraph
  sOffset = sel.startOffset - parag.length
  sel.set(sOffset, sOffset)
  if(decFromStart){
    // On se replace où on était dans le paragraphe
    sOffset = sel.startOffset + decFromStart
    sel.set(sOffset, sOffset)
  }

  // console.log(`Monter ou descendre le paragraphe "${parag}"`)
  return stopEvent(e)

}
KeyUpAndDown.init()
