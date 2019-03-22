'use strict'
/**
 * Class FATexte
 * -------------
 * Pour la gestion des textes
 *
 *  @usage
 *
 *    let itexte = new FATexte(str)
 *
 *    itexte.formate() => retourne le texte entièrement corrigé
 */

class FATexte {
  /** ---------------------------------------------------------------------
  *     CLASSE
  */

  static forEachDim(method){
    if(this.table_dims === null) return
    for(var dim in this.table_dims){
      var d = this.table_dims[dim]
      method(dim, d.regexp, d.value)
    }
  }

  static deDim(str){
    if(this.dimsData == null) return str // pas de diminutifs
    this.forEachDim(function(dim, regDim, value){
      str = str.replace(regDim, value)
    })
    return str
  }

  static get VAR_REGEXP(){return new RegExp('\{\{(?<key>[a-zA-Z0-9–\-]+)\}\}','g')}
  static deVar(str){
    var my = this
    if(my.table_vars === null) return str // pas de variables définies
    str = str.replace(my.VAR_REGEXP, function(){
      var groups = arguments[arguments.length-1]
      var key = groups.key
      return my.table_vars[key]
    })
    return str
  }
  /**
   * Grande table contenant tous les diminutifs et leur expression régulière
   * préparé. Chaque élément se trouve sous la forme :
   *  {dim: <le diminutif>, regexp: <l'expression régulière>, value: <valeur à donner>}
   */
  static get table_dims(){return this._table_dims||defP(this,'_table_dims',this.defineTableDims())}
  /**
  * Grande table contenant les variables et leur expression régulière
  * Cf. table_dims ci-dessus
  **/
  static get table_vars(){return this._table_vars||defP(this,'_table_vars',this.defineTableVars())}

  // Prépare la table des diminutifs du film
  static defineTableDims(){
    if (this.dimsData === null) return null
    var tbl = {}, reg
    for(var dim in this.dimsData){
      reg = new RegExp(`@${dim}([^a-zA-Z0-9_])`, 'g')
      tbl[dim] = {dim: dim, value: `${this.dimsData[dim]}$1`, regexp: reg}
    }
    return tbl
  }

  static defineTableVars(){
    if(false == fs.existsSync(this.varsPath)) return null
    return YAML.safeLoad(fs.readFileSync(this.varsPath,'utf8'))
  }

  static get dimsData(){
    if(undefined === this._dimsData){
      if(fs.existsSync(this.dimsPath)){
        this._dimsData = YAML.safeLoad(fs.readFileSync(this.dimsPath,'utf8'))
      } else {
        this._dimsData = null
      }
    }
    return this._dimsData
  }
  static get dimsPath(){
    return this._dimsPath||defP(this,'_dimsPath',path.join(current_analyse.folderFiles,'diminutifs.yaml'))
  }

  static get varsPath(){
    return this._varsPath||defP(this,'_varsPath',path.join(current_analyse.folderFiles,'infos.yaml'))
  }

  /** ---------------------------------------------------------------------
   *    INSTANCE
   */
  constructor(str) {
    this.raw_string = str
  }

  /**
   * Méthode principale de formatage du texte. Elle comprend :
   *  - la transformation des diminutifs
   *  - la transformation des balises events en lien vers les events
   *  - la transformation des liens hypertextuels raccourcis en liens
   *    hypertextuels complets
   */
  formate(str, options){
    if(undefined === str) str = this.raw_string
    else this.raw_string = str
    str = this.deEventTags(str)
    str = this.deSceneTags(str)
    str = this.deVar(str)
    str = this.deDim(str)
    return str
  }

  get formated(){return this.formate()}

  /**
   * Transforme toutes les balises vers des events en texte correct
   *
   * Les balises vers des events sont composées de : `{{event:<id event>}}`
   */
  static get REGEXP_EVENT_TAG(){
    if(undefined==this._regexp_event_tag){
      this._regexp_event_tag = new RegExp(this.defineRegExpTag('event'), 'gi')
    }
    return this._regexp_event_tag
  }
  static get REGEXP_SCENE_TAG(){
    if(undefined==this._regexp_scene_tag){
      this._regexp_scene_tag = new RegExp(this.defineRegExpTag('scene'), 'gi')
    }
    return this._regexp_scene_tag
  }
  static defineRegExpTag(tag_type){
    return `\\{\\{${tag_type}: ?(?<event_id>[0-9]+) ?(\\|(?<alt_text>[^\\}]+))?\\}\\}`
  }

  deEventTags(str){
    if(undefined === str) str = this.raw_string
    else this.raw_string = str
    str = str.replace(FATexte.REGEXP_EVENT_TAG, function(){
      var groups = arguments[arguments.length - 1]
      return current_analyse.ids[groups.event_id].asLink(groups.alt_text)
    })
    // console.log(founds)
    return str
  }
  deSceneTags(str){
    if(undefined === str) str = this.raw_string
    else this.raw_string = str
    str = str.replace(FATexte.REGEXP_SCENE_TAG, function(){
      var groups = arguments[arguments.length - 1]
      return current_analyse.ids[groups.event_id].asLinkScene(groups.alt_text)
    })
    // console.log(founds)
    return str
  }
  /**
   * Méthode qui va permettre de boucler sur les diminutifs
   *
   * Mais elle fait plus que ça, en travaillant avec un tableau d'expressions
   * régulières déjà préparée, gardées par la classe.
   */
  forEachDim(method){return FATexte.forEachDim(method)}

  /**
   * Remplace les diminutifs dans le texte +str+ par leur valeur réelle
   * Si +str+ n'est pas fourni, on prend le texte brut de l'instance.
   */
  deDim(str){
    if (undefined === str) str = this.raw_string
    else this.raw_string = str
    return FATexte.deDim(str)
  }
  /**
  * Remplacement des balises dite double-crochets simples : {{variable}}
  **/
  deVar(str){
    if(undefined === str) str = this.raw_string
    else this.raw_string = str
    return FATexte.deVar(str)
  }

}
