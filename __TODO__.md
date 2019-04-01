# SUR LE GRILL


* PROTOCOLE D'ANALYSE
  - le prendre en compte pour l'état d'avancement. On ne peut pas dépasser tel pourcentage suivant l'état du protocole.
  - faire une dernière passe sur les données pour voir si c'est suffisamment détaillé pour le moment

* Supprimer la méthode onDropThing, la mettre directement dans la définition des droppables.

* Voir la méthode FAEvents.onDropThing
  Pour le moment, elle ne fait rien du tout, en fait.
  Mais ATTENTION : il ne faut pas modifier la méthode FAnalyse#associateDropped pour qu'elle modifie la donnée elle même en ajoutant dans la propriété `documents` ou `events` car il y aurait avec d'autres objets comme par exemple le MiniWriter, qui ne pourrait pas traiter, en tout cas pour le moment, le « possesseur » de cette propriété `documents` ou `events`.
  En fait, il faudrait deux méthodes :
    - une qui reprendrait intégralement associateDropped et retournerait la balise à insérer
    - une qui associerait les éléments dans l'instance, dans `documents` et `events`
    Mais la vraie question est celle-ci : est-ce vraiment nécessaire d'associer les éléments en dehors de leur texte ? Oui, peut-être justement pour les associer sans avoir à rédiger quelque chose.

* ASSEMBLAGE DE L'ANALYSE
  =======================
  EN COURS : PARADIGME DE FIELD (pour l'analyse/livre)
  + Rappels :
    - S'inspirer du scénier pour tout gérer :
    - Mettre toujours un id dans les titres
    - Mettre des sections, comme section#scenier, section#fondamentales, etc. mais "sortir" les titres, sinon ils n'apparaitraient pas dans la toc.
  - scénier du film
  - fondamentales
  - note : il faut toujours qu'un fichier texte commence par son titre. Ça permet de le "nommer" quand on en parle dans les comptes-rendus.
  - Développer encore le vérificateur pour prendre en compte les nouveaux fichiers (vérifier que les fondamentales, etc. soit pris en compte)


* puisque les documents ne sont pas des instances qui sont enregistrés (mais seulement des fichiers texte), faire le tour des events pour connaitre les events qui leur sont associés (leur propriété 'documents' contient la liste des documents auxquels ils sont associés)



# EN COURS DE DÉVELOPPEMENT

* Pour l'eventer, afficher les scènes à l'ouverture

* Pour la FATimeline
  - faire des instances FACursor

* Mettre en option la sauvegarde automatique de l'analyse
  - mémoriser les events qui ont été modifiés (en pensant aux ajouts et aux destruction)
  - penser au fait qu'une analyse pourra comporter une énorme quantité d'events. Peut-être se concentrer uniquement sur ceux modifié, créés ou détruits au cours de la séance.

* Développer la main-timeline pour qu'elle affiche le paradigme de Field absolu, peut-être sous forme de point plutôt que de cases
  - noter que pour le moment le "slider" de l'instance FATimeline s'affiche au-dessus puisque la timeline est vide.

* Construction des Fondamentales
* Construction des statistiques de fin

# TODO LIST

* Pouvoir modifier la vitesse à l'aide des touches `CMD +` et `CMD -`

* Faire du filtre d'event une classe séparée qui pourra être utilisée par n'importe quel composant.

* Implémenter les fonctions windows `showEvent(event_id)` et `showScene(event_id)` qui permettent d'afficher les events ou les scènes dans les textes finaux.
  - Noter que la méthode showScene attend un identifiant d'event, PAS un numéro de scène (qui peut changer à tout moment)

* Implémenter les infos générales du film
  - note : pour faire simple, ça pourrait être un fichier document, avec l'extension ".md" mais qui serait en fait un YAML, qui serait édité comme les autres.

* Rapports (class FAReport). Pouvoir recharger des rapports qui se trouvent dans le dossier 'reports' de l'analyse.
* Pouvoir avoir plusieurs writers pour éditer plusieurs documents en même temps
* Poursuivre les expériences pour exporter en ePub et autre format
  - voir comment incorporer les fichiers dans le template
    Peut-être chaque fichier doit-il avoir un ID (OUI), et une position:after
    et :before qui le place, et d'autres propriétés comme la position x ou y
    si c'est une image par exemple, ou des styles particuliers à appliquer,
    etc.

* Faire un fichier `metadata.yml` pour les métadonnées du livre

* Menu pour passer à la version suivante de l'analyse
  - faut-il conserver un certain nombre de versions ?

* Développer l'affichage de l'état de l'analyse.

* Pouvoir indiquer qu'un event est "printable", c'est-à-dire qu'il sera affiché dans l'analyse finale. Ou alors, définir **OÙ** il sera printable (par exemple en lien avec un autre event) et où il ne le sera pas (par exemple dans le listing général des events de même type).

* Mettre en place un système de Tips qui s'affichera au moins une fois pour rappeler les bons trucs (pouvoir l'activer et le désactiver)
  -> Objet **Tips**

* Quand un event est affiché et qu'on repasse sur son temps, le mettre en exergue dans le reader.
  - de façon générale, il faut encore revoir le système d'affichage des events. Par exemple, si on revient en arrière, les nouveaux events sont affichés après ceux qui sont déjà présents
  => mettre peut-être le temps de l'even dans sa balise, pour pouvoir insérer très facilement les nouveaux events (par leur temps)

* Utiliser un moyen de sauvegarder les derniers évènements sauvés (modifiés ou créés dans un fichier séparé pour ne pas surcharger la sauvegarde et surtout avoir un moyen de récupérer les données en cas de plantage)

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
* Modifier la classe FWindow (flying-windows) pour pouvoir rétrécir la largeur des eventers, writer, etc.

# PEUT-ÊTRE UN JOUR
* API qui permettrait de récupérer les data des films online (au format json).
