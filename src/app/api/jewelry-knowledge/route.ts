import { NextResponse } from 'next/server';

// Mock data for jewelry knowledge articles
const categories = [
  { id: 1, slug: 'gemstones', name: 'Gemstones' },
  { id: 2, slug: 'metals', name: 'Precious Metals' },
  { id: 3, slug: 'care', name: 'Jewelry Care' },
  { id: 4, slug: 'styles', name: 'Jewelry Styles' },
  { id: 5, slug: 'history', name: 'Jewelry History' }
];

const articles = [
  {
    id: 1,
    slug: 'diamond-4cs-guide',
    title: 'The Complete Guide to Diamond 4Cs',
    summary: 'Learn about the four factors that determine a diamond\'s quality and value: cut, color, clarity, and carat weight.',
    content: `<p>Diamonds are evaluated based on four key characteristics known as the 4Cs: Cut, Color, Clarity, and Carat weight. Understanding these factors will help you make an informed decision when purchasing a diamond.</p>
      <h2>Cut</h2>
      <p>The cut of a diamond refers to how well its facets interact with light. A well-cut diamond will reflect light internally and disperse it through the top of the stone, resulting in exceptional brilliance and fire. Cut grades typically range from Excellent to Poor.</p>
      <h2>Color</h2>
      <p>Diamond color is graded on a scale from D (colorless) to Z (light yellow or brown). Colorless diamonds are the most valuable, as they allow more light to pass through them, creating more sparkle.</p>
      <h2>Clarity</h2>
      <p>Clarity measures the absence of inclusions and blemishes. The clarity scale ranges from Flawless (no inclusions visible under 10x magnification) to Included (inclusions visible to the naked eye).</p>
      <h2>Carat</h2>
      <p>Carat is a measure of a diamond's weight, not its size. One carat equals 0.2 grams. While larger diamonds are generally more valuable, the other three Cs significantly impact a diamond's overall value.</p>`,
    image: '/images/jewelry-knowledge/diamond-4cs.jpg',
    category: 'gemstones',
    categoryName: 'Gemstones',
    publishDate: '2023-09-15T12:00:00Z',
    author: 'Emily Johnson'
  },
  {
    id: 2,
    slug: 'gold-purity-guide',
    title: 'Understanding Gold Purity: Karats Explained',
    summary: 'Discover what karat means in gold jewelry and how to choose the right purity level for your needs.',
    content: `<p>Gold purity is measured in karats (K), with 24K being pure gold. The karat number indicates how many parts out of 24 are gold.</p>
      <h2>24K Gold (99.9% pure)</h2>
      <p>24K gold is the purest form of gold, containing 99.9% gold with minimal other metals. It has a rich, yellow color but is soft and easily damaged, making it less practical for everyday jewelry.</p>
      <h2>18K Gold (75% pure)</h2>
      <p>18K gold contains 75% gold and 25% other metals. It offers a good balance between purity and durability, making it popular for high-end jewelry pieces.</p>
      <h2>14K Gold (58.3% pure)</h2>
      <p>14K gold contains 58.3% gold and 41.7% other metals. It's more affordable and durable than higher karat options, making it ideal for everyday wear.</p>
      <h2>10K Gold (41.7% pure)</h2>
      <p>10K gold contains 41.7% gold and 58.3% other metals. It's the most durable gold option but has a lighter color due to the higher percentage of other metals.</p>`,
    image: '/images/jewelry-knowledge/gold-purity.jpg',
    category: 'metals',
    categoryName: 'Precious Metals',
    publishDate: '2023-10-02T12:00:00Z',
    author: 'Michael Chen'
  },
  {
    id: 3,
    slug: 'jewelry-cleaning-tips',
    title: 'Essential Jewelry Cleaning and Maintenance Tips',
    summary: 'Learn how to properly clean and maintain your jewelry to ensure it stays beautiful for years to come.',
    content: `<p>Proper cleaning and maintenance are essential to keep your jewelry looking its best. Different materials require different care approaches.</p>
      <h2>Cleaning Gold Jewelry</h2>
      <p>Mix a few drops of mild dish soap with warm water. Soak your gold jewelry for 15-30 minutes, then gently scrub with a soft toothbrush. Rinse thoroughly and pat dry with a lint-free cloth.</p>
      <h2>Cleaning Silver Jewelry</h2>
      <p>For tarnished silver, use a silver polishing cloth or a specialized silver cleaner. For light cleaning, the same soap and water method for gold works well.</p>
      <h2>Cleaning Gemstone Jewelry</h2>
      <p>Most gemstones can be cleaned with mild soap and water. However, some stones like pearls, opals, and turquoise are porous and should never be soaked. Instead, wipe them gently with a damp cloth.</p>
      <h2>Jewelry Storage</h2>
      <p>Store pieces separately to prevent scratching. Keep silver in anti-tarnish bags, and store necklaces hung up to prevent tangling.</p>`,
    image: '/images/jewelry-knowledge/jewelry-cleaning.jpg',
    category: 'care',
    categoryName: 'Jewelry Care',
    publishDate: '2023-11-10T12:00:00Z',
    author: 'Sarah Williams'
  },
  {
    id: 4,
    slug: 'engagement-ring-styles',
    title: 'Popular Engagement Ring Styles and Settings',
    summary: 'Explore the most popular engagement ring styles and settings to find the perfect ring for your proposal.',
    content: `<p>Engagement rings come in a variety of styles and settings, each with its own unique characteristics and appeal.</p>
      <h2>Solitaire</h2>
      <p>The solitaire setting features a single center stone held by prongs. Its timeless design emphasizes the beauty of the center diamond and works with any diamond shape.</p>
      <h2>Halo</h2>
      <p>The halo setting surrounds the center stone with a circle of smaller diamonds, creating the illusion of a larger center stone and adding extra sparkle.</p>
      <h2>Three-Stone</h2>
      <p>The three-stone setting features a center diamond flanked by two side stones, often symbolizing the couple's past, present, and future together.</p>
      <h2>Vintage</h2>
      <p>Vintage-inspired rings often feature intricate details, milgrain, and filigree work, reflecting designs from earlier eras like Art Deco or Victorian times.</p>`,
    image: '/images/jewelry-knowledge/engagement-rings.jpg',
    category: 'styles',
    categoryName: 'Jewelry Styles',
    publishDate: '2023-12-05T12:00:00Z',
    author: 'Jessica Rodriguez'
  },
  {
    id: 5,
    slug: 'ancient-egyptian-jewelry',
    title: 'The Significance of Jewelry in Ancient Egyptian Culture',
    summary: 'Discover the rich history and cultural significance of jewelry in Ancient Egypt.',
    content: `<p>Jewelry played a crucial role in ancient Egyptian culture, serving both decorative and symbolic purposes.</p>
      <h2>Materials and Symbolism</h2>
      <p>Egyptians used gold, which they believed was the flesh of the gods, along with colorful gemstones like lapis lazuli, turquoise, and carnelian. Each material and color had specific symbolic meanings related to their religious beliefs.</p>
      <h2>Amulets and Protection</h2>
      <p>Many Egyptian jewelry pieces functioned as amulets, believed to protect the wearer from evil and bring good fortune. The scarab beetle, ankh symbol, and Eye of Horus were popular protective motifs.</p>
      <h2>Social Status</h2>
      <p>Jewelry indicated social status and wealth. While the elite wore gold and precious stones, those of lower status wore jewelry made of colored glass, faience, and less valuable materials.</p>
      <h2>Afterlife</h2>
      <p>Egyptians were buried with their jewelry, as it was believed to be needed in the afterlife. Some pieces were made specifically for funerary purposes, such as the elaborate pectorals found in royal tombs.</p>`,
    image: '/images/jewelry-knowledge/egyptian-jewelry.jpg',
    category: 'history',
    categoryName: 'Jewelry History',
    publishDate: '2024-01-20T12:00:00Z',
    author: 'Daniel Foster'
  },
  {
    id: 6,
    slug: 'sapphire-guide',
    title: 'Sapphires: The Complete Guide',
    summary: 'Everything you need to know about sapphires, from colors and quality factors to famous examples.',
    content: `<p>Sapphires are one of the most beloved gemstones, known for their stunning blue color and exceptional durability.</p>
      <h2>Colors and Varieties</h2>
      <p>While blue is the most well-known color, sapphires actually come in nearly every color of the rainbow, except red (which would be a ruby). Popular sapphire colors include blue, pink, yellow, green, purple, and the rare padparadscha (orange-pink).</p>
      <h2>Quality Factors</h2>
      <p>Sapphire quality is determined by color, clarity, cut, and carat weight. The most valuable sapphires have rich, vivid blue color, excellent transparency, minimal inclusions, and pleasing proportions.</p>
      <h2>Famous Sapphires</h2>
      <p>Some of the world's most famous sapphires include the 423-carat Logan Sapphire, the 182-carat Star of Bombay, and the 12-carat sapphire in Princess Diana's (now Kate Middleton's) engagement ring.</p>`,
    image: '/images/jewelry-knowledge/sapphires.jpg',
    category: 'gemstones',
    categoryName: 'Gemstones',
    publishDate: '2024-02-08T12:00:00Z',
    author: 'Emily Johnson'
  }
];

export async function GET() {
  try {
    // In a real application, this data would come from a database
    return NextResponse.json({ 
      articles: articles,
      categories: categories
    });
  } catch (error) {
    console.error('Error fetching jewelry knowledge data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jewelry knowledge data' },
      { status: 500 }
    );
  }
} 