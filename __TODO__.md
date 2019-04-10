# SUR LE GRILL

* BRINS
  - Créer le fichier exemple brin.yaml dans les fichiers d'analyse
  - les traiter dans le livre, faire peut-être des graphiques

* PROCÉDÉS
  - Faire la méthode `FAProcede.get(proc_id)` qui retourne l'instance FAProcede du procédé d'identifiant `proc_id`. On en aura besoin pour la publication.
  - Faire la méthode `FAProcede#scene` qui retourne le numéro de la scène du procédé, pour les ajouter dans le fil du texte.
    Note : généraliser cette méthode en l'implémentant dans FAEvent.

* [BUGS]

* [AMÉLIORATIONS]
  - [Writer] Quand on joue tabulation sur un document data et qu'il n'y a que des espaces avant, on doit ajouter encore deux espaces
    + quand on supprime sur une ligne où il n'y a que des espaces avant, on essaie de supprimer deux espaces à la fois
  - Pouvoir utiliser le Writer pour éditer les données de types d'event
  - construction du graphique de la dynamique narrative
    liste des OOC
  - mettre les données absolues comme les types de procédés, etc. sous forme de fichier YAML et peupler les éléments de l'interface avec.

* [ESSAIS]
  - Poursuivre les essais de javascript dans les ebooks en utilisant un lien vers un autre endroit du livre.
  Si ça ne fonctionne pas, développer les liens hypertextuels normaux.

* [VÉRIFICATIONS]

* OUTILS
  Peut-être faire un menu "Outils" s'il y en a suffisamment
  - rejoindre la dernière scène définie

* Développer la méthode `FAEvent.as('<format>', FLAG)`.
  Note : il faut la développer pour tous les types d'events (pour le moemnt, elle sert juste pour les scènes)

* PUBLICATION
  - Bien étudier la document de Calibre (ebook-convert) pour savoir comment régler la page de couverture, les données, etc.

* ASSEMBLAGE DE L'ANALYSE
  =======================
  + Rappels :
    - S'inspirer du scénier pour tout gérer :
    - Mettre toujours un id dans les titres de chapitres
    - Mettre des sections, comme section#scenier, section#fondamentales, etc. mais "sortir" les titres, sinon ils n'apparaitraient pas dans la toc.
  - information du film (-> titre "Fiche d'identité du film"). Toujours dans le script d'assemblage
    Note : quelle est la différence avec les "infos du film" ?
  - note : il faut toujours qu'un fichier texte commence par son titre. Ça permet de le "nommer" quand on en parle dans les comptes-rendus.
  - Utiliser la méthode FADocument::findAssociations pour récupérer les associations avec des documents et les traiter dans l'affichage.
  - Réfléchir aux liens (qui pour le moment fonctionnent avec des méthodes javascript `show<Thing>`). Il faudrait, dans l'idéal, pouvoir conduire quelque part et revenir. Si l'on part du principe qu'un objet ne peut pas être trop lié, on peut avoir `[1]` qui conduit à la référence `[1]` et la référence `[1]` qui ramène au lien. Dans l'idéal, un bouton 'revenir', programmé par javascript, permettrait de revenir :
    - quand on clique sur `[12]`, ça appelle une méthode javascript qui :
      + conduit à la référence `12` (disons une scène dans le scénier final)
      + définit le retour dans la référence `12` pour qu'il ramène là où on a cliqué.

* Pour l'estimation de l'avancée de l'analyse :
  On pourrait imaginer que chaque composant calcule lui-même, lorsqu'il est édité, son niveau d'avancement et l'enregistre dans un fichier qui sera lu tout simplement par la barre d'état.
  Par exemple, lorsque l'on édite les fondamentales, elles s'autoévaluent par rapport aux données fournies.
  Cela permettrait :
    - d'avoir une évaluation beaucoup plus fine
    - de ne pas être obligé de tout recharger pour estimer l'avancée
  => Imaginer une classe AutoEvaluator qui appelerait, pour chaque composant, une méthode 'autoEvaluate' qui retournerait :
    - une valeur globale de pourcentage
    - des descriptions plus précises de ce qui est fait et ce qui
      reste à faire.
    - ces valeurs seraient enregistrées


# EN COURS DE DÉVELOPPEMENT

* Mettre en place les tests manuels
  Ce sont des fichiers YAML, on doit pouvoir les afficher à l'écran et enregistrer les résultats à partir de case à cocher.

* Pour la FATimeline
  - faire des instances FACursor

* Mettre en option la sauvegarde automatique de l'analyse

* Développer la main-timeline pour qu'elle affiche le paradigme de Field absolu, peut-être sous forme de point plutôt que de cases
  - noter que pour le moment le "slider" de l'instance FATimeline s'affiche au-dessus puisque la timeline est vide.

# TODO LIST

* Développer le protocole d'analyse avec la possibilité d'avoir le détail de la démarche à adopter.

* Faire les méthodes `showTime`, `showEvent`, `showScene(<numero>)`, `showDocument(<doc id>)` etc. qui doit donner des indications sur les éléments.
  - voir comment on se sert de javascript dans les eBooks (ça ne semble pas possible)
  - faire les styles associés aux liens utilisant ces méthodes (`lktime`, `lkscene`, `lkevent`, etc.)

* Quand il y a un trop grand nombre de rapports, détruire les plus anciens

* Pouvoir modifier la vitesse à l'aide des touches `CMD +` et `CMD -`

* Rapports (class FAReport). Pouvoir recharger des rapports qui se trouvent dans le dossier 'reports' de l'analyse.
* Pouvoir avoir plusieurs writers pour éditer plusieurs documents en même temps
* Script d'assemblage : pouvoir insérer une image avec `IMAGE <image path>`
  -> documenter

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
* Lorsqu'on (re)définit le début du film avec des events déjà définis, on doit demander si on doit changer les temps. Penser que c'est peut-être une redéfinition et qu'un temps a déjà été pris en compte. Il faut donc, pour chaque évènement, ajouter ce temps pour obtenir le temps initial puis retirer le nouveau temps.
* Pouvoir suivre en même temps deux endroits dans le film (donc deux visualiseurs avec chacun leur vidéo !)
* Mettre en place la partie TESTS MANUELS
  - pouvoir lire les fichiers YAML du dossier, les afficher avec des cases à cocher
  - pouvoir enregistrer les résultats dans un fichier JSON
  - peut-être que dès qu'une nouvelle version est en cours d'enregistrement, les tests se ré-initialisent et il faut les traiter.

# PEUT-ÊTRE UN JOUR
* API qui permettrait de récupérer les data des films online (au format json).


Comment mettre en exergue les events affichés dans le reader ?
Si on part du principe qu'il n'y en aura jamais beaucoup, ça peut se faire en lisant

Et si c'était l'event lui-même qui vérifiait ? Tous les events, une fois affichés, mettent en route une méthode setInterval qui regarde le temps courant. Si l'évènement est dans le temps courant (à plus ou moins 2 secondes), il se met en exergue.
C'est donc dans la méthode show.
