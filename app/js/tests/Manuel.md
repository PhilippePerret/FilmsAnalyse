# Manuel des tests

* [Introduction](#introduction)
* [Définition d'une feuille de test](#define_test_sheet)
* [Textes écrits dans le suivi](#textes_suivis)
* [Les Assertions](#les_assertions)
  * [Création d'assertions](#create_new_assertions)
    * [Options des assertions](#options_of_assert_function)
* [Textes écrits dans le suivi](#textes_suivis)
  * [Cas entièrement à implémenter (`pending`)](#pending)
  * [Test à implémenter plus tard (`tester`)](#test_to_define)
  * [Exécution d'une action (`action`)](#exec_action)

# Introduction {#introduction}

Pour utiliser les tests (persos) comme ici, on doit :

* copier-coller le fichier `app/js/system/Tests.js` dans l'application,
* le charger dans la page principale
* copier coller tout le contenu du dossier `app/js/tests` (on peut supprimer les tests du dossier `tests/tests`, qui sont propres à l'application, ou les mettre de côté pour s'en inspirer)
* dans la page HTML principale, on doit ajouter :
    ```html
      <script type="text/javascript">
        const MODE_TEST = true
      </script>
    ```
* dans le onready de l'application (`$(document).ready` ou autre), on doit ajouter :
    ```javascript
      ...
      if(MODE_TEST){Tests.initAndRun()}
    ```

Tout le reste se passe automatiquement en lançant les scripts du dossier `./app/js/tests/tests/`.

## Définition d'une feuille de test {#define_test_sheet}

On appelle « feuille de test » un fichier `js` définissant le ou les tests à exécuter pour un cas particulier (ou toute l'application, si elle est simplissime).

La structure de ce fichier est :

```javascript
'use strict'

var t = new Test("Le titre du test (affiché en titre)")

t.case("Un cas particulier du test", () => {
  // ici les tests et assertions
})

t.case("Un autre cas particulier du test", () => {
  // Ici les tests des autres cas
})

// etc.

```

## Les Assertions {#les_assertions}

Les assertions s'utilisent de cette manière :

```javascript

  assert_<type>(<argument>[<option>])
  )
```

Par exemple, pour tester qu'une fonction existe pour un objet :

```javascript

  assert_function('function_name', objet)
```

Toutes les assertions utilisables sont définies dans le dossier `tests/system/`, dans des fichiers dont le nom commence par `assertions`.

On peut définir dans le fichier `assertions_app.js` les assertions propres à l'application testée.

### Création d'assertions {#create_new_assertions}

Les assertions définies pour l'application se place dans un fichier `assertions_app.js` ou un dossier `tests/system/app/assertions/`.

On peut s'inspirer des assertions système pour créer ses assertions. De façon générale :

* une nouvelle assertion porte un nom commençant par `assert_`,
* c'est une fonction
* qui possède autant d'arguments qu'on le souhaite,
* dans une première partie elle définit une condition qui devra être vrai (true) ou fausse (false),
* dans sa dernière partie elle invoque la méthode générique `assert` qui attend ces arguments :
    ```javascript
    assert(
        condition
      , "<message si condition true>"
      , "<message si condition false"
      [, options]
    )
    ```
Les options peuvent déterminer par exemple que le message ne doit s'afficher que si la condition est `false`.

Par exemple, si je veux définir :

```javascript

  assert_equal( expected, actual )

```

J'implémente :

```javascript

window.assert_equal = function(expected, actual, options){
  if (undefined === options) options = {}
  var conditionTrue = function(strictMode){
    if(strictMode) return expected === actual
    else return expected == actual
  }(options.strict)

  assert(
      conditionTrue
    , options.success_message || `${actual} est bien égal à ${expected}`
    , options.failure_message || `${actual} devrait être égal à ${expected}`
    , options
  )
}
```

### Options des assertions {#options_of_assert_function}

onlyFailure
: si `true`, le succès reste silencieux, seul la failure écrit un message.

onlySuccess
: si `true`, la failure reste silencieuse, seul le succès écrit un message.

## Textes écrits dans le suivi {#textes_suivis}

En dehors des messages des assertions elles-mêmes, on peut trouver ces textes dans le suivi du tests :

* [Cas entièrement à implémenter (`pending`)](#pending)
* [Test à implémenter plus tard (`tester`)](#test_to_define)
* [Exécution d'une action (`action`)](#exec_action)
<!-- Reporter aussi au-dessus si ajout -->

### Cas entièrement à implémenter (`pending`) {#pending}

On utilise le mot-clé-fonction `pending` pour déterminer un cas entièrement à implémenter.

```javascript

  t.case("Mon tests pas implémenté", ()=>{
    pending("Faire ce test plus tard")
  })
```

Noter que contrairement à [`tester`](#test_to_define), qui n'influence pas le résumé total des tests à la fin (sa couleur), ce `pending` empêche les tests de passer au vert.

### Test à implémenter plus tard (`tester`) {#test_to_define}

Lorsqu'un test ponctuel — à l'intérieur d'un cas long — est compliqué ou délicat et qu'on ne veut pas l'implémenter tout de suite, on peut le remplacer par le mot-clé-fonction `tester`.

```javascript
  tester("<message du test à faire>")
```

C'est le message `<message du test à faire>` qui apparaitra en rouge gras dans le suivi des tests, indiquant clairement que ce test sera à implémenter.

On peut se servir de ce mot-clé, par exemple, pour définir rapidement tous les tests à faire. Puis les implémenter dans un second temps.


### Exécution d'une action (`action`) {#exec_action}

Pour mettre en valeur une action à exécuter (et s'assurer qu'elle fonctionne), on peut utiliser le mot-clé-fonction `action` :

```javascript
  action("L'action que je dois faire", ()=>{
    // Le code de l'action, par exemple :
  })
```

Par exemple :

```javascript
  action("L'utilisateur clique sur le bouton OK", () => {
    $('#monBoutonOK').click()
  })
```

De cette manière, dans l'énoncé des tests, on peut suivre toutes les actions accomplies.
