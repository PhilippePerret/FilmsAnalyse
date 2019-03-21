'use strict'
/**
 * Définition des snippets
 */

const Snippet = {
data:{
  'scpole': "http://www.scenariopole.fr"
, 'php': "Philippe Perret"
}
/**
* Regarde si +snip+ est un snippet et le retourne.
* Sinon, retourne null
**/
, check:function(snip){
    if (undefined === this.data[snip]) return null
    return this.data[snip]
}

}
