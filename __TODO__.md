# SUR LE GRILL

* Plein de [BUGS] apparaissent
  - lorsqu'on modifie mal un document YAML (les données des personnages par exemple), on se retrouve avec une   
    YAMLException.
    Elle ne doit pas interrompre le programme, il faut juste la signaler
  - Lorsque je fais TAB à la fin d'un document (i.e. quand le curseur se trouve à la fin), ça génère une erreur
    'Cannot read property 'length' of undefined'
    Apparemment, le programme tente d'insérer quelque chose puisque la méthode Selector.insert et insertAtCaret sont invoqués.
    => Intercepter le problème et l'empêcher.

* AMÉLIORATIONS
  - Faire apparaitre les nouveaux events à côté de la vidéo, pas dessus (je passe mon temps à les pousser)
  - Ajouter "MATIN" et "SOIR" dans les effets d'une scène
  - Marque scène au-dessus de vidéo : mettre le numéro de scène seulement et le pitch juste après pour pouvoir bénéficier de deux lignes.
  - Il faut pouvoir glisser un temps sur un input-text de temps (essayer avec le formulaire pour un procédé)
  - Il faut scroller dans le reader pour toujours afficher les events courants

* Ajouter le style de scène "Flashback"
  - s'en servir pour Her

* OUTILS
  - rejoindre la dernière scène définie
  - calculer la durée des scènes (en fonction de leur position)

* Développer la méthode `as('<format>', FLAG)`, avec flag qui pourrait être `LINKED|NUMBERED|TIMED`

* PUBLICATION
  ebook-convert (Calibre) est incontestablement la meilleure façon de sortir les .epub et les .mobi à partir du HTML.
  - Bien étudier la document de Calibre (ebook-convert) pour savoir comment régler la page de couverture, les données, etc.
  Quelques essais sont à faire :
    - sur le mobi (kindle), les display-inline ne sont pas respectés à la lettre
    - sur le epub, ça prend trop de place donc les textes passent à la ligne
    => essayer un fonctionnement avec les grids pour voir si ça marcherait mieux
    => Pour faire ces tests, on pourrait avoir un builder fait exprès, par exemple 'test_mef.js'
       Il suffit de mettre `BUILD test mef` dans le script d'assemblage pour produire les essais contenus dans le fichier

* ASSEMBLAGE DE L'ANALYSE
  =======================
  EN COURS : voir les problèmes de formatage des eBooks etc.
  + Rappels :
    - S'inspirer du scénier pour tout gérer :
    - Mettre toujours un id dans les titres
    - Mettre des sections, comme section#scenier, section#fondamentales, etc. mais "sortir" les titres, sinon ils n'apparaitraient pas dans la toc.
  - information du film (-> titre "Fiche d'identité du film"). Toujours dans le script d'assemblage
    Note : quelle est la différence avec les "infos du film" ?
  - note : il faut toujours qu'un fichier texte commence par son titre. Ça permet de le "nommer" quand on en parle dans les comptes-rendus.


* Pour l'estimation de l'avancée de l'analyse :
  On pourrait imaginer que chaque composant calcule lui-même, lorsqu'il est édité, son niveau d'avancement et l'enregistre dans un fichier qui sera lu tout simplement par la barre d'état.
  Par exemple, lorsque l'on édite les fondamentales, elles s'autoévaluent par rapport aux données fournies.
  Cela permettrait :
    - d'avoir une évaluation beaucopu plus fine
    - de ne pas être obligé de tout recharger pour estimer l'avancée
  => Imaginer une classe AutoEvaluator qui appelerait, pour chaque composant, une méthode 'autoEvaluate' qui retournerait :
    - une valeur globale de pourcentage
    - des descriptions plus précises de ce qui est fait et ce qui
      reste à faire.

* puisque les documents ne sont pas des instances qui sont enregistrés (mais seulement des fichiers texte), faire le tour des events pour connaitre les events qui leur sont associés (leur propriété 'documents' contient la liste des documents auxquels ils sont associés)


# EN COURS DE DÉVELOPPEMENT


* Pourvoir forcer le rechargement de l'analyse
  - ou, ce qui serait mieux, c'est de pouvoir déceler où il faut
    actualiser des données quand elles changent. Par exemple, lorsque
    le script d'assemblage est modifié, il faudrait resetter l'affichage
    de l'analyse pour qu'elle tienne compte du nouveau script.

* Pouvoir rejoindre la dernière scène (pour le travail)
  - Menu "Outils" > "Rejoindre la dernière scène établie"

* Pour la FATimeline
  - faire des instances FACursor

* Mettre en option la sauvegarde automatique de l'analyse

* Développer la main-timeline pour qu'elle affiche le paradigme de Field absolu, peut-être sous forme de point plutôt que de cases
  - noter que pour le moment le "slider" de l'instance FATimeline s'affiche au-dessus puisque la timeline est vide.

* Construction des Fondamentales
* Construction des statistiques de fin

# TODO LIST

* Quand il y a un trop grand nombre de rapports, on détruit les plus anciens

* Pouvoir modifier la vitesse à l'aide des touches `CMD +` et `CMD -`

* Implémenter les fonctions windows `showEvent(event_id)` et `showScene(event_id)` qui permettent d'afficher les events ou les scènes dans les textes finaux.
  - Noter que la méthode showScene attend un identifiant d'event, PAS un numéro de scène (qui peut changer à tout moment)
  - Implémenter de la même manière la méthode `showDocument(doc_id/type)` qui permet d'afficher/visualiser les documents

* Rapports (class FAReport). Pouvoir recharger des rapports qui se trouvent dans le dossier 'reports' de l'analyse.
* Pouvoir avoir plusieurs writers pour éditer plusieurs documents en même temps
* Poursuivre les expériences pour exporter en ePub et autre format
  - voir comment incorporer les fichiers dans le template
    Peut-être chaque fichier doit-il avoir un ID (OUI), et une position:after
    et :before qui le place, et d'autres propriétés comme la position x ou y
    si c'est une image par exemple, ou des styles particuliers à appliquer,
    etc.

* Faire un fichier `metadata.yml` pour les métadonnées du livre (pour les epubs fait avec pandoc)

* Menu pour passer à la version suivante de l'analyse
  - faut-il conserver un certain nombre de versions ?

* Développer l'affichage de l'état de l'analyse (la version détaillée).

* Pouvoir indiquer qu'un event est "printable", c'est-à-dire qu'il sera affiché dans l'analyse finale. Ou alors, définir **OÙ** il sera printable (par exemple en lien avec un autre event) et où il ne le sera pas (par exemple dans le listing général des events de même type).

* Mettre en place un système de Tips qui s'affichera au moins une fois pour rappeler les bons trucs (pouvoir l'activer et le désactiver)
  -> Objet **Tips**

* Quand un event est affiché et qu'on repasse sur son temps, le mettre en exergue dans le reader.
  - de façon générale, il faut encore revoir le système d'affichage des events. Par exemple, si on revient en arrière, les nouveaux events sont affichés après ceux qui sont déjà présents
  => mettre peut-être le temps de l'even dans sa balise, pour pouvoir insérer très facilement les nouveaux events (par leur temps)

* On doit pouvoir changer la taille horizontale/verticale des flying-windows (deux pictos, peut-être ajoutés dans le 'header' du code construit dans le owner, qui permettent de le faire ? ou alors une bordure plus grande ?)
* Toutes les données absolues du formulaire (les types, les catégories, etc.) doivent être enregistrées dans des fichiers JSON et les éléments du formulaire doivent être construits à la volée.
  Bien se servir du type de l'évènement pour régler la class du tag
  Faire un script pour les prendre en compte après changement
* Les QD non actuellement résolues doivent s'afficher en bas à droite
* Les PP non actuellement résolues doivent s'afficher en bas à droite

* Faire un mode d'emploi interactif
* Proposer la liste des décors/sous-décors quand on focusse dans ces champs
* Lorsqu'on (re)définit le début du film avec des events déjà définis, on doit demander si on doit changer les temps. Penser que c'est peut-être une redéfinition et qu'un temps a déjà été pris en compte. Il faut donc, pour chaque évènement, ajouter ce temps pour obtenir le temps initial puis retirer le nouveau temps.
* Pouvoir suivre en même temps deux endroits dans le film (donc deux visualiseurs avec chacun leur vidéo !)

# PEUT-ÊTRE UN JOUR
* API qui permettrait de récupérer les data des films online (au format json).
