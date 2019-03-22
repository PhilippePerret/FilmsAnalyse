'use strict'
/**
* Extension de Writer pour gérer l'entrée dans le champ textarea du texte
**/

Writer.onKeyDown = function(e){
  // console.log("[DOWN] which, KeyCode, charCode, metaKey, altKey ctrlKey", e.which, e.keyCode, e.charCode, e.metaKey, e.altKey, e.ctrlKey)
  let sel = this.selector, ret = true // retour par défaut
  if(e.keyCode === KTAB){
    return stopEvent(e)
  } else if (e.metaKey){
    // console.log("-> metaKey")
    if (e.ctrlKey) {
      console.log("-> Meta + CTRL")
      if ( e.which === ARROW_UP || e.which === ARROW_DOWN){
        var sOffset, decFromStart, parag
        // Prendre le paragraphe courant
        var befText = sel.beforeUpTo(RC, false)
        if(befText === null){
          // <= Pas de RC avant
          // => On est en haut
          if(e.which === ARROW_UP) return
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
          if(e.which === ARROW_DOWN) return
        }
        // On place la fin de la sélection à cet endroit
        sel.set(null, sel.endOffset + aftText.length)
        // On mémorise le paragraphe (car on va l'enlever et le remettre
        // plus haut ou plus bas)
        parag = sel.contents
        // console.log(`Le paragraphe à coller: "${parag}"`)
        // On efface le paragraphe
        sel.remplace('')
        if(e.which === ARROW_UP){
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
        ret = stopEvent(e)
      }
    } else if (e.altKey ){
      // META + ALT
    } else if (e.shiftKey) {
      // META + SHIFT
    } else {
      // META SEUL
      if (e.which === K_S ){
        console.log("Enregistrement du document demandé.")
        this.currentDoc.getContents()
        if (this.currentDoc.isModified()){
          console.log("Document modifié => enregistrement")
          this.currentDoc.save()
        } else {
          console.log("Document non modifié, pas d'enregistrement.")
        }
        ret = stopEvent(e)
      }
    }
  }
  sel = null
  return ret
}

Writer.onKeyUp = function(e){
  // console.log("[UP] which, KeyCode, charCode, metaKey, altKey ctrlKey", e.which, e.keyCode, e.charCode, e.metaKey, e.altKey, e.ctrlKey)
  var sel = this.selector
  if(e.altKey){
    if(e.which === K_OCROCHET){ // note : avec altKey
      sel.insert('}')
      sel.set(sel.startOffset-1, sel.startOffset-1)
    }
  } else if (e.which === K_GUIL_DROIT) { // " => «  »
    sel.set(sel.startOffset-1, null)
    sel.insert('«  »')
    sel.set(sel.startOffset-2, sel.startOffset-2)
  } else if(e.keyCode === KTAB){
    if(sel.before() == RC){
      // => suivant le type
      // console.log("Un retour chariot juste avant")
      if(this.currentDoc.dataType.type == 'data'){
        sel.insert('  ')
      } else {
        sel.insert('* ')
      }
    } else {
      // => Check snippet
      // On prend les lettres juste avant la sélection pour voir
      // si c'est un snippet.
      var snip = sel.beforeUpTo(' ', false, {endRC: true})
      if (snip !== null){
        var remp = Snippets.check(snip)
        if( remp ){
          sel.set(sel.startOffset - snip.length, null)
          sel.insert(remp)
        }
      }
    }
    stopEvent(e)
  }
  sel = null
}
