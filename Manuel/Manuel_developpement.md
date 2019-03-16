# Manuel de développement de Film-Analyzer

* [Point d'entrée](#point_dentree)
* [Création/modification des events](#creation_event)
  * [Mise en forme des events](#event_mise_en_forme)
  * [Bouton Play/Stop des events](#bouton_playstop_event)
* [Ajout de préférences globales](#add_global_prefs)
* [Ajout de préférence analyse](#add_analyse_pref)
* [Champs temporels](#temporal_fields)
* [Aspect visuel](#visual_aspect)
  * [Emp^rche]


## Point d'entrée {#point_dentree}

Le point d'entrée du main process se fait par `./main.js`

Le point d'entrée de l'analyser (`analyser.html`) se fait par `./app/js/lecteur/on_ready.js`

On fabrique une instance `FAnalyse`, qui est l'analyse courante. Normalement, pour le moment, c'est un singleton, mais on pourra imaginer certaines parties du programme qui travaillent avec plusieurs analyses en même temps.

Cette instance `FAnalyse` construit un « controleur vidéo » (instance `VideoController`) et un « lecteur d'analyse » (instance `AReader`)


## Création/modification des events {#creation_event}

Les `events` (scène, info, note, qrd, etc.) héritent tous de la classe `FAEvent`.

### Exécution d'une opération après la création

Il suffit de créer la méthode d'instance `onCreate` dans la classe de l'event. Elle sera automatiquement jouée lors de la modification de l'instance.

### Exécution d'une opération après la modification

Il suffit de créer la méthode d'instance `onModify` dans la classe de l'event. Elle sera automatiquement jouée lors de la modification de l'instance.

## Mise en forme des events {#event_mise_en_forme}

C'est le getter super `div` qui se charge de construire le div qui doit être affiché dans le reader. Il convient de ne pas le surclasser, pour obtenir tous les outils nécessaires à la gestion des events.

En revanche, pour un affichage particulier, on peut définir le getter d'instance `formated` qui doit définir ce qui va remplacer le texte `content` dans le div final.

> Utiliser la méthode `current_analyse.deDim(<formated>)` à la fin de l'opération pour remplacer tous les diminutifs utilisés.

Exemple :

```javascript

  get formated(){
    if(undefined === this._formated){
      var str
      str = '<mon div avec content>'
      str += '<mon div avec les notes>'
      str += '<mon div avec une autre valeur>'
      // etc.
      str = this.analyse.deDim(str)
      this.formated = str
      str = null // garbage collector
    }
    return this._formated
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


### Champs temporels {#temporal_fields}

On peut mettre `horlogeable` et `durationable` sur les input-text qui doivent être gérable au niveau des horloges (positions) et des durées.

Quand un champ input-text possède l'une de ces deux classes :

* il est rendu inéditable (`disabled`)
* il est sensible au déplacement de la souris pour augmenter/diminuer le temps
* pour les horlogeable, un bouton est placé après le champ pour prendre le temps courant

Noter qu'il faut utiliser la méthode `UI.setHorlogeable(<container>)` ou `UI.setDurationable(<container>)` pour que les observers soient placés. **ATTENTION** de ne pas prendre un container trop grand, qui possèderait des éléments déjà horlogeables ou durationables.


## Aspect visuel {#visual_aspect}

### Boutons principaux

Appliquer la classe `main-button` aux `button`s principaux, qui est défini dans `ui.css`.

### Empêcher la sélection

Utiliser la classe CSS `no-user-selection` pour empêcher un élément de l'interface d'être sélectionné lorsque l'on glisse la souris.

> Note : une fois cette classe appliquée, les textes contenus ne peuvent pas être sélectionnés par l'user.
