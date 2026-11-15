# Seraya Creations — maquette e-commerce

Cette version reprend l'identité visuelle du fichier de référence fourni : rose poudré, crème, bleu nuit, lavande, petites touches sauge, typographie douce et détails dessinés à la main.

## Pages incluses

- `index.html` — accueil
- `boutique.html` — catalogue avec filtres et tri visuels
- `produit.html` — fiche produit (exemple avec options)
- `histoire.html` — histoire de la marque
- `contact.html` — formulaire de contact de démonstration
- `panier.html` — panier visuel avec quantités et suppression
- `commande.html` — formulaire de livraison et paiement illustratif
- `favoris.html` — liste de souhaits
- `compte.html` — écran de connexion illustratif
- `livraison.html` — livraison et FAQ
- `app.html` — aperçu de l'interface mobile

## Lancer la maquette

1. Décompresser le ZIP.
2. Ouvrir `index.html` dans un navigateur moderne.
3. Pour tester toutes les fonctions de démonstration, naviguer entre les pages avec les liens du site.

Aucun serveur ni installation n'est requis. Pour un aperçu optimal des polices, une connexion Internet est nécessaire au chargement des Google Fonts ; des polices de remplacement sont prévues.

## Interactions incluses

- Navigation entre toutes les pages.
- Filtres de catégories et tri de la boutique.
- Sélection des variantes sur la fiche produit.
- Ajout au panier, mise à jour des quantités et suppression.
- Favoris enregistrés dans le navigateur (`localStorage`).
- Formulaires avec confirmation visuelle.

## Important avant publication

C'est une **maquette front-end uniquement**. Aucun compte client, paiement, e-mail, commande, stock ou livraison réelle n'est connecté.

Les prix, caractéristiques, parfums, tailles, adresse e-mail, délais et conditions de livraison sont des exemples de démonstration. Il faut les remplacer et les vérifier avant toute mise en ligne commerciale. Les images de produits sont des illustrations vectorielles provisoires ; elles peuvent être remplacées par les vraies photos des créations.

## Modifier les produits

Les produits de démonstration sont définis en haut de `app.js` dans le tableau `PRODUCTS`. Les illustrations se trouvent dans `assets/products/`.

## Identité visuelle

La palette et les éléments de marque ont été repris et harmonisés à partir de `Web Produit-html.zip`. Le logo d'origine est conservé dans `assets/logo-seraya.png`.

## Améliorations v2

- Apparition douce des sections au scroll, bandeau défilant, pétales et étincelles flottants sur l'accueil.
- Cartes produits avec washi tape, légère inclinaison au survol et halo chaleureux.
- Cœur qui s'envole vers le panier à l'ajout, petits cœurs sur les favoris.
- « Mode bougie » (bouton en bas à gauche sur ordinateur) : la page se tamise et une lumière chaude suit la souris. Échap pour quitter.
- Bords festonnés, soulignés dessinés à la main, texture papier discrète, en-tête qui s'allège au scroll.
- Les animations se désactivent si l'appareil demande moins de mouvement.

## Améliorations v3

- Logo nettoyé : cercle net sans coins noirs, allégé pour un chargement plus rapide.
- « Mèche » de lecture : une fine ligne rose avec une petite flamme qui avance pendant le défilement ; bouton « remonter » discret.
- Mode bougie : la lumière vacille maintenant comme une vraie flamme.
- Les bougies s'illuminent doucement au survol des cartes produits.
- Lumières douces qui dérivent derrière l'accueil ; l'illustration suit légèrement la souris.
- Bords festonnés sur les sections colorées, boutons plus doux, petit point sous la page active.
- Pastilles (« fait main avec amour ») agrandies pour que le texte ne soit plus coupé.
- Mobile : la barre « ajouter au panier » reste visible sur la fiche produit.
- Lien « Aller au contenu » pour la navigation au clavier.
- Un petit secret caché : clique sur une pastille ronde ou sur la signature du pied de page. ♡

## Améliorations v4 — esprit application mobile

- **Barre de navigation en bas** (écrans ≤ 700 px, ex. mode mobile du navigateur) : 4 onglets (boutique, favoris, coffrets cadeaux, panier) avec pastille ronde flottante sur l'onglet actif, encoche qui glisse d'un onglet à l'autre et compteurs sur favoris/panier.
- **En-tête façon appli** : menu à gauche, logo au centre, compte à droite.
- **Aperçu mobile** sur ordinateur : bouton « aperçu mobile » (en bas à gauche) → le site dans un téléphone, navigation complète ; Échap pour fermer.
- **Boutique** : recherche instantanée, filtres défilants au doigt.
- **Panier** : résumé et bouton de commande toujours visibles sur mobile ; barre « ajouter au panier » au-dessus de la barre d'onglets.

## Améliorations v5

- Barre du bas aux couleurs de Seraya (bleu nuit, rose, crème) avec une encoche courbe et douce autour de l'onglet actif, qui glisse d'un onglet à l'autre.
- Icône « Mon compte » ajoutée dans l'en-tête de la version ordinateur (et dans le menu tablette).

## Améliorations v6

- Fiche produit : « Choisis ton parfum » et « Ta taille » s'affichent avec leurs choix sur les coffrets (le parfum et la taille sont gardés dans le panier, sans changer le coffret). Sur la décoration, ces choix ne s'affichent pas.
- Transitions douces entre les pages (ordinateur et mobile) : le contenu se fond puis le suivant apparaît, l'en-tête reste en place.
- Barre mobile : nouvelles icônes (accueil, bougie, cœur, panier) ; l'onglet Accueil remplace « coffrets cadeaux ».
