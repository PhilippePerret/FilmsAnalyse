# SUR LE GRILL

* HandTests
  Ce qui serait bien, c'est d'écrire toutes les étapes, puis de les dégriser au fur et à mesure qu'on les passe
  - Pouvoir utiliser 'verif:idx_de_la_verification' pour lancer une vérification particulière à un moment particulier du test.
  - Pouvoir lancer un test particulier (path rel du fichier)
* [HANDTESTS] Pouvoir reprendre la suite de test au moment où on s'est arrêté : en fonction des réponses données, le programme devine où on doit reprendre. Les résulats précédents sont enregistrés dans `./Tests_manuels/resultats.json`.

* Développer l'objet `FAStats` utilisé pour la première fois pour les brins (FABrin#stats)
  - mais aussi : `scenesCount`
  -> L'utiliser pour tous les objets qui peuvent l'utiliser

* [BUGS]
  - Quand il n'y a pas d'analyse courante à charger (pas l'option activée), et qu'on ouvre une analyse, une erreur est produite : pas de reader => Créer toujours un reader avec l'analyse.

* [AMÉLIORATIONS]
  - construction du graphique de la dynamique narrative
    liste des OOC

* [ESSAIS]
  - Poursuivre les essais de javascript dans les ebooks en utilisant un lien vers un autre endroit du livre.
  Si ça ne fonctionne pas, développer les liens hypertextuels normaux.

* [VÉRIFICATIONS]

* Développer la méthode `FAEvent.as('<format>', FLAG)` (et même *LES* méthodes as puisque tout élément possède maintenant cette méthode).
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
  - Ajouter une timeline aux brins, pour voir où se situent les scènes/events
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

* faire les styles associés aux liens utilisant ces méthodes (`lktime`, `lkscene`, `lkevent`, `lkdoc`)

* Mettre en place les tests manuels
  Ce sont des fichiers YAML, on doit pouvoir les afficher à l'écran et enregistrer les résultats à partir de case à cocher.

* Pour la FATimeline
  - faire des instances FACursor

* Mettre en option la sauvegarde automatique de l'analyse

* Développer la main-timeline pour qu'elle affiche le paradigme de Field absolu, peut-être sous forme de point plutôt que de cases
  - noter que pour le moment le "slider" de l'instance FATimeline s'affiche au-dessus puisque la timeline est vide.

# TODO LIST

* Développer le protocole d'analyse avec la possibilité d'avoir le détail de la démarche à adopter.


* Quand il y a un trop grand nombre de rapports, détruire les plus anciens

* Pouvoir modifier la vitesse à l'aide des touches `CMD +` et `CMD -`

* Rapports (class FAReport). Pouvoir recharger des rapports qui se trouvent dans le dossier 'reports' de l'analyse.
* Pouvoir avoir plusieurs writers pour éditer plusieurs documents en même temps
* Script d'assemblage : pouvoir insérer une image avec `IMAGE <image path>`
  -> documenter

* Faire un fichier `metadata.yml` pour les métadonnées du livre (pour les epubs fait avec pandoc)

* Développer l'affichage de l'état de l'analyse (la version détaillée).

* Pouvoir indiquer qu'un event est "printable", c'est-à-dire qu'il sera affiché dans l'analyse finale. Ou alors, définir **OÙ** il sera printable (par exemple en lien avec un autre event) et où il ne le sera pas (par exemple dans le listing général des events de même type).

* Mettre en place un système de Tips qui s'affichera au moins une fois pour rappeler les bons trucs (pouvoir l'activer et le désactiver)
  -> Objet **Tips**

* On doit pouvoir changer la taille horizontale/verticale des flying-windows (deux pictos, peut-être ajoutés dans le 'header' du code construit dans le owner, qui permettent de le faire ? ou alors une bordure plus grande ?)

* Faire un mode d'emploi interactif
* Lorsqu'on (re)définit le début du film avec des events déjà définis, on doit demander si on doit changer les temps. Penser que c'est peut-être une redéfinition et qu'un temps a déjà été pris en compte. Il faut donc, pour chaque évènement, ajouter ce temps pour obtenir le temps initial puis retirer le nouveau temps.
* Pouvoir suivre en même temps deux endroits dans le film (donc deux visualiseurs avec chacun leur vidéo !)
* Mettre en place la partie TESTS MANUELS
  - pouvoir lire les fichiers YAML du dossier, les afficher avec des cases à cocher
  - pouvoir enregistrer les résultats dans un fichier JSON
  - peut-être que dès qu'une nouvelle version est en cours d'enregistrement, les tests se ré-initialisent et il faut les traiter.

# PEUT-ÊTRE UN JOUR
* API qui permettrait de récupérer les data des films online (au format json).
