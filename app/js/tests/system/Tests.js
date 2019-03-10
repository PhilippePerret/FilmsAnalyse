'use strict'

window.INDENT = '    '
window.RC     = `
`
window.STYLE1 = 'font-weight:bold;font-size:1.2em;'; // Titre principal/fin
window.STYLE2 = 'border:1px solid black;padding:2px 4px;' // Tests
window.PATHSTYLE = 'font-size:0.85;color:grey;font-style:italic;margin-left:400px;'//path
window.STYLE3 = 'font-size:1.1em;font-weight:bold;' // Case
window.REDBOLD = 'font-weight:bold;color:red;'
window.BLUEBOLD = 'color:blue;font-weight:bold;'
window.GREENBOLD = 'color:darkgreen;font-weight:bold;'

Tests.nextTest = function(){
  if (this.tests.length){
    try {
      this.tests.shift().run()
    } catch (e) {
      console.error(e)
    }
  } else {
    this.termine()
  }
}

Tests.assert = function(trueValue, msg_success, msg_failure, options){
  if(undefined === options){options = {}}
  if (trueValue === true){
    if(!options.onlyFailure) this.onSuccess(msg_success)
  } else {
    // En cas d'échec de l'assertion
    if(!options.onlySuccess) this.onFailure(msg_failure)
  }
}

Tests.onSuccess = function(msg){
  this.nombre_success ++ ;
  this.log(INDENT + '%c… ' + msg, 'color:#00AA00;') ;
}

Tests.onFailure = function(msg){
  this.nombre_failures ++ ;
  this.log(INDENT + '%c… ' + msg, 'color:red;') ;
}

Tests.tester  = function(str){console.log(RC+'%cÀ TESTER : '+str, REDBOLD)}
Tests.given   = function(str){console.log(RC+'%c'+str+'…', BLUEBOLD)}
Tests.pending = function(str){
  this.nombre_pendings ++ ;
  this.log(RC+'%c'+(str||'TODO')+'…', 'color:orange;font-weight:bold;');
}
Tests.action  = function(msg, fn_action){
  try {
    fn_action()
    this.log(INDENT+'%cACTION: '+msg, GREENBOLD)
  } catch (e) {
    this.onFailure("Problème en exécutant l'action « " + msg + ' » : ' + e.message)
    throw e
  }
}

// ---------------------------------------------------------------------

Tests.showTestTitle = function(str, relPath){
  this.log('%c'+str, STYLE2)
  this.log('%c'+relPath, PATHSTYLE)
}

/**
 * Méthode pour "terminer" les tests, c'est-à-dire pour afficher les
 * résultats.
 */
Tests.termine = function(){
  var color = this.nombre_failures > 0 ? 'red' : (this.nombre_pendings > 0 ? 'orange' : '#00BB00') ;
  var str = `${this.nombre_success} success ${this.nombre_failures} failures ${this.nombre_pendings} pendings`
  $('#tags').html(`<div style="color:${color};font-weight:bold;padding:1em;">${str}</div><div style="padding:1em;font-style:italic;">Open the console to see the details.</div>`);
  console.log(RC+RC+RC+'%c' + str, `color:${color};font-weight:bold;font-size:1.2em;`);
  // if(this.sys_errors.length){
  //   console.log(RC+RC+'Des erreurs systèmes se sont produites aussi :');
  //   console.log(this.sys_errors);
  // };
  this.log(RC+RC+RC+'%c============ FIN DES TESTS ==============', STYLE1)
}

// ---------------------------------------------------------------------

Tests.log = function(msg, style){
  console.log(msg, style)
}

//  Méthodes fonctionnelles
Tests.addTest = function(itest){
  this.tests.push(itest)
}


// Raccourci
window.assert   = Tests.assert.bind(Tests)
window.given    = Tests.given.bind(Tests)
window.pending  = Tests.pending.bind(Tests)
window.tester   = Tests.tester.bind(Tests)
window.action   = Tests.action.bind(Tests)
