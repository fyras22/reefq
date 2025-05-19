const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { createCanvas } = require("canvas");

const BASE_URL = "https://www.bijouterie-chichkhane.com";
const TARGET_URL = `${BASE_URL}/vente-bijoux.php`;
const IMAGE_OUTPUT_DIR = path.join(
  process.cwd(),
  "public/images/products/chichkhane"
);
const DATA_OUTPUT_DIR = path.join(process.cwd(), "src/data");

// Tableau d'URLs d'images réelles de bijoux à utiliser comme fallback
const REAL_JEWELRY_IMAGES = {
  Ensemble: [
    "https://i.imgur.com/JgU7K2Q.jpg", // Jewelry set 1
    "https://i.imgur.com/2Xy4XQF.jpg", // Jewelry set 2
    "https://i.imgur.com/XL0XGxO.jpg", // Jewelry set 3
  ],
  Bracelet: [
    "https://i.imgur.com/C4VuJN9.jpg", // Diamond bracelet
    "https://i.imgur.com/UIfA3Xu.jpg", // Gold bracelet
  ],
  Collier: [
    "https://i.imgur.com/nICv8RM.jpg", // Diamond necklace
    "https://i.imgur.com/7rr9TJu.jpg", // Pearl necklace
  ],
  Boucles: [
    "https://i.imgur.com/fhXwVdx.jpg", // Diamond earrings
    "https://i.imgur.com/kXlp8o2.jpg", // Gold earrings
  ],
  Bague: [
    "https://i.imgur.com/CVU9BH8.jpg", // Diamond ring
    "https://i.imgur.com/w7Xd5d5.jpg", // Gold ring
    "https://i.imgur.com/i2lwbJD.jpg", // Silver ring
  ],
  Pendentif: [
    "https://i.imgur.com/W10nIWr.jpg", // Diamond pendant
    "https://i.imgur.com/XaZIuiq.jpg", // Gold pendant
  ],
  Parure: [
    "https://i.imgur.com/vNUkCvk.jpg", // Wedding set
    "https://i.imgur.com/httvFvJ.jpg", // Diamond set
  ],
  default: [
    "https://i.imgur.com/K5lToSK.jpg", // Generic jewelry 1
    "https://i.imgur.com/1WbFhfJ.jpg", // Generic jewelry 2
    "https://i.imgur.com/JmJT0Xo.jpg", // Generic jewelry 3
  ],
};

// Créer les répertoires de sortie s'ils n'existent pas
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Répertoire créé: ${directory}`);
  }
}

// Télécharger une image depuis une URL
async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    // Si l'URL est relative, la préfixer avec le domaine de base
    const fullUrl = url.startsWith("http")
      ? url
      : `${BASE_URL}/${url.replace(/^\//, "")}`;

    console.log(`Téléchargement de l'image depuis ${fullUrl}`);

    // Créer une requête pour télécharger l'image
    https
      .get(fullUrl, (response) => {
        // Vérifier si la requête a réussi
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Échec du téléchargement de l'image. Code de statut: ${response.statusCode}`
            )
          );
          return;
        }

        // Créer un flux pour écrire l'image
        const fileStream = fs.createWriteStream(outputPath);

        // Transférer les données de la réponse vers le fichier
        response.pipe(fileStream);

        // Gérer les événements du flux
        fileStream.on("finish", () => {
          fileStream.close();
          console.log(`Image téléchargée avec succès: ${outputPath}`);
          resolve(outputPath);
        });

        fileStream.on("error", (err) => {
          fs.unlink(outputPath, () => {}); // Nettoyer en cas d'erreur
          reject(err);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Créer une image placeholder pour les bijoux sans image
function createPlaceholderImage(name, category, id, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      // Définir la taille de l'image
      const width = 600;
      const height = 600;

      // Créer un canvas
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Définir des couleurs pour différentes catégories
      const categoryColors = {
        Ensemble: "#FFD700", // Or
        Bracelet: "#C0C0C0", // Argent
        Collier: "#E0115F", // Rouge rubis
        Bague: "#50C878", // Vert émeraude
        Pendentif: "#0F52BA", // Bleu saphir
        Boucles: "#B9F2FF", // Bleu diamant
        Parure: "#800080", // Violet
        Solitaire: "#E5E4E2", // Platine
        default: "#F5F5F5", // Gris clair
      };

      // Déterminer la couleur en fonction de la catégorie
      let bgColor = categoryColors.default;
      for (const [cat, color] of Object.entries(categoryColors)) {
        if (category.includes(cat) || name.includes(cat)) {
          bgColor = color;
          break;
        }
      }

      // Remplir le fond
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Ajouter un cercle au centre
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(width / 2, height / 2 - 50, 100, 0, Math.PI * 2);
      ctx.fill();

      // Configuration du texte
      ctx.textAlign = "center";

      // Obtenir les initiales du nom du bijou
      const initials = name
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

      // Ajouter les initiales
      ctx.fillStyle = "#333";
      ctx.font = "bold 80px Arial";
      ctx.fillText(initials, width / 2, height / 2 - 30);

      // Ajouter le nom du bijou
      const displayName =
        name.length > 25 ? name.substring(0, 22) + "..." : name;
      ctx.font = "24px Arial";
      ctx.fillText(displayName, width / 2, height / 2 + 50);

      // Ajouter la catégorie
      ctx.font = "20px Arial";
      ctx.fillText(category, width / 2, height / 2 + 90);

      // Ajouter le texte Chichkhane
      ctx.font = "italic 18px Arial";
      ctx.fillText("Bijouterie Chichkhane", width / 2, height - 40);

      // Écrire l'image dans un fichier
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      out.on("finish", () => {
        console.log(`Image placeholder créée: ${outputPath}`);
        resolve(outputPath);
      });

      out.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Scraper les données des bijoux depuis le site
async function scrapeJewelryData() {
  try {
    console.log(`Scraping data from ${TARGET_URL}`);
    const response = await axios.get(TARGET_URL);
    const $ = cheerio.load(response.data);

    const products = [];
    let productId = 1;

    // Sélectionner tous les éléments de produit
    $(".prod_box").each((index, element) => {
      try {
        const productElem = $(element);

        // Extraire le titre
        const titleElem = productElem.find(".prod_titre");
        const title = titleElem.text().trim();

        // Extraire la catégorie depuis le titre (Ensemble, Bracelet, etc.)
        let category = "Other";
        const categoryMatches = title.match(
          /^(Ensemble|Bracelet|Collier|Bague|Pendentif|Boucles D'oreilles|Parure|Solitaire|Alliance)/i
        );
        if (categoryMatches) {
          category = categoryMatches[1];
        }

        // Extraire le prix
        const priceElem = productElem.find(".prix_prod");
        let price = "Prix sur demande";
        if (priceElem.length) {
          price = priceElem.text().trim().replace(/\\s+/g, " ");
        }

        // Extraire l'URL de l'image
        let imageUrl = null;
        const imgElem = productElem.find("img");
        if (imgElem.length) {
          imageUrl = imgElem.attr("src");
          if (!imageUrl.startsWith("http")) {
            imageUrl = `${BASE_URL}/${imageUrl.replace(/^\//, "")}`;
          }
        }

        // Générer un ID de produit
        const id = `chichkhane_${productId++}`;

        // Ajouter le produit à la liste
        products.push({
          id,
          name: title || `Bijou Chichkhane ${productId}`,
          description: `${title} - Bijouterie Chichkhane - Bijou élégant fabriqué avec des matériaux de haute qualité.`,
          price,
          imageUrl,
          category,
        });

        console.log(`Produit trouvé: ${title}, catégorie: ${category}`);
      } catch (error) {
        console.error(
          `Erreur lors de l'extraction du produit: ${error.message}`
        );
      }
    });

    // Si aucun produit n'a été trouvé, créer des exemples
    if (products.length === 0) {
      console.log("Aucun produit trouvé, création de produits d'exemple");

      const sampleProducts = [
        {
          id: "chichkhane_1",
          name: "Ensemble Diamants MO2362R",
          description:
            "Ensemble Diamants MO2362R - Bijouterie Chichkhane - Set de bijoux diamants avec finition or rose.",
          price: "2520 TND",
          imageUrl: null,
          category: "Ensemble",
        },
        {
          id: "chichkhane_2",
          name: "Ensemble Diamants MO2362B",
          description:
            "Ensemble Diamants MO2362B - Bijouterie Chichkhane - Set de bijoux diamants avec finition or blanc.",
          price: "2520 TND",
          imageUrl: null,
          category: "Ensemble",
        },
        {
          id: "chichkhane_3",
          name: "Ensemble Diamants MO2362J",
          description:
            "Ensemble Diamants MO2362J - Bijouterie Chichkhane - Set de bijoux diamants avec finition or jaune.",
          price: "2520 TND",
          imageUrl: null,
          category: "Ensemble",
        },
        {
          id: "chichkhane_4",
          name: 'Bracelet Diamants Rose "Chichkhane" 70391',
          description:
            'Bracelet Diamants Rose "Chichkhane" 70391 - Bijouterie Chichkhane - Magnifique bracelet diamants roses avec artisanat tunisien unique.',
          price: "Prix sur demande",
          imageUrl: null,
          category: "Bracelet",
        },
        {
          id: "chichkhane_5",
          name: "Collier Diamants 68381",
          description:
            "Collier Diamants 68381 - Bijouterie Chichkhane - Élégant collier diamants fabriqué avec des matériaux de haute qualité.",
          price: "Prix sur demande",
          imageUrl: null,
          category: "Collier",
        },
        {
          id: "chichkhane_6",
          name: "Boucles D'oreilles Diamants",
          description:
            "Boucles D'oreilles Diamants - Bijouterie Chichkhane - Magnifiques boucles d'oreilles diamants avec détails complexes.",
          price: "1200 TND",
          imageUrl: null,
          category: "Boucles",
        },
        {
          id: "chichkhane_7",
          name: "Bague Solitaire Diamant",
          description:
            "Bague Solitaire Diamant - Bijouterie Chichkhane - Bague solitaire diamant classique, parfaite pour les fiançailles.",
          price: "3500 TND",
          imageUrl: null,
          category: "Bague",
        },
        {
          id: "chichkhane_8",
          name: "Pendentif Zircon",
          description:
            "Pendentif Zircon - Bijouterie Chichkhane - Magnifique pendentif zircon avec chaîne en or.",
          price: "760 TND",
          imageUrl: null,
          category: "Pendentif",
        },
        {
          id: "chichkhane_9",
          name: "Alliance Diamants",
          description:
            "Alliance Diamants - Bijouterie Chichkhane - Alliance classique avec petits diamants.",
          price: "1500 TND",
          imageUrl: null,
          category: "Bague",
        },
        {
          id: "chichkhane_10",
          name: "Parure Mariage Diamants",
          description:
            "Parure Mariage Diamants - Bijouterie Chichkhane - Set complet de bijoux de mariage comprenant collier, boucles d'oreilles et bracelet.",
          price: "5000 TND",
          imageUrl: null,
          category: "Parure",
        },
      ];

      products.push(...sampleProducts);
    }

    console.log(`Total de ${products.length} produits trouvés`);
    return products;
  } catch (error) {
    console.error(`Erreur lors du scraping: ${error.message}`);
    return [];
  }
}

// Télécharger une image réelle de bijou pour un produit donné
async function downloadRealJewelryImage(product, outputPath) {
  const category = product.category || "default";

  // Sélectionner une image aléatoire de la catégorie, ou utiliser default si la catégorie n'existe pas
  const images =
    REAL_JEWELRY_IMAGES[category] || REAL_JEWELRY_IMAGES["default"];

  // Utiliser l'index du produit modulo le nombre d'images pour assurer une répartition équilibrée
  const productIndex = parseInt(product.id.split("_")[1]) - 1;
  const imageUrl = images[productIndex % images.length];

  return downloadImage(imageUrl, outputPath);
}

// Télécharger ou créer des images pour tous les produits
async function processImages(products) {
  const processedProducts = [...products];

  for (let i = 0; i < processedProducts.length; i++) {
    const product = processedProducts[i];
    const imageName = `chichkhane_${product.id.split("_")[1]}.jpg`; // Changé en jpg pour les images réelles
    const imagePath = path.join(IMAGE_OUTPUT_DIR, imageName);

    try {
      if (product.imageUrl) {
        // Essayer de télécharger l'image originale du produit
        await downloadImage(product.imageUrl, imagePath);
        product.image = `/images/products/chichkhane/${imageName}`;
      } else {
        // Télécharger une image réelle de bijou de la même catégorie
        await downloadRealJewelryImage(product, imagePath);
        product.image = `/images/products/chichkhane/${imageName}`;
      }
    } catch (error) {
      console.error(
        `Erreur lors du téléchargement de l'image pour ${product.name}: ${error.message}`
      );

      try {
        // En cas d'échec, essayer de télécharger une image par défaut
        await downloadRealJewelryImage(
          { ...product, category: "default" },
          imagePath
        );
        product.image = `/images/products/chichkhane/${imageName}`;
      } catch (fallbackError) {
        console.error(
          `Erreur lors du téléchargement de l'image de secours: ${fallbackError.message}`
        );

        // En dernier recours, créer une image placeholder
        try {
          await createPlaceholderImage(
            product.name,
            product.category,
            product.id,
            imagePath.replace(".jpg", ".png")
          );
          product.image = `/images/products/chichkhane/${imageName.replace(".jpg", ".png")}`;
        } catch (placeholderError) {
          console.error(
            `Erreur lors de la création de l'image placeholder: ${placeholderError.message}`
          );
          product.image = "/images/placeholder-product.svg";
        }
      }
    }
  }

  return processedProducts;
}

// Générer le fichier data pour les produits Chichkhane
function generateProductsDataFile(products) {
  const dataFilePath = path.join(DATA_OUTPUT_DIR, "chichkhaneCollections.js");

  // Préparer les données pour l'export
  const productData = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    source: "Chichkhane",
  }));

  // Créer le contenu du fichier
  const fileContent = `// Generated from Chichkhane website scraping
// Création: ${new Date().toISOString()}

export const chichkhaneCollections = ${JSON.stringify(productData, null, 2)};
`;

  // Écrire le fichier
  fs.writeFileSync(dataFilePath, fileContent);
  console.log(`Données exportées vers ${dataFilePath}`);

  return dataFilePath;
}

// Fonction principale
async function main() {
  try {
    // Créer les répertoires nécessaires
    ensureDirectoryExists(IMAGE_OUTPUT_DIR);
    ensureDirectoryExists(DATA_OUTPUT_DIR);

    // Scraper les données
    const products = await scrapeJewelryData();

    if (products.length === 0) {
      console.error("Aucun produit trouvé. Abandon.");
      return;
    }

    // Traiter les images
    const processedProducts = await processImages(products);

    // Générer le fichier de données
    generateProductsDataFile(processedProducts);

    console.log("Scraping terminé avec succès!");
  } catch (error) {
    console.error(`Erreur dans le processus principal: ${error.message}`);
  }
}

// Exécuter la fonction principale
main().catch(console.error);
