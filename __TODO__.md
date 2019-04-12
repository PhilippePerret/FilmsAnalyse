# SUR LE GRILL

### Traiter :
[3]

* HANDTESTS
  - Bien documenter l'utilisation des expressions régulières dans les étapes de tests
    - se servir de `ouvrir l'analyse`
    - bien commenter l'utilisation de l'asynchronicité avec un `return null` qui
      interrompt le test, et la méthode qui doit donc explicitement appeler les
      marques de réussite ou d'échec (HandTests.markSuccess/markFailure)
  - Poursuivre le traitement des vérifications (check) automatiques avec les `{{sujet:sujet_id}}`.

* Développer l'objet `FAStats` utilisé pour la première fois pour les brins (FABrin#stats)
  - mais aussi : `scenesCount`
  -> L'utiliser pour tous les objets qui peuvent l'utiliser

* [BUGS]
  [3] En changeant le temps de début dans l'analyse 'MANUEL/vierge', il y a demande de confirmation alors que normalement l'analyse ne contient ni document ni event…
  Si elle en contient, c'est que l'initialisation se fait mal et conserve des events et documents.
  Le menu des décors ne s'actualise pas dans les formulaires déjà ouverts.

* [AMÉLIORATIONS]
  - construction du graphique de la dynamique narrative
    liste des OOC

* [ESSAIS]
  - Poursuivre les essais de javascript dans les ebooks en utilisant un lien vers un autre endroit du livre. Si ça ne fonctionne pas, développer les liens hypertextuels normaux.

* [VÉRIFICATIONS]

* Développer la méthode `FAEvent.as('<format>', FLAG)` (et même *LES* méthodes as puisque tout élément possède maintenant cette méthode).
  Note : il faut la développer pour tous les types d'events (pour le moemnt, elle sert juste pour les scènes)

* PUBLICATION
  - Bien étudier la document de Calibre (ebook-convert) pour savoir comment régler la page de couverture, les données, etc.

* ASSEMBLAGE DE L'ANALYSE
  =======================
  + Indiquer que le 0 des temps est toujours donné au début de l'analyse
    + Il peut varier légèrement suivant le lecteur utilisé.
  + Indiquer : les films étrangers — américains, coréens, danois, etc. — sont toujours visionnés et analysés dans leur langue originale dans le respect de l’effort sonore artistique initial.
  + Rappels :
    - S'inspirer du scénier pour tout gérer :
    - Mettre toujours un id dans les titres de chapitres
    - Mettre des sections, comme section#scenier, section#fondamentales, etc. mais "sortir" les titres, sinon ils n'apparaitraient pas dans la toc.
  - information du film (-> titre "Fiche d'identité du film"). Toujours dans le script d'assemblage
    Note : quelle est la différence avec les "infos du film" ?
  - note : il faut toujours qu'un fichier texte commence par son titre. Ça permet de le "nommer" quand on en parle dans les comptes-rendus.
  - Utiliser la méthode FADocument::findAssociations pour récupérer les associations avec des documents et les traiter dans l'affichage.
  - Ajouter une mini-timeline aux brins, pour voir où se situent les scènes/events
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

* faire les styles associés aux liens utilisant ces méthodes (`lktime`, `lkscene`, `lkevent`, `lkdoc`). Mais attention : ne pas en faire trop. Discrète différence.

* Pour la FATimeline
  - faire des instances FACursor

* Développer la main-timeline pour qu'elle affiche le paradigme de Field absolu, peut-être sous forme de point plutôt que de cases
  - noter que pour le moment le "slider" de l'instance FATimeline s'affiche au-dessus puisque la timeline est vide.

# TODO LIST

* Une procédure de fix de l'analyse, lorsqu'elle comporte de graves erreurs. Ça peut arriver par exemple lorsqu'on définit des events et des brins associés, et qu'on oublie d'enregistrer les events de l'analyse.
  Ça ne doit plus se produire avec l'enregistrement automatique de l'analyse

* Développer le protocole d'analyse avec la possibilité d'avoir le détail de la démarche à adopter.

* Quand il y a un trop grand nombre de rapports, détruire les plus anciens
  -> Checker à chaque ouverture de l'analyse.

* Pouvoir modifier la vitesse à l'aide des touches `CMD +` et `CMD -`

* Rapports (class FAReport). Pouvoir recharger des rapports qui se trouvent dans le dossier 'reports' de l'analyse.
* Pouvoir avoir plusieurs writers pour éditer plusieurs documents en même temps

* Script d'assemblage : pouvoir insérer une image avec `IMAGE <image path>`
  -> documenter
  - Sinon, dans un document, l'insérer en markdown normal : `![alt iamge](path/to/image.format)`

* Faire un fichier `metadata.yml` pour les métadonnées du livre (pour les epubs fait avec pandoc)

* Développer l'affichage de l'état de l'analyse (la version détaillée).
  - voir aussi la note sur le fait que chaque élément puisse produire sa propre analyse de son état.

* Pouvoir indiquer qu'un event est "printable", c'est-à-dire qu'il sera affiché dans l'analyse finale. Ou alors, définir **OÙ** il sera printable (par exemple en lien avec un autre event) et où il ne le sera pas (par exemple dans le listing général des events de même type).

* Mettre en place un système de Tips qui s'afficheront au moins une fois pour rappeler les bons trucs (pouvoir l'activer et le désactiver)
  -> Objet **Tips**
  - Et si on imaginait des div qui n'apparaissent que lorsqu'on presse la touche MÉTA ? En fonction du contexte, on les ajoute partout où il faut dans le document, tout le temps.

* On doit pouvoir changer la taille horizontale/verticale des flying-windows (deux pictos, peut-être ajoutés dans le 'header' du code construit dans le owner, qui permettent de le faire ? ou alors une bordure plus grande ?)

* Lorsqu'on (re)définit le début du film avec des events déjà définis, on doit demander si on doit changer les temps. Penser que c'est peut-être une redéfinition et qu'un temps a déjà été pris en compte. Il faut donc, pour chaque évènement, ajouter ce temps pour obtenir le temps initial puis retirer le nouveau temps.

* Pouvoir suivre en même temps deux endroits dans le film (donc deux visualiseurs avec chacun leur vidéo !)

# PEUT-ÊTRE UN JOUR

* API qui permettrait de récupérer les data des films online (au format json).
