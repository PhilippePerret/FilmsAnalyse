'use strict'
/**
  * Classe BtnPlay
  * --------------
  * Gestion des boutons play/stop des events.
  *
  * @usage
  *
  * Mettre simplement dans le DOM un button de classe <button class="btnplay-<id>"></button>
  *
  */
class BtnPlay {
  constructor(jqBtn, ev_id){
    this.event    = current_analyse.ids[ev_id]
    this.jqBtn    = jqBtn
    this.playing  = false
  }

  /**
   * Méthode qui prépare complètement le bouton (à l'instanciation)
   */
  set(){
    this.domBtn.innerHTML = this.imgPlay
    this.jqBtn.addClass(this.class)
  }

  togglePlay(ev){
    ev.stopPropagation()
    ev.preventDefault()
    if(this.playing === false){
      current_analyse.locator.setRTime(this.event.time)
      this.playing = (current_analyse.locator.playing === true) || current_analyse.locator.playAfterSettingTime
    } else {
      current_analyse.locator.togglePlay()
      this.playing = false
    }
    $(`.${this.class} img`).attr('src', this.playing ? this.srcStop : this.srcPlay)
  }

  // ---------------------------------------------------------------------
  //  Méthodes DOM
  imgCode(bid){
    return `<img class="btn-stop-play-event" src="./img/btns-controller/btn-play.png" style="width:${this.size}px;" />`
  }

  get srcPlay(){return this._srcPlay||defineP(this,'_srcPlay','./img/btns-controller/btn-play.png')}
  get srcStop(){return this._srcStop||defineP(this,'_srcStop','./img/btns-controller/btn-stop.png')}

  // ---------------------------------------------------------------------
  //  Data
  get id(){return this._id||defineP(this,'_id',this.event.id)}

  // ---------------------------------------------------------------------
  //  Data DOM

  get domBtn(){return this._domBtn || defineP(this,'_domBtn',this.jqBtn[0])}
  get class(){return this._class  || defineP(this,'_class',`btnplay-${this.id}`)}
  get size(){return this._size ||defineP(this,'_size',parseInt(this.jqBtn.attr('size'),10))}

  get imgStop(){return this._imgStop    || defineP(this,'_imgStop',this.imgCode('stop'))}
  get imgPlay(){return this._imgPlay    || defineP(this,'_imgPlay',this.imgCode('play'))}

}
