# Full-Stack – Rapport de projet

**Auteur :** Kevin BIOJOUT  
**Date :** jeudi 21 décembre 2023

---

## 1 Introduction

Ce rapport porte sur **Ollarrive**, l'application développée dans le cadre des UE de travaux pratique de Full-Stack.  
Toute ressemblance avec le nom d'une entreprise est entièrement fortuite bien évidemment ;).

Mon équipe est composée d'une personne : moi-même, on en déduit donc que tous les développements ont été réalisés par moi-même.

---

## 2 Architecture de l'application

Cette application s'architecture autour de trois pilliers principaux :

- une base de données **PostgreSQL** ;
- une API RESTful développée avec **Spring Boot** ;
- un client web reposant sur **React**.

Ce projet tire partie de GitHub Actions pour les tâches suivantes :

- construction d'images Docker pour le client et l'API ;
- déploiement automatisé sur une machine distante (mon Raspberry Pi en l'occurrence).

Elle est _(ou devrait être)_ déployée à cette adresse : [https://ollarrive.kevinbioj.fr](https://ollarrive.kevinbioj.fr).  
Si jamais cela n'était pas le cas, suivez la partie 3 pour exécuter une version locale rapidement.

Docker Swarm est utilisé pour pouvoir déployer correctement l'application (sans downtime, mise à jour intelligente des images, possibilités de loadbalancing)
et pour utiliser des fonctionnalités sympathiques comme les secrets pour ne pas avoir à faire voyager le mot de passe de la base de données en variable d'environnement :).

Depuis le client, les interactions avec l'API passent à travers le front-end qui agit en plus comme un reverse proxy.  
Les requêtes dont le chemin débute par `/api` sont automatiquement envoyées vers l'API, que ce soit en développement (grâce au proxy Vite) ou en production (en utilisant Nginx).

---

## 3 Installation rapide

Pour exécuter l'application en local, vous aurez besoin :

- d'un environnement Docker et de Docker Compose ;
- d'un JDK v21 ou ultérieur ;
- de Node.js v18 ou ultérieur.

### 3.1 Démarrage de la base de données

Dans un terminal situé à la racine du projet, exécutez la commande `docker compose up -d`.  
La base de données démarrera quelques instants après, prête à servir l'API.

### 3.2 Compilation et démarrage de l'API

Dans un terminal situé dans le sous-dossier `server`, exécutez la commande `./gradlew bootJar`.  
Lorsque la compilation est terminée, exécutez la commande `java -jar build/libs/server.jar -Dspring.profiles.active=dev` pour démarrer le serveur.

Il devrait être opérationnel quelques instants après, ce qui nous laisse finir avec le client web.

### 3.3 Compilation et démarrage du client

Dans un terminal situé dans le sous-dossier `client`, exécutez la commande `npm ci`.  
Lorsque les dépendances sont installées, construisez le projet avec la commande `npm run build`.  
Enfin, lancez le client web avec la commande `npm run preview`.

Vous devriez être en mesure d'accéder à l'interface sur [http://localhost:4200](http://localhost:4200).

---

## 4 Exigences non-couvertes

Quelques exigences obligatoires du CCTP n'ont pas pu être couvertes.  
Malheureusement, il est nécessaire de sacrifier au moins en partie quelques projets pour que tout rentre à la fin du semestre 😔.

| Section              | Exigence |
| -------------------- | -------- |
| Gestion des livreurs | E_LVR_45 |
| Gestion des livreurs | E_LVR_65 |
| Gestion des livreurs | E_LVR_75 |
| Gestion des tournées | E_TOU_50 |
| Gestion des tournées | E_TOU_60 |
| Gestion des tournées | E_TOU_70 |

---

## 5 Difficultés rencontrées

### 5.1 Rechercher proprement

Sur le papier, c'est très simple de rechercher... en pratique ça l'est moins !  
Au départ, l'idée était d'avoir une méthode par combinaison de filtre dans un Repository : ça a le mérite de fonctionner mais c'est une horreur à maintenir.

Heureusement, on peut utiliser une `Specification` pour factoriser tout ça.

```java
  private Specification<DelivererEntity> createSearchSpecification(DelivererSearchRequest request) {
    return ((root, query, builder) -> {
      List<Predicate> predicates = new ArrayList<>();
      if (request.getName() != null) {
        predicates.add(builder.like(builder.lower(root.get("name")),
            "%" + request.getName().toLowerCase() + "%"));
      }
      if (request.getAvailable() != null) {
        predicates.add(builder.equal(root.get("available"), request.getAvailable()));
      }
      if (request.getCreatedAfter() != null) {
        predicates.add(
            builder.greaterThanOrEqualTo(root.get("createdAt"), request.getCreatedAfter()));
      }
      if (request.getCreatedBefore() != null) {
        predicates.add(
            builder.lessThanOrEqualTo(root.get("createdAt"), request.getCreatedBefore()));
      }
      return builder.and(predicates.toArray(Predicate[]::new));
    });
  }
```

On construit dynamiquement notre requête SQL en fonction des critères de recherche fournis.  
De plus, on peut facilement composer les opérateurs : la recherche par nom est par exemple insensible à la casse.

Pour utiliser le résultat de la méthode, on utilise un Repository implémentant l'interface `JpaSpecificationExecutor<T>` qui spécifie la méthode suivante :

```java
  Page<T> findAll(Specification<T> specification, Pageable page);
```

C'est bingo : on a la recherche à l'aide de filtres et le support pour la pagination et le tri en une seule méthode.

---
