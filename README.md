# Sushi House — Application de commande (TP4)

## Description
Application frontend pédagogique pour un restaurant de sushi à Marrakech. Elle affiche une carte de produits et une liste de commandes reliées à trois fichiers JSON (clients, produits, commandes).

## Technologies
- HTML5, CSS3, Bootstrap 5
- JavaScript (modules ES, fetch, async/await)
- JSON
- Git et GitHub

## Structure du projet
- `index.html` : structure de l'interface
- `css/style.css` : mise en forme responsive
- `data/customers.json` : clients
- `data/products.json` : produits
- `data/orders.json` : commandes
- `js/state.js` : état central de l'application
- `js/dataService.js` : chargement des fichiers JSON
- `js/selectors.js` : relations, calculs et filtres
- `js/view.js` : affichage dans le DOM
- `js/app.js` : initialisation et événements

## Fonctionnalités principales
- Carte des produits filtrable par catégorie
- Indicateurs calculés : clients, produits, commandes, montant cumulé (hors commandes annulées)
- Recherche d'une commande par nom de client
- Filtres combinables par statut et par catégorie de produit
- Détail d'une commande (client, ville, date, statut, lignes, total)
- Message d'erreur en cas d'échec de chargement des données

## Lancer le projet
Les fichiers JSON sont chargés avec `fetch`, donc il faut un serveur local.
1. Ouvrir le dossier dans Visual Studio Code.
2. Installer l'extension Live Server.
3. Faire un clic droit sur `index.html` puis « Open with Live Server ».