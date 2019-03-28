'use strict'

/**
  Retourne true si le nombre est entre +min+ et +max+
  Si +strict+ est true, le nombre ne doit pas être égal
  à ces valeurs, il doit se trouver strictement *entre*
  ces valeurs.
**/
Number.prototype.between = function(min, max, strict){
  var v = this.valueOf()
  if(strict){
    return v > min && v < max
  } else {
    return v >= min && v <= max
  }
}

/**
  Retourne true si le numbre est près du nombre +ref+
  avec une tolérance de +tolerance+

  8.isNear(10, 1) => false car 8 n'est pas entre 9 et 11
  8.isNear(10, 3) =>  true car 8 est entre 7 (10 - 3) et
                      13 (10 + 3)
**/
Number.prototype.isCloseTo = function(ref, tolerance){
  return this.between(ref - tolerance, ref + tolerance)
}
