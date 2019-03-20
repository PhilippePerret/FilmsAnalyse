# Manuel de développement de Film-Analyzer

* [Point d'entrée](#point_dentree)
* [Chargement de dossier de modules](#loading_modules_folders)
* [Création/modification des events](#creation_event)
  * [Mise en forme des events](#event_mise_en_forme)
  * [Bouton Play/Stop des events](#bouton_playstop_event)
  * [Actualisation automatique des horloges, time et numéro](#autoupdate_horloge_time_numera)
* [Ajout de préférences globales](#add_global_prefs)
* [Ajout de préférence analyse](#add_analyse_pref)
* [Horloges et durées](#temporal_fields)
* [Aspect visuel](#visual_aspect)
* [Documents de l'analyse](#documents_analyse)
* [Sauvegarde protégée des documents](#saving_protected)


## Point d'entrée {#point_dentree}

Le point d'entrée du main process se fait par `./main.js`

Le point d'entrée de l'analyser (`analyser.html`) se fait par `./app/js/lecteur/on_ready.js`

On fabrique une instance `FAnalyse`, qui est l'analyse courante. Normalement, pour le moment, c'est un singleton, mais on pourra imaginer certaines parties du programme qui travaillent avec plusieurs analyses en même temps.

Cette instance `FAnalyse` construit un « controleur vidéo » (instance `VideoController`) et un « lecteur d'analyse » (instance `AReader`)

## Chargement de dossier de modules {#loading_modules_folders}

On peut charger des modules en inscrivant leur balise `<script>` dans le document grâce à la méthode `System.loadJSFolders(mainFolder, subFolders, fn_callback)`.

L'avantage de ce système — contrairement à `require` —, c'est que tout le contenu du code est exposé à l'application. Si une classe `WriterDoc` est définie, elle sera utilisable partout, à commencer par les modules chargés.

C'est cette formule qu'on utilise par exemple pour charger le *Writer* qui permet de rédiger les textes.

## Création/modification des events {#creation_event}

Les `events` (scène, info, note, qrd, etc.) héritent tous de la classe `FAEvent`.

### Exécution d'une opération après la création

Il suffit de créer la méthode d'instance `onCreate` dans la classe de l'event. Elle sera automatiquement jouée lors de la modification de l'instance.

### Exécution d'une opération après la modification

Il suffit de créer la méthode d'instance `onModify` dans la classe de l'event. Elle sera automatiquement jouée lors de la modification de l'instance.

## Mise en forme des events {#event_mise_en_forme}

C'est le getter super `div` qui se charge de construire le div qui doit être affiché dans le reader. Il convient de ne pas le surclasser, pour obtenir tous les outils nécessaires à la gestion des events.

En revanche, pour un affichage particulier du contenu, on peut définir le fonction d'instance `formateContenu` qui doit définir ce qui va remplacer le texte `content` dans le div final. Elle doit retourner le contenu à afficher (sans le mettre dans une propriété conservé, ce qui empêcherait l'actualisation — ou la compliquerait).

> Utiliser la méthode `current_analyse.deDim(<formated>)` à la fin de l'opération pour remplacer tous les diminutifs utilisés.

Exemple :

```javascript

  formateContenu(){
    var str
    str = '<mon div avec content>'
    str += '<mon div avec les notes>'
    str += '<mon div avec une autre valeur>'
    // etc.
    str = this.analyse.deDim(str)

    return str
  }
```

### Bouton Play/Stop des events {#bouton_playstop_event}

`BtnPlay` est une classe javascript qui permet de gérer facilement les boutons play/stop des events, c'est-à-dire des boutons qui mettent en route (ou se rendent au temps de) la vidéo et l'arrête à la fin de la durée de l'event.

Une unique instance `BtnPlay` est associée à un event `event.btnPlay` et va gérer tous les boutons play affichés de cet évènement.

Pour l'implémenter, inscrire ce code HTML dans la page, à l'endroit où le bouton doit apparaitre, en réglant l'attribut `size` pour que le bouton ait la taille voulu. Si le bouton doit être à gauche, ajouter la classe `left`, s'il doit être à droite, ajouter `right` (cela permet de gérer l'espace avec les éléments autour) :

```html

  <div id="main-container">

    <button class="btnplay left" size="30"></button>

  </div>

```

Dans le code javascript, ajouter simplement :

```javascript

  BtnPlay.setAndWatch($('#main-container'), <event>)

```

> `#main-container` ne peut pas être le bouton lui-même, il ne serait pas traité.

Tout le reste est géré automatiquement, il n'y a rien à faire.

### Actualisation automatique des horloges, time et numéro {#autoupdate_horloge_time_numera}

Afin que les horloges et les times en attribut de balises soient automatiquement modifiés tous en même temps, il suffit de respecter les conventions suivantes :

* Pour les horloges, ajouter la classe CSS `horloge-event` et mettre un attribut `data-id` avec la valeur de l'identifiant de l'event. Par exemple :
    ```html
      <span class="horloge horloge-event" data-id="4">...</span>
    ```
* Pour la valeur du `time` enregistré en attribut (pratique pour certaines opération), il suffit d'ajouter l'attribut `data-id` en parallèle de l'attribut `data-time`. Par exemple :
    ```html
      <div data-time="23.56" data-id="12">...</div>
    ```
* Si l'event est une scène, son numéro doit être indiqué de la manière suivante :
    ```html
      <span class="numero-scene" data-id="23">...</span>
    ```
Si ces conventions sont respectées, l'appel à la méthode `FAEvent#updateInUI` modification automatiquement les valeurs affichées et consignées. Pour ce qui est des scènes, c'est la méthode qui actualise tous les numéros qui se chargera d'actualiser les numéros de scène.

Cf. aussi [Champs temporels](#temporal_fields) pour les champs *horlogeables* et *durationables*.


## Ajout de préférences globales (appelées aussi "options globales") {#add_global_prefs}

Ces préférences sont définies dans le menu « Options » jusqu'à définition contraire.

Il faut donc faire un nouveau menu dans le submenu de "Options" avec les données suivantes :

```javascript
  {
      label:    "<Le label de la préférences>"
    , id:       '<id_indispensable_et_universel>'
    , type:     'checkbox'
    , checked:  false
    , click:    ()=>{
        var check = this.getMenu('<id_indispensable_et_universel>').checked
        mainW.webContents.executeJavaScript(`FAnalyse.setGlobalOption('<id_indispensable_et_universel>',${checked?'true':'false'})`)
    }
  }
```

Il faut demander son réglage au chargement de l'application dans le fichier `.../main-process/Prefs.js` :

```javascript

  // dans .../main-process/Prefs.js

  , setMenusPrefs(){
      //...

      ObjMenus.getMenu('<id_indispensable_et_universel>').checked = this.get('<id_indispensable_et_universel>')
      // En considérant que le menu et l'id de l'option sont identiques, ce
      // qui est préférable.
    }

```

Si la valeur par défaut doit être false, il n'y a rien d'autres à faire. Sinon, il faut définir sa valeur par défaut dans `Prefs` (fichier `.../main-process/Prefs.js` comme ci-dessus) :

```javascript

  // dans .../js/main-process/Prefs.js
  loadUserPrefs:function(){
    //...
    } else {
      this.userPrefs = {
        //...
        '<id_indispensable_et_universel>': true
      }
    }
  }

```

### Ajout de préférence analyse {#add_analyse_pref}

1. Dans le fichier `./app/js/system/Options.js`, ajouter l'option à la donnée `Options.DEFAULT_DATA`.

2. Demander le réglage de l'option dans `FAnalyse#setOptionsInMenus` dans le fichier `common/FAnalyse.js` en s'inspirant des autres options.

3. Traiter l'utilisation de l'option en se servant de la valeur de `current_analyse.options.get('<id_universel_option>')`.


### Horloges et durées {#temporal_fields}

On peut mettre `horlogeable` et `durationable` sur les balises `<horloge></horloge>` qui doivent être gérable au niveau des horloges (positions) et des durées.

Quand un champ input-text possède l'une de ces deux classes :

* il est rendu inéditable (`disabled`)
* il est sensible au déplacement de la souris pour augmenter/diminuer le temps

Noter qu'il faut utiliser la méthode `UI.setHorlogeable(<container>, options)` ou `UI.setDurationable(<container>, options)` pour que les observers soient placés. **ATTENTION** de ne pas prendre un container trop grand, qui possèderait des éléments déjà horlogeables ou durationables.

```javascript
  var h = new DOMHorloge()
  h.dispatch({
        time: <le temps de départ>
      , synchroVideo: true/false
      , parentModifiable: true/false
      , unmodifiable: true/false
    }).showTime()
```

`options` peut contenir `{synchro_video: true}` pour que l'horloge soit synchronisée avec la vidéo. Inutile alors de dispatcher cette donnée.

Si `unmodifiable` est mis à true, on n'indiquera pas lorsque l'horloge aura changé de temps. C'est le cas par exemple de l'horloge principale.

On utilise `parentModifiable` en indiquant le conteneur, qui peut recevoir la classe `modified` pour indiquer qu'il est modifiable (*visuellement* modifiable). C'est le cas par exemple pour les horloges des formulaires d'events. Les formulaires sont les « containers modifiables », qui vont recevoir la class `modified` quand l'horloge sera modifiée, ce qui aura pour effet de mettre l'horloge dans une autre couleur ainsi que le header et le footer du formulaire.

## Aspect visuel {#visual_aspect}

### Boutons principaux

Appliquer la classe `main-button` aux `button`s principaux, qui est défini dans `ui.css`.

### Empêcher la sélection

Utiliser la classe CSS `no-user-selection` pour empêcher un élément de l'interface d'être sélectionné lorsque l'on glisse la souris.

> Note : une fois cette classe appliquée, les textes contenus ne peuvent pas être sélectionnés par l'user.

## Documents de l'analyse {#documents_analyse}

Les documents de l'analyse sont entièrement gérés, au niveau de l'écriture, par les modules contenus dans le dossier `./app/js/writer`. Ce dossier est le premier qui a été chargé par la nouvelle méthode `System#loadJSFolders` qui travaille avec des balises <script> afin d'exposer facilement tous les objets, constantes et autres.

Ces documents permettent de construire l'analyse de deux façons différentes :

* en les rédigeant dans le *Writer* (qui s'ouvre grâce au menu « Documents »)
* en en créant le code de façon dynamique pour ce qui est des stats, des PFA et autres notes au fil du texte.

## Sauvegarde protégée des documents {#saving_protected}

La sauvegarde protégée des documents est gérée par `system/IOFile.js`. L'utilisation est simple : on crée une instance `IOFile` du document en envoyant son path et on peut le sauver et le charger en utilisant `<instance>.save()` et `<instance>.loadIfExists()`.

Exemple :

```javascript
var p = './mon/fichier/analyse.md'
var iofile = new IOFile(p)

// Pour sauver le document :
iofile.save({
    after: methode_apres_sauvegarde
  , format: 'json' // ou 'yaml', 'markdown', etc. si pas bonne extension
})

```

> Noter qu'on indique le format que si l'extension du fichier ne correspond pas.

```javascript
// ...

function methode_apres_chargement(contenu_document){
  // ...
}
// Pour récupérer le document
iofile.loadIfExists({
  after: methode_apres_chargement // reçoit en argument le contenu du document
})
```

Noter qu'il est inutile, pour la méthode `loadIfExists`, de préciser que le contenu est en `json` puisque ça aura été précisé dans la méthode `save`. Le format sera tiré soit de l'extension du fichier (préférable), soit de la valeur de `options.format` fourni en argument de la méthode `save`.

On peut également passer l'option `format: 'raw'` lorsque l'on veut charger un document sans le *décoder*. Par exemple pour afficher un document YAML tel qu'il est dans son fichier, sans le transformer en table, on va utiliser :

```javascript

  let iofile = new IOFile('mon/path/file.yml')
  // Par défaut, le fichier de ce code sera parsé et une table serait
  // retournée
  iofile.loadIfExists({format:'raw', after: maMethode})

```

Avant ce code sera bien sûr défini :

```javascript

  function maMethode(code) {
    // ... ici, +code+ est un string
  }

```
