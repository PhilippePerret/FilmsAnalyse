'use strict'
/**
 * Utilitaire pour manipuler la sélection dans un textarea/input[text]
 *
 *  var sel = new Selector(myTextareaField)
 *
 *  sel.contents        => le contenu de la sélection
 *  sel.length          => longueur de la sélection
 *  sel.before()        => Le caractère/signe juste avant la sélection
 *  sel.before(4)       => Les 4 caractères avant la sélection
 *  sel.beforeUpTo(sig) => les caractères avant, jusqu'au signe fourni
 *  sel.after()         => Le caractère/signe juste après la sélection
 *  sel.after(4)        => les 4 caractères/signes après la sélection
 *  sel.afterUpTo(sig)  => Les caractères après, jusqu'au signe fourni
 *  sel.remplace(txt)   => Remplace la sélection par `txt`
 *  sel.insert(txt)     => alias de remplace
 *
 *  sel.startOffset     => le début de la sélection
 *  sel.endOffset       => la fin de la sélection
 */

class Selector {
  constructor(domObj){
    if(domObj instanceof HTMLTextAreaElement){
      [this.domObj, this.jqObj]  = [domObj, $(domObj)]
    } else {
      [this.domObj, this.jqObj] = [jqObj[0], jqObj]
    }
  }
  /**
   * Retourne le contenu complet du champ
   */
  get fieldValue(){return this._fieldValue||defP(this,'_fieldValue',this.jqObj.val())}
  /**
   * Retourne le contenu de la sélection
   */
  get contents(){
    return this.fieldValue.substring(this.startOffset, this.endOffset)
  }
  /**
   * Insert à la place de la sélection
   */
  insert(v){
    this.jqObj.insertAtCaret(v)
  }
  remplace(v){return this.insert(v)} // alias
  /**
   * Retourne le décalage de départ de la sélection
   */
  get startOffset(){return this.domObj.selectionStart}
  /**
   * Retourne le décalage de fin de la sélection
   */
  get endOffset(){return this.domObj.selectionEnd}
  /**
   * Retourne la longueur de la sélection
   */
  get length(){return this.contents.length}
  /**
   * Retourne les +len+ signes avant la sélection
   */
  before(len){
    if (undefined === len) len = 1
    return this.fieldValue.substring(this.startOffset - len, this.startOffset)
  }
  /**
   * Retourne les +len+ signes après la sélection
   */
  after(len){
    if (undefined === len) len = 1
    return this.fieldValue.substring(this.endOffset, this.endOffset + len)
  }
}
