'use strict'
/**
  Méthodes d'helper de classe pour FAProcede
**/

Object.assign(FAProcede,{


/**
  Construit le premier menu avec les grandes catégories de procédés
  Rappel : il y a trois niveaux, chacun avec une graphie différente :

    CATEGORIE > Sous-catégorie > procédé

  @return {String} Le menu select. Mais possibilité aussi, pourquoi pas, de
  retourner l'élément DOM, ce sera peut-être plus simple.
**/
menuCategories(){
  if(undefined === this._menuCategories){
    // On construit le menu
    var options = [DCreate('OPTION',{value:'', inner:"Choisir la catégorie…"})]
    for(var cate_id in this.data){
      options.push(DCreate('OPTION', {value: cate_id, inner: this.data[cate_id].hname}))
    }
    this._menuCategories = DCreate('SELECT', {class: 'menu-categories-procedes', append:options})
    this._menuCategories = this._menuCategories.outerHTML
  }
  return this._menuCategories
}
,

/**
  Construit et retourne le sous-menu des sous-catégorie de la catégorie de
  procédés +cate_id+

  @return {String}  Le menu désiré, mais pourrait aussi retourner l'élément
                    DOM.
**/
menuSousCategories(cate_id){
  if(undefined === this._menusSousCategories) this._menusSousCategories = {}
  if(undefined === this._menusSousCategories[cate_id]){
    // Il faut construire ce sous-menu là
    var options = [DCreate('OPTION',{value:'', inner:"Choisir la sous-catégorie…"})]
    options.push(DCreate('OPTION',{value:'..', inner:"<–"}))
    let cate_items = this.data[cate_id].items
    for(var scat_id in cate_items){
      options.push(DCreate('OPTION',{value: scat_id, inner: cate_items[scat_id].hname}))
    }
    this._menusSousCategories[cate_id] = DCreate('SELECT', {append: options, class: 'menu-sous-categories-procedes', attrs: {'data-cate-id': cate_id}})
    this._menusSousCategories[cate_id] = this._menusSousCategories[cate_id].outerHTML
  }
  return this._menusSousCategories[cate_id]
}
,
menuProcedes(cate_id, scate_id){
  if(undefined === this._menusProcedesSCat) this._menusProcedesSCat = {}
  if(undefined === this._menusProcedesSCat[scate_id]){
    var options = [DCreate('OPTION',{value:"", inner:"Choisir le procédé…"})]
    options.push(DCreate('OPTION',{value:"..", inner:'<–'}))
    let scat_items = this.data[cate_id].items[scate_id].items
    for (var proc_id in scat_items){
      options.push(DCreate('OPTION',{value:proc_id, inner:scat_items[proc_id].hname}))
    }
    this._menusProcedesSCat[scate_id] = DCreate('SELECT',{append:options, class:'menu-procedes', attrs:{'data-cate-id':cate_id, 'data-scate-id': scate_id}})
    this._menusProcedesSCat[scate_id] = this._menusProcedesSCat[scate_id].outerHTML
  }
  return this._menusProcedesSCat[scate_id]
}

})
