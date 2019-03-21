# Manuel de l'analyse de films

* [Présentation générale](#presentation_generale)
* [Videos](#concernant_la_video)
* [Gestion des temps](#gestion_des_temps)
  * [Passer en revue les 3 derniers points d'arrêt](#passe_revue_stop_points)
  * [Récupération du temps courant](#get_current_time)
  * [Réglage du temps et de la durée de l'event](#set_event_time)
* [L'Interface](#linterface)
  * [Comportement du bouton STOP](#le_bouton_stop)
* [Définir le Paradigme de Field Augmenté du film](#define_film_pfa)
* [Les Documents](#les_documents)
  * [Diminutifs](#les_diminutifs)
  * [Variables dans les documents](#variables_dans_les_documents)
* [Assemblage de l'analyse finale](#assemblage_analyse)
* [Publication online](#publication_online)

Ce manuel décrit l'utilisation de l'application **FilmAnalyse** qui permet d'effectuer avec confort — et plus que ça — des analyses de films.

## Présentation générale {#presentation_generale}

## Videos {#concernant_la_video}

Les vidéos utilisées peuvent être au format `mp4`, `ogg` et `webm`.

## Gestion des temps {#gestion_des_temps}

### Passer en revue les 3 derniers points d'arrêt {#passe_revue_stop_points}

![Points d'arrêt](../app/img/btns-controller/btn-points-arrets.png)

Ce bouton permet de passer en revue les trois derniers points d'arrêt de la vidéo.

 *stricto sensu*, il s'agit en fait des trois points de redémarrage. Donc, pour les définir, il suffit de choisir la position précise à l'arrêt, puis de cliquer sur le bouton PLAY.

 > Note : ces trois points d'arrêt sont enregistrés dans les données de l'analyse et peuvent donc être retrouvés en rechargeant l'analyse.

 #### Verrouillage des points d'arrêt

 Plus pratique encore, on peut décider de verrouiller ces points d'arrêt, pour qu'ils ne soient pas remplacés par de nouveaux points d'arrêts si l'on redémarre le film à une autre position. Pour se faire, il suffit que l'option « Verrouillage des points d'arrêt » soit cochée dans les options.

### Récupération du temps courant {#get_current_time}

Pour coller rapidement un temps courant dans un champ d'édition, il suffit de cliquer sur le bouton « Temps courant » qui affiche le résultat et le colle dans le presse-papier.

### Réglage du temps de l'event {#set_event_time}

#### Réglage du temps

Pour éditer le temps d'un event — i.e. le modifier, on peut s'y prendre de cette manière :

* éditer l'event en cliquant sur son bouton d'édition dans sa ligne d'outil dans le reader,
* cliquer sur l'horloge de position et déplacer la souris — horizontalement — pour changer le temps. Noter que la vidéo se change en conséquence
* utiliser la touche MAJ appuyée pour se déplacer rapidement dans le temps,
* utiliser la touche CTRL appuyée pour régler en finesse le temps,
* double-cliquer sur l'horloge pour remettre le temps initial (permet aussi, à l'ouverture du formulaire, de rejoindre tout de suite l'event dans le film),
* relâcher la souris lorsque le bon temps est trouvé,
* enregistrer les changements.

#### Réglage de la durée

On peut régler la durée d'un event quelconque en modifiant son horloge de durée, de la même manière que pour l'horloge :

* éditer l'event en cliquant sur son bouton d'édition dans le lecteur (ou autre affichage de l'event),
* cliquer dans l'horloge de durée et déplacer la souris horizontalement pour changer le temps,
* la vidéo suit la fin de la durée, par caler précisément le temps,
* utiliser la touche MAJ appuyée pour se déplacer rapidement dans le temps,
* utiliser la touche CTRL appuyée pour régler en finesse le temps,
* relâcher la souris lorsque la bonne durée est trouvée,
* enregistrer les changements en cliquant sur le bouton adéquat.


## Interface {#linterface}

### Comportement du bouton STOP {#le_bouton_stop}

Le bouton STOP a trois comportement différents, dans l'ordre de priorité :

1. la première pression ramène au temps de départ précédent — et s'arrête,
2. la deuxième pression ramène au début du film, s'il est défini,
3. la troisième pression ramène au début de la vidéo.


## Définir le Paradigme de Field Augmenté du film {#define_film_pfa}

Pour définir le PFA du film, on crée des events de type **Nœud STT**. Il suffit de choisir le type du nœud dans le premier menu et de décrire en quoi le temps courant correspond au nœud concerné.

Une fois suffisamment de nœud définis, on peut demander l'affichage du paradigme en actionnant le menu « Affichage > Paradigme de Field Augmenté ».


## Les Documents {#les_documents}

### Les Diminutifs {#les_diminutifs}

Les diminutifs du film, par exemple les noms de personnage, se définissent dans le document « Diminutifs » qu'on peut atteindre par le menu « Documents ».

Dans le texte, il suffit de précéder ce diminutif d'un arobase.

Si l'on définit le diminutif suivant dans `diminutifs.yaml` :

```yaml

diM_24: |
  Un diminutif peut contenir des lettres maj/min, des chiffres
  et le caractère underscore.
DIM_24: Il est sensible à la casse

```
Alors on peut utiliser dans le texte :

```text

  C'est @dim_24 et @DIM_24.

```

… qui sera remplacé par :

```text

  C'est Un diminutif peut contenir des lettres maj/min, des chiffres
  et le caractère underscore et Il est sensible à la casse.

```

### Variables dans les documents {#variables_dans_les_documents}

On peut placer des variables dans les documents à l'aide de la syntaxe :

```markdown

  {{variable-name}}

```

Ces variables — pour le moment — ne concernent que les données générales de l'analyse.

On trouve :

`{{title}}`
: Titre complet du film

`{{authors}}`
: Auteurs du film.
: Ce sont des noms formatés séparés par des virgules.

`{{analystes}}`
: Analystes du film.
: Ce sont des noms formatés séparés par des virgules.

`{{date}}`
: Date du film.

## Assemblage de l'analyse finale {#assemblage_analyse}

L'assemblage de l'analyse finale se fait à partir du *script d'assemblage* défini dans les documents. S'il n'est pas défini, c'est le script par défaut qui sera utilisé (`./app/analyse_files/building_script.md`).

Chaque ligne de ce *script d'assemblage* définit une commande à jouer. Cette commande est composée de la commande elle-même, qui est toujours le premier mot en majuscule, suivi des arguments à utiliser.

Les deux premières type sont :

* `FILE`. Elle permet d'inclure un texte dans l'analyse à l'endroit voulu.
* `BUILD`. Elle demande la construction d'un composant de l'analyse, tel que le paradigme de Field, le diagramme dramatique ou autres statistiques.

### Commande `FILE`

En argument de la commande `FILE`, on peut trouver tous les types de document du menu des documents. On pourra donc faire, par exemple :

```
FILE Introduction
FILE Lecon_tiree
```

En fait, ces fichiers se trouvent dans le dossier `analyse_files` de l'analyse. Tout fichier contenu par ce dossier peut être inclus de cette manière dans l'analyse. S'il existe par exemple un fichier s'appelant `grande_note.md`, alors on pourra utiliser la commande :

```
FILE Introduction
FILE grande_note
FILE Lecon_tiree
```

… pour le charger à l'endroit voulu dans le fichier, ici entre l'introduction et la leçon tirée du film. Toute hiérarchie peut être utilisée, si les documents se trouvent dans des sous-dossiers. Par exemple :

```
FILE dossier1/sous-dossier2/mon_fichier_markdown
```

La seule exigence pour le moment est que le fichier doit être au format Markdown (étendu).

## Publication online {#publication_online}

Sur Kindle, la page de couverture ne doit pas être jointe au .mobi. Elle doit être :

* format JPEG ou TIFF
* ratio hauteur:largeur de 1.6:1 (c'est-à-dire 1600 en hauteur pour 1000 en largeur)
  Préconisé : 2560px x 1600px (mais 4500 pour les tablettes…)
* < 50Mo
* Détail : [Aide KDP](https://kdp.amazon.com/fr_FR/help/topic/G200645690)

Taille recommandé par Apple (à vérifier) :

*  1400x1873 pixels

Rapport pour les smartphones :

* 11/18

Pour la couverture de l'epub :

* cover.jpg (obligatoire)
* 600 x 1000 environ
