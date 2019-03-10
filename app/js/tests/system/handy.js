'use strict'

// Pour construire un message d'erreur de type :
//  La valeur de truc devrait être à machin, elle vaut bidule
//
window.msg_failure = function(sujet, expected, actual){
  if('string' == typeof(expected) && !expected.match(/^[0-9]+$/)){expected = `"${expected}"`}
  if('string' == typeof(actual) && !actual.match(/^[0-9]+$/)){actual = `"${actual}"`}
  var msg = `la valeur de ${sujet} devrait être ${expected}, elle vaut ${actual}`;
  msg = msg.replace(/de le/g, 'du').replace(/de les/g, 'des');
  return msg;
};
// Pour construire un message d'erreur avec la méthode ci-dessus, mais en
// le mettant dans la liste (Array) +in+
window.push_failure = function(arr, sujet, expected, actual){
  arr.push(msg_failure(sujet, expected, actual));
};


window.wait = function(wTime, wMsg){
  if(undefined !== wMsg) Tests.log(wMsg)
  return new Promise(ok => {setTimeout(ok, wTime)})
}
