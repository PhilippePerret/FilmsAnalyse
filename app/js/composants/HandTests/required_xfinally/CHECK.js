'use strict'

Object.assign(HandTestStep.prototype,{
  /**
    @return {Boolean} true si c'est une étape de check, une vérification
                      à faire en cours de route ou à la fin.
  **/
  isCheck(){
    return 'object' === typeof(this.command) && Object.keys(this.command)[0] == 'check'
  }
  /**
    Exécute le check

    @return {Boolean} True si c'est un succès, False otherwise.
  **/
, execTheCheck(){
    var cmd, pas, res

    // D'abord, il faut voir si ce ne sont pas des automatic-steps

    // POURSUIVRE CI-DESSOUS POUR POUVOIR SUPPRIMER LES COMMANDES QUI SONT
    // DES ÉTAPES AUTOMATIQUES POUR NE GARDER QUE CELLES QUI S'INTERPRETENT
    // LES REMPLACER SIMPLEMENT PAR DES ESPACES

    let nb_cmds = this.command['check'].length
    for(var i = 0; i < nb_cmds ; ++i){
      cmd = this.command['check'][i]
      pas = DATA_AUTOMATIC_STEPS[cmd]
      if(undefined === pas) continue
      try {
        res = eval(pas.exec)
        if(pas.expected != '---nothing---'){
          res === pas.expected || raise(pas.error.replace(/\%\{res\}/g, res))
        }
        this.command['check'][i] = '' // pour la retirer
      } catch (e) {
        console.error(e)
        F.error(e)
        return false // on s'arrête là
      }
    }

    cmd = "" + this.command['check'].join(RC).trim()

    // Il ne reste peut-être plus aucun check à évaluer
    if (cmd == '') return true

    // Il faut analyse la phrase de check, qui peut être sous la forme :
    //  {{event:12}} existe
    //  {{event:24}} apparait dans le READER
    //  etc.

    // On commence par supprimer les petits mots inutiles
    cmd = cmd.replace(/(^| )(le|la|de|des|un)( |$)/ig, ' ')
    console.log("Commande : ", cmd)
    for(var reg in HandTestStep.TABLE_SUBSTITUTIONS){
      cmd = cmd.replace(new RegExp(reg, 'gi'), HandTestStep.TABLE_SUBSTITUTIONS[reg])
    }
    console.log("Commande : ", cmd)
    cmd = cmd.replace(/  +/,' ').trim()
    console.log("Commande : ", cmd)

    cmd = cmd.split(RC)
    console.log("Commande : ", cmd)

    this.analyseAndCheckAll(cmd)

    return true // pour le moment
  }
, analyseAndCheckAll(checks){
    checks.map(check => this.analyseAndCheck(check))
  }
, analyseAndCheck(check){
    let sujet, sujet_id, verbe, expected
    check = check.replace(/^\{\{([a-zA-Z_]+):(.*?)\}\}/,function(tout, suj, suj_id){
      sujet = suj
      sujet_id = suj_id
      return ''
    })
    check = check.replace(/ ([a-zA-Z_\-]+) /, function(tout, verb){
      verbe = verb.toUpperCase()
      return ''
    })
    console.log({
      sujet: sujet, sujet_id:sujet_id, cmd: check,
      verbe: verbe
    })

    check = check.trim()

    check = check.replace(/^\{\{([a-zA-Z_\-]+):([^\}]+)\}\}/, function(tout, prop, val){
      expected = [prop, val]
      return ''
    })
    if(undefined === expected) expected = check
    console.log({
      check:check, expected: expected
    })

    // On prend le sujet
    let isujet = this.getSujet(sujet, sujet_id)
    if(false === isujet) return false // problème de définition de test
    else if (undefined === isujet){
      err_msg = `Impossible de trouver le sujet de type "${sujet}" et d'identifiant ${sujet_id}…`
      console.error(err_msg)
      return F.error(err_msg)
    }
    console.log("isujet:", isujet)

    // La suite dépend du verbe
    switch (verbe) {
      case 'HAS':
      case 'IS':
        // La suite est la valeur attendue, sous forme [prop, value] ou value
        break
      case 'IN':
        // expected contient le lieu où on doit trouver le sujet
        switch (expected) {
          case 'READER':

            break
          default:
            console.error(`Impossible de traiter le lieu "${expected}". Je dois renoncer.`)
            return false
        }
        break
      default:
        console.error(`Impossible de traiter le verbe "${verbe}". Je dois renoncer.`)
        return false
    }

  }
  /**
    @param {String} suj   Le type du sujet, p.e. 'event' ou 'document'
    @param {String} suj_id    L'identifiant. Pourra être transformé en nombre en
                              fonction du type du sujet

    @return {Instance} Instance de l'objet dont il est question.
  **/
, getSujet(suj, suj_id){
    switch (suj) {
      case 'event':
        return FAEvent.get(suj_id)
      case 'document':
        return FADocument.get(suj_id)
      case 'brin':
        return FABrin.get(suj_id)
      default:
        console.error(`Je ne sais pas traiter le sujet "${suj}"`)
        return false
    }
  }
})

HandTestStep.TABLE_SUBSTITUTIONS = {
  '(^| )(apparait dans|est dans|est sur|est affiché sur)( |$)': '$1IN$3'
, '(^| )(possède|est|a)( |$)': '$1IS$3'
}
