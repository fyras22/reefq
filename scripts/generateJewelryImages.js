const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// Chemins des répertoires
const OUTPUT_DIR = path.join(
  process.cwd(),
  "public/images/products/chichkhane"
);
const DATA_DIR = path.join(process.cwd(), "src/data");

// Palettes de couleurs pour différentes catégories de bijoux
const COLOR_PALETTES = {
  Ensemble: {
    background: ["#F5E9D9", "#F8F0E5", "#FCF7ED"],
    accent: ["#D4AF37", "#CFB53B", "#FFDF00"],
    text: "#5D4037",
  },
  Bracelet: {
    background: ["#E1F5FE", "#E8F5E9", "#F3E5F5"],
    accent: ["#00ACC1", "#26A69A", "#AB47BC"],
    text: "#37474F",
  },
  Collier: {
    background: ["#FFF3E0", "#FFEBEE", "#FFF8E1"],
    accent: ["#FF8A65", "#EC407A", "#FFB74D"],
    text: "#424242",
  },
  Bague: {
    background: ["#E0F7FA", "#F1F8E9", "#E8EAF6"],
    accent: ["#26C6DA", "#7CB342", "#5C6BC0"],
    text: "#455A64",
  },
  Boucles: {
    background: ["#E8F5E9", "#F3E5F5", "#E3F2FD"],
    accent: ["#66BB6A", "#AB47BC", "#42A5F5"],
    text: "#263238",
  },
  Pendentif: {
    background: ["#FFEBEE", "#F3E5F5", "#E0F2F1"],
    accent: ["#EF5350", "#9C27B0", "#26A69A"],
    text: "#37474F",
  },
  Parure: {
    background: ["#E8EAF6", "#FFF8E1", "#F9FBE7"],
    accent: ["#3F51B5", "#FBC02D", "#9E9D24"],
    text: "#212121",
  },
  default: {
    background: ["#ECEFF1", "#F5F5F5", "#FAFAFA"],
    accent: ["#78909C", "#9E9E9E", "#BDBDBD"],
    text: "#37474F",
  },
};

// Créer les répertoires nécessaires
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Répertoire créé: ${directory}`);
  }
}

// Dessiner un symbole de bijou basé sur la catégorie
function drawJewelrySymbol(ctx, category, x, y, size) {
  ctx.save();
  ctx.translate(x, y);

  const palette = COLOR_PALETTES[category] || COLOR_PALETTES.default;
  const accentColor = palette.accent[0];

  ctx.strokeStyle = accentColor;
  ctx.fillStyle = accentColor;
  ctx.lineWidth = size / 20;

  switch (category) {
    case "Bague":
      // Dessiner une bague
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Pierre
      ctx.beginPath();
      ctx.arc(0, 0, size / 5, 0, Math.PI * 2);
      ctx.fill();

      // Éclat
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(-size / 10, -size / 10, size / 15, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "Collier":
      // Dessiner un collier
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, Math.PI * 0.2, Math.PI * 0.8, false);
      ctx.stroke();

      // Pendentif
      ctx.beginPath();
      ctx.moveTo(0, size / 6);
      ctx.lineTo(-size / 8, size / 2);
      ctx.lineTo(size / 8, size / 2);
      ctx.closePath();
      ctx.fill();
      break;

    case "Bracelet":
      // Dessiner un bracelet
      ctx.beginPath();
      ctx.ellipse(0, 0, size / 2, size / 3, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Quelques détails
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x = Math.cos(angle) * (size / 2);
        const y = Math.sin(angle) * (size / 3);

        ctx.beginPath();
        ctx.arc(x, y, size / 15, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case "Boucles":
      // Dessiner des boucles d'oreilles
      // Première boucle
      ctx.beginPath();
      ctx.arc(-size / 3, 0, size / 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-size / 3, size / 4, size / 10, 0, Math.PI * 2);
      ctx.fill();

      // Deuxième boucle
      ctx.beginPath();
      ctx.arc(size / 3, 0, size / 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(size / 3, size / 4, size / 10, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "Ensemble":
    case "Parure":
      // Dessiner un ensemble/parure comme combinaison
      // Bague au centre
      ctx.beginPath();
      ctx.arc(0, 0, size / 4, 0, Math.PI * 2);
      ctx.stroke();

      // Collier au-dessus
      ctx.beginPath();
      ctx.arc(0, -size / 4, size / 6, Math.PI * 0.2, Math.PI * 0.8, false);
      ctx.stroke();

      // Boucles sur les côtés
      ctx.beginPath();
      ctx.arc(-size / 3, 0, size / 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(size / 3, 0, size / 8, 0, Math.PI * 2);
      ctx.stroke();

      // Bracelet en bas
      ctx.beginPath();
      ctx.ellipse(0, size / 3, size / 5, size / 8, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;

    default:
      // Dessin par défaut pour les autres catégories
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Détail
      ctx.beginPath();
      ctx.moveTo(-size / 3, -size / 3);
      ctx.lineTo(size / 3, size / 3);
      ctx.moveTo(-size / 3, size / 3);
      ctx.lineTo(size / 3, -size / 3);
      ctx.stroke();
  }

  ctx.restore();
}

// Générer une image attrayante pour un produit
async function generateJewelryImage(product, outputPath) {
  const width = 800;
  const height = 800;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Obtenir la palette de couleurs pour cette catégorie
  const category = product.category || "default";
  const palette = COLOR_PALETTES[category] || COLOR_PALETTES.default;

  // Générer un index basé sur l'ID du produit
  const productIndex = parseInt(product.id.split("_")[1]) - 1 || 0;

  // Sélectionner une couleur de fond et d'accent basée sur l'index
  const bgColorIndex = productIndex % palette.background.length;
  const accentColorIndex = productIndex % palette.accent.length;
  const bgColor = palette.background[bgColorIndex];
  const accentColor = palette.accent[accentColorIndex];

  // Remplir le fond
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Ajouter des éléments de design (formes géométriques subtiles)
  ctx.fillStyle = accentColor + "15"; // 15 = 10% d'opacité en hexadécimal

  // Quelques cercles ou formes décoratives
  for (let i = 0; i < 5; i++) {
    const size = Math.random() * 300 + 100;
    const x = Math.random() * width;
    const y = Math.random() * height;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dessiner le symbole du bijou
  drawJewelrySymbol(ctx, category, width / 2, height / 2 - 50, 200);

  // Logo de marque stylisé
  ctx.fillStyle = accentColor;
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("CHICHKHANE", width / 2, height - 120);

  // Ligne décorative
  ctx.beginPath();
  ctx.moveTo(width / 3, height - 100);
  ctx.lineTo((width * 2) / 3, height - 100);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Afficher le nom du produit
  ctx.fillStyle = palette.text;
  ctx.font = "bold 28px Arial";
  ctx.fillText(product.name, width / 2, height - 60);

  // Afficher la catégorie
  ctx.font = "20px Arial";
  ctx.fillText(category, width / 2, height - 30);

  // Écrire l'image dans un fichier
  const buffer = canvas.toBuffer("image/jpeg", { quality: 0.9 });
  fs.writeFileSync(outputPath, buffer);

  console.log(`Image générée: ${outputPath}`);
}

// Générer les images pour tous les produits Chichkhane
async function generateAllJewelryImages() {
  try {
    // Assurer que le répertoire de sortie existe
    ensureDirectoryExists(OUTPUT_DIR);

    // Lire le fichier de données des produits Chichkhane
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
      const categories = Object.keys(COLOR_PALETTES).filter(
        (cat) => cat !== "default"
      );

      chichkhaneProducts = Array.from({ length: 10 }, (_, i) => {
        const category = categories[i % categories.length];
        return {
          id: `chichkhane_${i + 1}`,
          name: `${category} Diamants ${String.fromCharCode(65 + (i % 26))}${Math.floor(Math.random() * 1000)}`,
          description: `Magnifique ${category.toLowerCase()} en diamants de la collection Chichkhane`,
          price: `${Math.floor(Math.random() * 5000 + 500)} TND`,
          category,
          source: "Chichkhane",
        };
      });
    }

    // Générer une image pour chaque produit
    const updatedProducts = [];

    for (const product of chichkhaneProducts) {
      const imageName = `chichkhane_${product.id.split("_")[1]}.jpg`;
      const imagePath = path.join(OUTPUT_DIR, imageName);

      await generateJewelryImage(product, imagePath);

      updatedProducts.push({
        ...product,
        image: `/images/products/chichkhane/${imageName}`,
      });
    }

    // Écrire le fichier de données mis à jour
    const fileContent = `// Generated with enhanced jewelry images
// Création: ${new Date().toISOString()}

export const chichkhaneCollections = ${JSON.stringify(updatedProducts, null, 2)};
`;

    fs.writeFileSync(chichkhaneDataPath, fileContent);
    console.log(`Données Chichkhane mises à jour dans ${chichkhaneDataPath}`);

    return updatedProducts;
  } catch (error) {
    console.error(`Erreur lors de la génération des images: ${error.message}`);
    return null;
  }
}

// Fonction principale
async function main() {
  console.log("Démarrage de la génération des images pour Chichkhane...");
  const updatedProducts = await generateAllJewelryImages();

  if (updatedProducts) {
    console.log(`${updatedProducts.length} produits mis à jour avec succès`);
  }

  console.log("Terminé");
}

// Exécuter la fonction principale
main().catch(console.error);
