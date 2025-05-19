const fs = require("fs");
const path = require("path");

function integrateChatCollections() {
  try {
    // Check if we have scraped Chichkhane data
    const chichkhaneDataPath = path.join(
      __dirname,
      "../src/data/chichkhaneCollections.js"
    );

    if (!fs.existsSync(chichkhaneDataPath)) {
      console.error(
        "Chichkhane collections data not found. Run scraping script first."
      );
      return;
    }

    // Find the existing collections file
    let collectionsPath = "";
    const possiblePaths = [
      path.join(__dirname, "../src/data/collections.js"),
      path.join(__dirname, "../src/data/collections.ts"),
      path.join(__dirname, "../src/data/collectionsData.js"),
      path.join(__dirname, "../src/data/collectionsData.ts"),
    ];

    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        collectionsPath = path;
        break;
      }
    }

    if (!collectionsPath) {
      console.error(
        "Could not find collections data file. Create a new one instead."
      );

      // Create a new collections file
      collectionsPath = path.join(__dirname, "../src/data/collections.js");
      fs.writeFileSync(
        collectionsPath,
        `
// Collections data
export const collections = [];
      `.trim()
      );
    }

    // Create a backup of the current collections file
    const backupPath = collectionsPath + ".backup-" + Date.now();
    fs.copyFileSync(collectionsPath, backupPath);
    console.log(`Created backup of collections at ${backupPath}`);

    // Read the chichkhane collections file directly as text
    // and extract the array using regex instead of requiring the module
    const chichkhaneFileContent = fs.readFileSync(chichkhaneDataPath, "utf8");
    const arrayMatch = chichkhaneFileContent.match(
      /export\s+const\s+chichkhaneCollections\s*=\s*(\[[\s\S]*?\]);/
    );

    if (!arrayMatch) {
      throw new Error("Could not find chichkhaneCollections array in the file");
    }

    // Parse the array content
    const arrayString = arrayMatch[1];
    let chichkhaneCollections;
    try {
      // Use eval in a controlled way just to parse the JSON-like array
      // This is safe because we control the input file
      chichkhaneCollections = eval(`(${arrayString})`);
    } catch (error) {
      throw new Error(
        `Failed to parse chichkhaneCollections: ${error.message}`
      );
    }

    // Read the existing collections file
    let collectionsFileContent = fs.readFileSync(collectionsPath, "utf8");

    // Check if we can find an array definition
    const collectionsArrayMatch = collectionsFileContent.match(
      /export\s+const\s+collections\s*=\s*\[([\s\S]*?)\];/
    );

    if (!collectionsArrayMatch) {
      console.error(
        "Could not find collections array in the file. Creating a new one."
      );
      collectionsFileContent = `
// Collections data
export const collections = [];
      `.trim();
    }

    // Create the new collection items to add
    const newCollectionItems = chichkhaneCollections.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        price: item.price,
        category: item.category,
        source: "Chichkhane",
      };
    });

    // Format the new items as a string for insertion
    const newItemsString = JSON.stringify(newCollectionItems, null, 2)
      .replace(/^\[/g, "")
      .replace(/\]$/g, "")
      .trim();

    // Update the collections file
    let updatedContent;

    if (collectionsArrayMatch) {
      // If we found an existing array, add the new items
      const arrayContent = collectionsArrayMatch[1].trim();
      const hasItems = arrayContent.length > 0;

      updatedContent = collectionsFileContent.replace(
        /export\s+const\s+collections\s*=\s*\[([\s\S]*?)\];/,
        `export const collections = [${hasItems ? arrayContent + ",\n  " : "\n  "}${newItemsString}\n];`
      );
    } else {
      // Otherwise, create a new array with our items
      updatedContent = `
// Collections data
export const collections = [
  ${newItemsString}
];
      `.trim();
    }

    // Write the updated content back to the file
    fs.writeFileSync(collectionsPath, updatedContent);

    console.log(
      `Successfully integrated ${newCollectionItems.length} Chichkhane items into the collections.`
    );
    console.log(`Updated collections file: ${collectionsPath}`);

    // Add a note about any potential formatting issues
    console.log(
      "\nNote: You may need to check the formatting of the updated collections file."
    );
    console.log(
      "If there are any issues, you can restore from the backup file."
    );
  } catch (error) {
    console.error("Error integrating collections:", error);
  }
}

integrateChatCollections();
