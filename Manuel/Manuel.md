# Manuel de l'analyse de films

* [Présentation générale](#presentation_generale)
* [Gestion des temps](#gestion_des_temps)
  * [Passer en revue les 3 derniers points d'arrêt](#passe_revue_stop_points)
  * [Récupération du temps courant](#get_current_time)
* [L'Interface](#linterface)
  * [Comportement du bouton STOP](#le_bouton_stop)

Ce manuel décrit l'utilisation de l'application **FilmAnalyse** qui permet d'effectuer avec confort — et plus que ça — des analyses de films.

## Présentation générale {#presentation_generale}

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

## Interface {#linterface}

### Comportement du bouton STOP {#le_bouton_stop}

Le bouton STOP a trois comportement différents, dans l'ordre de priorité :

1. la première pression ramène au temps de départ précédent — et s'arrête,
2. la deuxième pression ramène au début du film, s'il est défini,
3. la troisième pression ramène au début de la vidéo.
