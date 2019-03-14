# Manuel de développement de Film-Analyzer

* [Point d'entrée](#point_dentree)
* [Ajout de préférences globales](#add_global_prefs)
* [Ajout de préférence analyse](#add_analyse_pref)
* [Champs temporels](#temporal_fields)
* [Aspect visuel](#visual_aspect)

## Point d'entrée {#point_dentree}

Le point d'entrée du main process se fait par `./main.js`

Le point d'entrée de l'analyser (`analyser.html`) se fait par `./app/js/lecteur/on_ready.js`

On fabrique une instance `FAnalyse`, qui est l'analyse courante. Normalement, pour le moment, c'est un singleton, mais on pourra imaginer certaines parties du programme qui travaillent avec plusieurs analyses en même temps.

Cette instance `FAnalyse` construit un « controleur vidéo » (instance `VideoController`) et un « lecteur d'analyse » (instance `AReader`)


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
