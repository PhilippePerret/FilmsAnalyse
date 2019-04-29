'use strict'
/**
 * Class OTime
 * -----------
 * Permet de gérer les temps
 */

class OTime {
  /**
   * Le temps est donné soit :
   *  - en nombre de secondes (Number) (ou string, attention)
   *  - en horloge (String)
   *  - en data (Object) avec :seconds, :duree
   *
   */
  constructor(v){
    switch (typeof(v)) {
      case 'number':
        this.seconds = v
        break
      case 'string':
        if (v.match(/^[0-9\.]+$/)){this.seconds = Math.round(v)}
        else {
          this.horloge = v
          this.seconds = this.h2s(v)
        }
        break
      case 'object':
        console.log("Le traitement par objet n'est pas encore implémenté")
    }
  }

  set horloge(v)  { this._horloge = v }
  get horloge()   {return this._horloge || defP(this,'_horloge', this.s2h())}
  get horloge_simple(){
    if(undefined === this._horloge_simple){
      this._horloge_simple = this.s2h(this.secondsInt, {no_frames: true})
    }
    return this._horloge_simple
  }
  get horloge_as_duree(){return this.hduree}
  get hduree(){return this.s2h(this.seconds,{as_duree: true, no_frames: true})}
  get duree_sec(){ return Math.round(this.seconds) }


/**
  Méthode qui permet de traiter les temps comme des events dans
  les associations.

  @param {Object} options  Des options (inutilisé ici pour le moment)

*/
asAssociate(options){
  return [DCreate('A', {class:'lktime', inner: this.horloge_simple, attrs:{onclick:`showTime(${this.seconds})`}})]
}

set duree(v) { this.duree = v }
get duree()  { return this.duree || 1 }

get secondsInt() {
  return Math.round(this.seconds)
}
h2s(h){
  var d = h.split('.') // Séparer l'horloge de ses frames
  var frms = d.splice(1,1)[0] || 0
  h = d[0].split(/[,\:]/).reverse()
  var tps = 0
  tps =  frms * 40
  tps += parseInt(h[0]||0,10) * 1000
  tps += parseInt(h[1]||0,10) * 1000 * 60
  tps += parseInt(h[2]||0,10) * 1000 * 3600
  return tps / 1000
}
s2h(s, format){
  if(undefined===format) format = {}
  var r, hrs, mns, scs, frm ;
  if(undefined==s){s = this.seconds}
  hrs = Math.floor(s / 3600)
  r = s - (hrs * 3600)
  mns = Math.floor(r / 60)
  if(!(format.as_duree && hrs == 0)){
    mns = mns > 9 ? mns : `0${mns}`
  }
  r = r - (mns * 60)
  scs = Math.floor(r)
  scs = scs > 9 ? scs : `0${scs}`
  frm = parseInt((r - scs) * 1000 / 40,10)
  frm = frm > 9 ? frm : `0${frm}`

  var hstr
  if(format.no_frames){
    hstr = `${mns}:${scs}`
  } else {
    hstr = `${mns}:${scs}.${frm}`
  }
  if(!format.as_duree){
    hstr = `${hrs}:${hstr}`
  }
  return hstr
}

/**
 * Permet d'actualiser le nombre de seconds de l'instance
 * Cette méthode est utile par exemple pour régler l'horloge de la vidéo,
 * pour ne pas créer intensivement des instances à chaque millisecondes
 */
updateSeconds(s){
  this.seconds = s
  this.horloge = this.s2h(s)
}
}
