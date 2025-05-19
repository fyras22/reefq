const fs = require("fs");
const path = require("path");

// Chemins des fichiers
const SRC_DATA_DIR = path.join(process.cwd(), "src/data");
const CHICHKHANE_DATA_FILE = path.join(
  SRC_DATA_DIR,
  "chichkhaneCollections.js"
);
const COLLECTIONS_FILE = path.join(SRC_DATA_DIR, "collections.js");
const BACKUP_DIR = path.join(process.cwd(), "backups");

// Assurez-vous que le répertoire de sauvegarde existe
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Répertoire créé: ${directory}`);
  }
}

// Créer une sauvegarde du fichier de collections existant
function backupCollectionsFile() {
  ensureDirectoryExists(BACKUP_DIR);
  const backupFileName = `collections_backup_${new Date().toISOString().replace(/:/g, "-")}.js`;
  const backupFilePath = path.join(BACKUP_DIR, backupFileName);

  fs.copyFileSync(COLLECTIONS_FILE, backupFilePath);
  console.log(`Sauvegarde créée: ${backupFilePath}`);

  return backupFilePath;
}

// Lire et analyser le fichier des collections existantes
function readCollectionsFile() {
  try {
    // Lire le contenu du fichier
    const fileContent = fs.readFileSync(COLLECTIONS_FILE, "utf8");

    // Extraire le contenu du tableau collections
    const collectionsMatch = fileContent.match(
      /export\s+const\s+collections\s*=\s*(\[[\s\S]*?\]);/
    );

    if (!collectionsMatch || !collectionsMatch[1]) {
      throw new Error("Format de fichier collections.js non reconnu");
    }

    // Évaluer le contenu du tableau (méthode sécurisée avec JSON.parse)
    // Note: Nous devons d'abord nettoyer les commentaires et formater correctement comme JSON
    const cleanedContent = collectionsMatch[1]
      .replace(/\/\/.*/g, "") // Supprimer les commentaires de ligne
      .replace(/\/\*[\s\S]*?\*\//g, "") // Supprimer les commentaires de bloc
      .replace(/,(\s*[\]}])/g, "$1"); // Supprimer les virgules finales

    try {
      return JSON.parse(cleanedContent);
    } catch (jsonError) {
      console.error("Erreur de parsing JSON, tentative avec eval()");
      // Fallback à eval (moins sécurisé mais plus flexible) si le JSON n'est pas valide
      return eval(`(${collectionsMatch[1]})`);
    }
  } catch (error) {
    console.error(
      `Erreur lors de la lecture des collections: ${error.message}`
    );
    return [];
  }
}

// Lire et analyser le fichier des collections Chichkhane
function readChichkhaneCollections() {
  try {
    // Vérifier si le fichier existe
    if (!fs.existsSync(CHICHKHANE_DATA_FILE)) {
      console.error(`Fichier ${CHICHKHANE_DATA_FILE} non trouvé`);
      return [];
    }

    // Lire le contenu du fichier
    const fileContent = fs.readFileSync(CHICHKHANE_DATA_FILE, "utf8");

    // Extraire le contenu du tableau chichkhaneCollections
    const collectionsMatch = fileContent.match(
      /export\s+const\s+chichkhaneCollections\s*=\s*(\[[\s\S]*?\]);/
    );

    if (!collectionsMatch || !collectionsMatch[1]) {
      throw new Error("Format de fichier chichkhaneCollections.js non reconnu");
    }

    // Mêmes étapes de nettoyage que pour collections.js
    const cleanedContent = collectionsMatch[1]
      .replace(/\/\/.*/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/,(\s*[\]}])/g, "$1");

    try {
      return JSON.parse(cleanedContent);
    } catch (jsonError) {
      console.error("Erreur de parsing JSON, tentative avec eval()");
      return eval(`(${collectionsMatch[1]})`);
    }
  } catch (error) {
    console.error(
      `Erreur lors de la lecture des collections Chichkhane: ${error.message}`
    );
    return [];
  }
}

// Intégrer les collections Chichkhane dans les collections existantes
function integrateCollections() {
  try {
    // Créer une sauvegarde d'abord
    backupCollectionsFile();

    // Charger les collections existantes
    const collections = readCollectionsFile();
    console.log(`${collections.length} collections existantes chargées`);

    // Charger les collections Chichkhane
    const chichkhaneProducts = readChichkhaneCollections();
    console.log(`${chichkhaneProducts.length} produits Chichkhane chargés`);

    if (chichkhaneProducts.length === 0) {
      console.warn("Aucun produit Chichkhane trouvé, rien à intégrer");
      return;
    }

    // Vérifier les extensions des fichiers d'images pour s'assurer qu'elles sont correctes
    chichkhaneProducts.forEach((product) => {
      // Si c'est un chemin d'image .png mais nous savons qu'il devrait être .jpg, le corriger
      if (product.image && product.image.endsWith(".png")) {
        const imagePath = product.image.replace(".png", ".jpg");
        const fullPath = path.join(process.cwd(), "public", imagePath);

        // Vérifier si l'image .jpg existe
        if (fs.existsSync(fullPath)) {
          console.log(
            `Mise à jour de l'extension d'image pour ${product.id} de .png à .jpg`
          );
          product.image = imagePath;
        }
      }
    });

    // Créer un mapping des collections existantes par nom
    const existingCollectionsByName = {};
    const existingCollectionsById = {};
    collections.forEach((collection) => {
      if (collection.name) {
        existingCollectionsByName[collection.name.toLowerCase()] = collection;
      }
      if (collection.id) {
        existingCollectionsById[collection.id] = collection;
      }
    });

    // Regrouper les produits Chichkhane par catégorie
    const chichkhaneByCategory = {};
    chichkhaneProducts.forEach((product) => {
      const category = product.category || "Other";
      if (!chichkhaneByCategory[category]) {
        chichkhaneByCategory[category] = [];
      }
      chichkhaneByCategory[category].push(product.id);
    });

    // Préparer les nouvelles collections à ajouter
    const newCollections = [];

    // 1. Ajouter la collection principale Chichkhane contenant tous les produits
    const mainChichkhaneCollection = {
      id: "chichkhane_main",
      name: "Chichkhane Collection",
      slug: "chichkhane-collection",
      description:
        "Découvrez notre collection exclusive de bijoux Chichkhane, une marque connue pour son élégance et son artisanat exceptionnel.",
      image:
        chichkhaneProducts[0]?.image ||
        "/images/collections/chichkhane-collection.jpg",
      featured: true,
      products: chichkhaneProducts.map((p) => p.id),
      source: "Chichkhane",
    };
    newCollections.push(mainChichkhaneCollection);

    // 2. Ajouter des collections pour chaque catégorie
    Object.entries(chichkhaneByCategory).forEach(([category, productIds]) => {
      if (productIds.length > 0) {
        const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const collectionId = `chichkhane_${categorySlug}`;

        // Vérifier si la collection existe déjà
        if (!existingCollectionsById[collectionId]) {
          // Trouver l'image du premier produit de cette catégorie
          const firstProduct = chichkhaneProducts.find(
            (p) => p.id === productIds[0]
          );

          const newCollection = {
            id: collectionId,
            name: `Chichkhane ${category}`,
            slug: `chichkhane-${categorySlug}`,
            description: `Collection de ${category.toLowerCase()} de Bijouterie Chichkhane, connue pour sa qualité et son style.`,
            image: firstProduct?.image || "/images/collections/default.jpg",
            featured: category === "Ensemble" || category === "Parure", // Mettre en avant certaines catégories
            products: productIds,
            source: "Chichkhane",
          };
          newCollections.push(newCollection);
        }
      }
    });

    // 3. Ajouter chaque produit Chichkhane comme une collection individuelle
    // (pour permettre l'accès via l'URL /collections/[product-slug])
    chichkhaneProducts.forEach((product) => {
      const productSlug = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      const collectionId = `chichkhane_product_${product.id.split("_")[1]}`;

      // Vérifier si la collection existe déjà
      if (!existingCollectionsById[collectionId]) {
        const newCollection = {
          id: collectionId,
          name: product.name,
          slug: productSlug,
          description: product.description,
          image: product.image,
          featured: false,
          products: [product.id],
          source: "Chichkhane",
          isProduct: true, // Marquer comme produit individuel
        };
        newCollections.push(newCollection);
      }
    });

    // Ajouter les nouvelles collections au tableau existant
    const updatedCollections = [...collections, ...newCollections];
    console.log(`${newCollections.length} nouvelles collections ajoutées`);

    // 3. Mettre à jour les collections existantes pour utiliser les nouvelles images
    const finalCollections = updatedCollections.map((collection) => {
      // Si c'est une collection Chichkhane existante, vérifier et mettre à jour son image
      if (
        collection.source === "Chichkhane" &&
        collection.products &&
        collection.products.length > 0
      ) {
        const productId = collection.products[0];
        const relatedProduct = chichkhaneProducts.find(
          (p) => p.id === productId
        );

        if (
          relatedProduct &&
          relatedProduct.image &&
          relatedProduct.image !== collection.image
        ) {
          console.log(
            `Mise à jour de l'image pour la collection ${collection.name}`
          );
          return {
            ...collection,
            image: relatedProduct.image,
          };
        }
      }
      return collection;
    });

    // Écrire le fichier collections.js mis à jour
    const fileContent = `// Generated collections file with Chichkhane integration
// Last updated: ${new Date().toISOString()}

export const collections = ${JSON.stringify(finalCollections, null, 2)};
`;

    fs.writeFileSync(COLLECTIONS_FILE, fileContent);
    console.log(`Fichier collections.js mis à jour avec succès`);
  } catch (error) {
    console.error(
      `Erreur lors de l'intégration des collections: ${error.message}`
    );
  }
}

// Fonction principale
function main() {
  console.log("Démarrage de l'intégration des collections Chichkhane...");
  integrateCollections();
  console.log("Intégration terminée");
}

// Exécuter la fonction principale
main();
