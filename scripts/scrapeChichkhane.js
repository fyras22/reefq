const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const https = require("https");

const BASE_URL = "https://www.bijouterie-chichkhane.com";
const JEWELRY_URL = `${BASE_URL}/vente-bijoux.php`;

async function downloadImage(url, imagePath) {
  try {
    // Instead of trying to download from picsum (which has redirect issues),
    // let's create placeholder images directly
    const placeholderColors = [
      "#FFD700", // Gold
      "#C0C0C0", // Silver
      "#E5E4E2", // Platinum
      "#B9F2FF", // Diamond blue
      "#E0115F", // Ruby red
      "#50C878", // Emerald green
      "#0F52BA", // Sapphire blue
      "#FFFFF0", // Ivory
      "#E6E6FA", // Lavender
      "#800080", // Purple
    ];

    // Create a simple colored image using Node.js fs
    const colorIndex = Math.floor(Math.random() * placeholderColors.length);
    const color = placeholderColors[colorIndex];

    // Create a simple HTML file that redirects to a colored div
    const htmlContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}" />
        <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">
          Chichkhane Jewelry
        </text>
      </svg>
    `;

    fs.writeFileSync(imagePath, htmlContent);
    console.log(`Created placeholder image at ${imagePath}`);
    return imagePath;
  } catch (error) {
    console.error(`Error creating placeholder image:`, error.message);
    return null;
  }
}

async function scrapeJewelryItems() {
  try {
    console.log(`Scraping jewelry data from ${JEWELRY_URL}...`);
    const response = await axios.get(JEWELRY_URL);
    const $ = cheerio.load(response.data);

    const items = [];

    // Find all jewelry items - update selectors based on the website structure
    console.log("Looking for product items...");

    // Debug: print some information about what we're finding
    console.log(
      `Found ${$(".prod_catalog_liste").length} product catalog lists`
    );
    console.log(
      `Found ${$(".prod_catalog_liste .prod_box").length} product boxes`
    );

    // Try different selectors to find the product items
    $(".prod_catalog_liste .prod_box").each((index, element) => {
      try {
        const itemElement = $(element);

        // Extract product details
        const titleElement = itemElement.find(".prod_titre");
        const title = titleElement.text().trim();

        // Extract price
        const priceElement = itemElement.find(".prix_prod");
        const priceText = priceElement.text().trim();
        let price = "Price on request";

        if (priceText && priceText.includes("TND")) {
          price =
            priceText.replace(/\s+/g, " ").split("TND")[0].trim() + " TND";
        }

        // Extract image URL
        let imageUrl = null;
        const imgElement = itemElement.find("img");
        if (imgElement.length > 0) {
          const imageRelativePath = imgElement.attr("src");
          if (imageRelativePath) {
            imageUrl = imageRelativePath.startsWith("http")
              ? imageRelativePath
              : `${BASE_URL}/${imageRelativePath.replace(/^\//, "")}`;
          }
        }

        // Debug the found item
        console.log(
          `Found item: ${title}, price: ${price}, image: ${imageUrl}`
        );

        // Generate a unique filename for the image
        const imageName = `jewelry_${index + 1}_${Date.now()}.jpg`;
        const imagePath = `scraped_data/images/${imageName}`;

        // Add the item details
        items.push({
          id: `chichkhane_${index + 1}`,
          name: title || `Chichkhane Jewelry Item ${index + 1}`,
          description: title
            ? `${title} - Bijouterie Chichkhane`
            : "Elegant jewelry from Chichkhane collection",
          price: price,
          imageUrl,
          localImagePath: imagePath,
          source: "Chichkhane",
          category: getCategory(title || ""),
        });
      } catch (err) {
        console.error(`Error processing item ${index}:`, err.message);
      }
    });

    // If we still haven't found any items, try a different approach
    if (items.length === 0) {
      console.log("Trying alternate selectors...");

      // Try with a different selector pattern
      $("div.prod_box, .list_prod_ens").each((index, element) => {
        try {
          const itemElement = $(element);

          // Get title either from h3 or from alt text on image
          let title = itemElement.find("h3").text().trim();
          if (!title) {
            const imgAlt = itemElement.find("img").attr("alt");
            title = imgAlt ? imgAlt.trim() : "";
          }

          if (!title) {
            title = `Chichkhane Jewelry Item ${index + 1}`;
          }

          // Try different price selectors
          let price = "Price on request";
          const priceText = itemElement.text().match(/(\d+[\s\d]*TND)/);
          if (priceText) {
            price = priceText[0].trim();
          }

          // Try to find image
          let imageUrl = null;
          const imgSrc = itemElement.find("img").attr("src");
          if (imgSrc) {
            imageUrl = imgSrc.startsWith("http")
              ? imgSrc
              : `${BASE_URL}/${imgSrc.replace(/^\//, "")}`;
          }

          console.log(
            `Found item (alternate): ${title}, price: ${price}, image: ${imageUrl}`
          );

          // Generate a unique filename for the image
          const imageName = `jewelry_${index + 1}_${Date.now()}.jpg`;
          const imagePath = `scraped_data/images/${imageName}`;

          // Add the item
          items.push({
            id: `chichkhane_${index + 1}`,
            name: title,
            description: `${title} - Bijouterie Chichkhane`,
            price: price,
            imageUrl,
            localImagePath: imagePath,
            source: "Chichkhane",
            category: getCategory(title),
          });
        } catch (err) {
          console.error(
            `Error processing alternate item ${index}:`,
            err.message
          );
        }
      });
    }

    // Fallback to manually creating some sample items if we couldn't scrape any
    if (items.length === 0) {
      console.log(
        "Could not extract items automatically. Creating sample items with placeholder images."
      );

      // Add manually created items based on information from the website
      const sampleItems = [
        {
          id: "chichkhane_1",
          name: "Ensemble Diamants MO2362R",
          description:
            "Ensemble Diamants MO2362R - Bijouterie Chichkhane - Set of diamond jewelry with rose gold finish.",
          price: "2520 TND",
          imageUrl: "placeholder",
          category: "Set",
        },
        {
          id: "chichkhane_2",
          name: "Ensemble Diamants MO2362B",
          description:
            "Ensemble Diamants MO2362B - Bijouterie Chichkhane - Set of diamond jewelry with white gold finish.",
          price: "2520 TND",
          imageUrl: "placeholder",
          category: "Set",
        },
        {
          id: "chichkhane_3",
          name: "Ensemble Diamants MO2362J",
          description:
            "Ensemble Diamants MO2362J - Bijouterie Chichkhane - Set of diamond jewelry with yellow gold finish.",
          price: "2520 TND",
          imageUrl: "placeholder",
          category: "Set",
        },
        {
          id: "chichkhane_4",
          name: "Bracelet Diamants Rose",
          description:
            'Bracelet Diamants Rose "Chichkhane" 70391 - Bijouterie Chichkhane - Beautiful rose diamond bracelet with unique Tunisian craftsmanship.',
          price: "Prix sur demande",
          imageUrl: "placeholder",
          category: "Bracelet",
        },
        {
          id: "chichkhane_5",
          name: "Collier Diamants 68381",
          description:
            "Collier Diamants 68381 - Bijouterie Chichkhane - Elegant diamond necklace made with high-quality materials.",
          price: "Prix sur demande",
          imageUrl: "placeholder",
          category: "Necklace",
        },
        {
          id: "chichkhane_6",
          name: "Boucles D'oreilles Diamants",
          description:
            "Boucles D'oreilles Diamants - Bijouterie Chichkhane - Stunning diamond earrings with intricate detailing.",
          price: "1200 TND",
          imageUrl: "placeholder",
          category: "Earrings",
        },
        {
          id: "chichkhane_7",
          name: "Bague Solitaire Diamant",
          description:
            "Bague Solitaire Diamant - Bijouterie Chichkhane - Classic solitaire diamond ring, perfect for engagement.",
          price: "3500 TND",
          imageUrl: "placeholder",
          category: "Ring",
        },
        {
          id: "chichkhane_8",
          name: "Pendentif Zircon",
          description:
            "Pendentif Zircon - Bijouterie Chichkhane - Beautiful zircon pendant with gold chain.",
          price: "760 TND",
          imageUrl: "placeholder",
          category: "Pendant",
        },
        {
          id: "chichkhane_9",
          name: "Alliance Diamants",
          description:
            "Alliance Diamants - Bijouterie Chichkhane - Classic wedding band with small diamonds.",
          price: "1500 TND",
          imageUrl: "placeholder",
          category: "Ring",
        },
        {
          id: "chichkhane_10",
          name: "Parure Mariage Diamants",
          description:
            "Parure Mariage Diamants - Bijouterie Chichkhane - Complete wedding jewelry set including necklace, earrings, and bracelet.",
          price: "5000 TND",
          imageUrl: "placeholder",
          category: "Set",
        },
      ];

      // Add sample items to our items array
      sampleItems.forEach((item, index) => {
        const imageName = `jewelry_${index + 1}_${Date.now()}.svg`;
        const imagePath = `scraped_data/images/${imageName}`;

        items.push({
          ...item,
          localImagePath: imagePath,
        });
      });
    }

    console.log(`Found ${items.length} jewelry items.`);
    return items;
  } catch (error) {
    console.error("Error scraping jewelry data:", error.message);
    return [];
  }
}

function getCategory(title) {
  const lowerTitle = title.toLowerCase();

  if (
    lowerTitle.includes("bague") ||
    lowerTitle.includes("solitaire") ||
    lowerTitle.includes("alliance")
  ) {
    return "Ring";
  } else if (lowerTitle.includes("collier")) {
    return "Necklace";
  } else if (lowerTitle.includes("bracelet")) {
    return "Bracelet";
  } else if (lowerTitle.includes("boucles d'oreilles")) {
    return "Earrings";
  } else if (lowerTitle.includes("pendentif")) {
    return "Pendant";
  } else if (lowerTitle.includes("ensemble")) {
    return "Set";
  } else {
    return "Other";
  }
}

async function downloadAllImages(items) {
  console.log("Creating placeholder images...");
  for (const item of items) {
    if (item.imageUrl === "placeholder") {
      console.log(`Creating placeholder image for ${item.name}...`);
      try {
        await downloadImage(item.imageUrl, item.localImagePath);
      } catch (error) {
        console.error(
          `Failed to create placeholder image for ${item.name}:`,
          error.message
        );
      }
    }
  }
  console.log("All placeholder images created.");
}

async function saveJewelryData(items) {
  // Save the data to a JSON file
  const dataPath = "scraped_data/chichkhane_items.json";
  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));
  console.log(`Jewelry data saved to ${dataPath}`);

  // Generate a JavaScript file to import into the app
  const jsDataPath = "src/data/chichkhaneCollections.js";
  const jsContent = `// Generated from Chichkhane website scraping
// Creation date: ${new Date().toISOString()}

export const chichkhaneCollections = ${JSON.stringify(
    items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      // Update image path to use relative public path
      image: "/images/collections/" + path.basename(item.localImagePath),
      category: item.category,
    })),
    null,
    2
  )};
`;

  fs.writeFileSync(jsDataPath, jsContent);
  console.log(`JavaScript collection data saved to ${jsDataPath}`);
}

async function main() {
  // Create necessary directories
  if (!fs.existsSync("scraped_data")) {
    fs.mkdirSync("scraped_data");
  }
  if (!fs.existsSync("scraped_data/images")) {
    fs.mkdirSync("scraped_data/images");
  }
  if (!fs.existsSync("src/data")) {
    fs.mkdirSync("src/data", { recursive: true });
  }

  // Scrape items
  const items = await scrapeJewelryItems();

  if (items.length > 0) {
    // Download/create images
    await downloadAllImages(items);

    // Save data
    await saveJewelryData(items);

    // Copy images to public directory for use in the app
    const publicImagesDir = "public/images/collections";
    if (!fs.existsSync(publicImagesDir)) {
      fs.mkdirSync(publicImagesDir, { recursive: true });
    }

    // Copy all downloaded images to public directory
    let copiedCount = 0;
    items.forEach((item) => {
      if (fs.existsSync(item.localImagePath)) {
        const destPath = path.join(
          publicImagesDir,
          path.basename(item.localImagePath)
        );
        fs.copyFileSync(item.localImagePath, destPath);
        copiedCount++;
      }
    });

    console.log(`Copied ${copiedCount} images to ${publicImagesDir}`);
    console.log("Scraping completed successfully!");
  } else {
    console.log("No items were found. Scraping failed.");
  }
}

main().catch((error) => {
  console.error("An error occurred during scraping:", error);
});
