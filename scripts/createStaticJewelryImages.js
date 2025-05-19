const fs = require("fs");
const path = require("path");

// Chemins des répertoires
const PUBLIC_DIR = path.join(process.cwd(), "public");
const SVG_DIR = path.join(PUBLIC_DIR, "images/products/chichkhane");
const DATA_DIR = path.join(process.cwd(), "src/data");

// Palettes de couleurs pour différentes catégories de bijoux
const COLOR_PALETTES = {
  Ensemble: {
    background: "#F5E9D9",
    accent: "#D4AF37",
    text: "#5D4037",
  },
  Bracelet: {
    background: "#E1F5FE",
    accent: "#00ACC1",
    text: "#37474F",
  },
  Collier: {
    background: "#FFF3E0",
    accent: "#FF8A65",
    text: "#424242",
  },
  Bague: {
    background: "#E0F7FA",
    accent: "#26C6DA",
    text: "#455A64",
  },
  Boucles: {
    background: "#E8F5E9",
    accent: "#66BB6A",
    text: "#263238",
  },
  Pendentif: {
    background: "#FFEBEE",
    accent: "#EF5350",
    text: "#37474F",
  },
  Parure: {
    background: "#E8EAF6",
    accent: "#3F51B5",
    text: "#212121",
  },
  default: {
    background: "#ECEFF1",
    accent: "#78909C",
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

// Générer une image SVG statique pour un produit
function generateJewelrySvg(product, outputPath) {
  const category = product.category || "default";
  const palette = COLOR_PALETTES[category] || COLOR_PALETTES.default;

  // Obtenir les initiales du produit pour afficher dans l'image
  const initials = product.name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Créer le contenu SVG
  const svgContent = `
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${palette.background}" />
  
  <!-- Cercles décoratifs -->
  <circle cx="400" cy="350" r="200" fill="${palette.accent}15" />
  <circle cx="200" cy="500" r="150" fill="${palette.accent}10" />
  <circle cx="600" cy="200" r="180" fill="${palette.accent}10" />
  
  <!-- Cercle central avec initiales -->
  <circle cx="400" cy="350" r="120" fill="${palette.accent}30" />
  <text x="400" y="380" font-family="Arial, sans-serif" font-size="100" font-weight="bold" fill="${palette.accent}" text-anchor="middle">${initials}</text>
  
  <!-- Nom du produit -->
  <text x="400" y="650" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${palette.text}" text-anchor="middle">${product.name}</text>
  
  <!-- Catégorie -->
  <text x="400" y="690" font-family="Arial, sans-serif" font-size="20" fill="${palette.text}" text-anchor="middle">${category}</text>
  
  <!-- Logo et ligne décorative -->
  <text x="400" y="580" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${palette.accent}" text-anchor="middle">CHICHKHANE</text>
  <line x1="266" y1="600" x2="533" y2="600" stroke="${palette.accent}" stroke-width="2" />
</svg>
  `.trim();

  // Écrire le fichier SVG
  fs.writeFileSync(outputPath, svgContent);
  console.log(`Image SVG créée: ${outputPath}`);
}

// Générer les métadonnées et images SVG pour tous les produits Chichkhane
function generateJewelryData() {
  try {
    // Assurer que le répertoire de sortie existe
    ensureDirectoryExists(SVG_DIR);

    // Définir les catégories et les produits
    const categories = [
      "Ensemble",
      "Bracelet",
      "Collier",
      "Bague",
      "Boucles",
      "Pendentif",
      "Parure",
    ];

    const products = [
      {
        id: "chichkhane_1",
        name: "Ensemble Diamants MO2362R",
        category: "Ensemble",
        price: "2520 TND",
      },
      {
        id: "chichkhane_2",
        name: "Ensemble Diamants MO2362B",
        category: "Ensemble",
        price: "2520 TND",
      },
      {
        id: "chichkhane_3",
        name: "Ensemble Diamants MO2362J",
        category: "Ensemble",
        price: "2520 TND",
      },
      {
        id: "chichkhane_4",
        name: 'Bracelet Diamants Rose "Chichkhane" 70391',
        category: "Bracelet",
        price: "Prix sur demande",
      },
      {
        id: "chichkhane_5",
        name: "Collier Diamants 68381",
        category: "Collier",
        price: "Prix sur demande",
      },
      {
        id: "chichkhane_6",
        name: "Boucles D'oreilles Diamants",
        category: "Boucles",
        price: "1200 TND",
      },
      {
        id: "chichkhane_7",
        name: "Bague Solitaire Diamant",
        category: "Bague",
        price: "3500 TND",
      },
      {
        id: "chichkhane_8",
        name: "Pendentif Zircon",
        category: "Pendentif",
        price: "760 TND",
      },
      {
        id: "chichkhane_9",
        name: "Alliance Diamants",
        category: "Bague",
        price: "1500 TND",
      },
      {
        id: "chichkhane_10",
        name: "Parure Mariage Diamants",
        category: "Parure",
        price: "5000 TND",
      },
    ];

    // Ajouter des descriptions aux produits
    const productsWithDetails = products.map((product) => ({
      ...product,
      description: `${product.name} - Bijouterie Chichkhane - Bijou élégant en ${product.category.toLowerCase()} de haute qualité.`,
      source: "Chichkhane",
    }));

    // Générer une image SVG pour chaque produit
    const updatedProducts = [];

    for (const product of productsWithDetails) {
      const svgName = `${product.id}.svg`;
      const svgPath = path.join(SVG_DIR, svgName);

      generateJewelrySvg(product, svgPath);

      updatedProducts.push({
        ...product,
        image: `/images/products/chichkhane/${svgName}`,
      });
    }

    // Écrire le fichier de données mis à jour
    const chichkhaneDataPath = path.join(DATA_DIR, "chichkhaneCollections.js");
    const fileContent = `// Generated with static SVG jewelry images
// Création: ${new Date().toISOString()}

export const chichkhaneCollections = ${JSON.stringify(updatedProducts, null, 2)};
`;

    fs.writeFileSync(chichkhaneDataPath, fileContent);
    console.log(`Données Chichkhane mises à jour dans ${chichkhaneDataPath}`);

    return updatedProducts;
  } catch (error) {
    console.error(`Erreur lors de la génération des données: ${error.message}`);
    return null;
  }
}

// Fonction principale
function main() {
  console.log(
    "Démarrage de la génération des données et images pour Chichkhane..."
  );
  const updatedProducts = generateJewelryData();

  if (updatedProducts) {
    console.log(`${updatedProducts.length} produits mis à jour avec succès`);
  }

  console.log("Terminé");
}

// Exécuter la fonction principale
main();
