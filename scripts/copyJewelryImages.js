const fs = require("fs");
const path = require("path");

// Chemins des répertoires
const SRC_IMAGES_DIR = path.join(process.cwd(), "public/images/products");
const DEST_IMAGES_DIR = path.join(
  process.cwd(),
  "public/images/products/chichkhane"
);
const DATA_DIR = path.join(process.cwd(), "src/data");

// Assurer que le répertoire de destination existe
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Répertoire créé: ${directory}`);
  }
}

// Trouver toutes les images dans le répertoire source et ses sous-répertoires
function findAllImages(directory) {
  let images = [];

  // Lire le contenu du répertoire
  const items = fs.readdirSync(directory);

  for (const item of items) {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory() && !itemPath.includes("chichkhane")) {
      // Si c'est un répertoire (mais pas le répertoire 'chichkhane'), chercher récursivement
      const subDirImages = findAllImages(itemPath);
      images = images.concat(subDirImages);
    } else if (stats.isFile() && /\.(jpg|jpeg|png)$/i.test(item)) {
      // Si c'est un fichier image
      images.push(itemPath);
    }
  }

  return images;
}

// Copier les images pour les produits Chichkhane
function copyJewelryImages() {
  try {
    // Assurer que le répertoire de destination existe
    ensureDirectoryExists(DEST_IMAGES_DIR);

    // Trouver toutes les images disponibles
    const availableImages = findAllImages(SRC_IMAGES_DIR);
    console.log(
      `${availableImages.length} images trouvées dans le répertoire source`
    );

    if (availableImages.length === 0) {
      console.error("Aucune image trouvée. Abandon.");
      return;
    }

    // Lire le fichier de données des produits Chichkhane s'il existe
    const chichkhaneDataPath = path.join(DATA_DIR, "chichkhaneCollections.js");
    let chichkhaneProducts = [];

    if (fs.existsSync(chichkhaneDataPath)) {
      const fileContent = fs.readFileSync(chichkhaneDataPath, "utf8");
      const match = fileContent.match(
        /export\s+const\s+chichkhaneCollections\s*=\s*(\[[\s\S]*?\]);/
      );

      if (match && match[1]) {
        try {
          chichkhaneProducts = JSON.parse(match[1]);
        } catch (error) {
          console.error(
            `Erreur lors de la lecture des données Chichkhane: ${error.message}`
          );
        }
      }
    }

    // Si aucun produit n'est trouvé, créer des données de base
    if (chichkhaneProducts.length === 0) {
      chichkhaneProducts = Array.from({ length: 10 }, (_, i) => ({
        id: `chichkhane_${i + 1}`,
        name: `Bijou Chichkhane ${i + 1}`,
        category:
          i < 3
            ? "Ensemble"
            : i < 5
              ? "Bracelet"
              : i < 7
                ? "Collier"
                : i < 9
                  ? "Bague"
                  : "Parure",
      }));
    }

    // Associer les images aux produits et les copier
    const updatedProducts = chichkhaneProducts.map((product, index) => {
      // Prendre une image au hasard pour ce produit
      const randomIndex = (index * 7) % availableImages.length; // Disperser pour éviter les doublons
      const sourceImage = availableImages[randomIndex];
      const imageExt = path.extname(sourceImage); // .jpg, .png, etc.
      const destImageName = `chichkhane_${product.id.split("_")[1]}${imageExt}`;
      const destImagePath = path.join(DEST_IMAGES_DIR, destImageName);

      // Copier l'image
      fs.copyFileSync(sourceImage, destImagePath);
      console.log(
        `Image copiée pour ${product.name}: ${sourceImage} -> ${destImagePath}`
      );

      // Mettre à jour le chemin de l'image dans les données du produit
      return {
        ...product,
        image: `/images/products/chichkhane/${destImageName}`,
      };
    });

    // Écrire le fichier mis à jour
    const fileContent = `// Generated from local jewelry images
// Création: ${new Date().toISOString()}

export const chichkhaneCollections = ${JSON.stringify(updatedProducts, null, 2)};
`;

    fs.writeFileSync(chichkhaneDataPath, fileContent);
    console.log(`Données Chichkhane mises à jour dans ${chichkhaneDataPath}`);

    return updatedProducts;
  } catch (error) {
    console.error(`Erreur lors de la copie des images: ${error.message}`);
    return null;
  }
}

// Fonction principale
function main() {
  console.log("Démarrage de la copie des images pour Chichkhane...");
  const updatedProducts = copyJewelryImages();

  if (updatedProducts) {
    console.log(`${updatedProducts.length} produits mis à jour avec succès`);
  }

  console.log("Terminé");
}

// Exécuter la fonction principale
main();
