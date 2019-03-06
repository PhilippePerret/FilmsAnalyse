'use strict'
/**
 * Class OTime
 * -----------
 * Permet de gérer les temps
 */

class OTime {
  /**
   * Le temps est donné soit :
   *  - en nombre de secondes (Number)
   *  - en horloge (String)
   *  - en data (Object) avec :seconds, :duration
   *
   */
  constructor(v){
    switch (typeof(v)) {
      case 'number':
        this.seconds = v
        break
      case 'string':
        this.horloge = v
        this.seconds = this.h2s(v)
        break
      case 'object':
        console.log("Le traitement par objet n'est pas encore implémenté")
    }
  }

  set horloge(v)  { this._horloge = v }

  get horloge()   {
    if(undefined === this._horloge){
      this._horloge = this.s2h()
    }
    return this._horloge
  }

  h2s(h){
    h = h.split(',').reverse()
    var tps = 0
    tps += parseInt(h[0]||0,10) * 40
    tps += parseInt(h[1]||0,10) * 1000
    tps += parseInt(h[2]||0,10) * 1000 * 60
    tps += parseInt(h[3]||0,10) * 1000 * 3600
    return tps / 1000
  }
  s2h(s, format){
    var r, hrs, mns, scs, frm ;
    if(undefined==s){s = this.seconds}
    hrs = Math.floor(s / 3600)
    r = s - (hrs * 3600)
    mns = Math.floor(r / 60)
    r = r - (mns * 60)
    scs = Math.floor(r)
    frm = parseInt((r - scs) * 1000 / 40,10)
    return `${hrs}:${mns}:${scs}:${frm}`
  }
}
