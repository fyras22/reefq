import { NextResponse } from 'next/server';

interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
}

// Mock data - would be replaced with database queries
const categories: ArticleCategory[] = [
  {
    id: '1',
    name: 'Gemstone Education',
    slug: 'gemstone-education',
    description: 'Learn about different types of gemstones, their properties, and how to identify them.'
  },
  {
    id: '2',
    name: 'Jewelry Care',
    slug: 'jewelry-care',
    description: 'Tips and guides for maintaining and preserving your jewelry pieces.'
  },
  {
    id: '3',
    name: 'Market Trends',
    slug: 'market-trends',
    description: 'Stay updated with the latest trends and market information in the jewelry industry.'
  },
  {
    id: '4',
    name: 'Craftmanship',
    slug: 'craftmanship',
    description: 'Discover the art of jewelry making and traditional craftsmanship techniques.'
  },
  {
    id: '5',
    name: 'Buying Guides',
    slug: 'buying-guides',
    description: 'Expert advice on how to select and purchase quality jewelry pieces.'
  }
];

const articles: Article[] = [
  {
    id: '1',
    title: 'Understanding Diamond Clarity and Cut',
    slug: 'understanding-diamond-clarity-and-cut',
    excerpt: 'Learn how diamond clarity and cut affect both appearance and value, and how to make informed decisions when purchasing.',
    content: '# Understanding Diamond Clarity and Cut\n\nWhen evaluating diamonds, two of the most important factors are clarity and cut. These characteristics significantly impact a diamond\'s brilliance, appearance, and value.\n\n## Diamond Clarity\n\nClarity refers to the absence of inclusions and blemishes in a diamond. The Gemological Institute of America (GIA) grades diamond clarity on a scale ranging from Flawless (FL) to Included (I):\n\n- **FL (Flawless)**: No inclusions or blemishes visible under 10x magnification\n- **IF (Internally Flawless)**: No inclusions visible under 10x magnification\n- **VVS1, VVS2 (Very, Very Slightly Included)**: Inclusions difficult to see under 10x magnification\n- **VS1, VS2 (Very Slightly Included)**: Inclusions visible under 10x magnification but generally not visible to the naked eye\n- **SI1, SI2 (Slightly Included)**: Inclusions visible under 10x magnification and may be visible to the naked eye\n- **I1, I2, I3 (Included)**: Inclusions visible to the naked eye\n\n## Diamond Cut\n\nCut is perhaps the most important of the 4Cs, as it has the greatest impact on a diamond\'s brilliance. A well-cut diamond will reflect light internally and disperse it through the top of the stone, creating sparkle.\n\nThe GIA grades cut on a scale from Excellent to Poor:\n\n- **Excellent**: Maximum brilliance and fire. Light reflects from one facet to another and disperses through the top of the diamond.\n- **Very Good**: Nearly as brilliant as an Excellent cut, but at a lower price point.\n- **Good**: Reflects most light that enters the diamond. Much less expensive than Very Good cuts.\n- **Fair**: Allows some light to escape through the sides or bottom. Less brilliant than better cuts.\n- **Poor**: Much of the light escapes through the sides or bottom. These diamonds lack sparkle and brilliance.\n\n## Making the Right Choice\n\nWhen purchasing a diamond, consider these tips:\n\n1. Prioritize cut over other factors for maximum brilliance\n2. For clarity, VS2 or SI1 grades often provide the best value\n3. Consider the setting style when choosing clarity (some settings can hide small inclusions)\n4. Remember that no two diamonds are identical - always view the specific stone you\'re purchasing\n5. Work with reputable jewelers who provide proper certification\n\nBy understanding these factors, you can make a more informed decision when selecting your perfect diamond.',
    coverImage: '/images/knowledge/diamond-clarity.jpg',
    category: '1',
    author: 'Sarah Johnson',
    publishedAt: '2023-07-15T10:30:00Z',
    readingTime: 5,
    featured: true
  },
  {
    id: '2',
    title: 'How to Clean and Store Your Gold Jewelry',
    slug: 'how-to-clean-and-store-gold-jewelry',
    excerpt: 'Proper care and storage techniques to keep your gold jewelry looking brilliant for generations.',
    content: '# How to Clean and Store Your Gold Jewelry\n\nGold jewelry is an investment that can last for generations when properly maintained. This guide covers the essential care techniques to keep your pieces looking their best.\n\n## Cleaning Gold Jewelry\n\n### Basic Cleaning Solution\n\nFor regular cleaning:\n\n1. Mix a few drops of mild dish soap with warm (not hot) water\n2. Soak your gold jewelry for 15-20 minutes\n3. Gently scrub with a soft-bristled toothbrush, especially around stone settings and crevices\n4. Rinse thoroughly with lukewarm water\n5. Pat dry with a soft, lint-free cloth\n6. Allow to air dry completely before storing\n\n### Deep Cleaning\n\nFor more tarnished pieces:\n\n1. Mix 1/4 cup of ammonia with 1 cup of warm water (Warning: avoid this method if your jewelry contains pearls or certain gemstones)\n2. Soak for no more than 1 minute\n3. Brush gently with a soft toothbrush\n4. Rinse thoroughly and dry with a soft cloth\n\n## Proper Storage Techniques\n\nHow you store your gold jewelry is just as important as how you clean it:\n\n- **Separate storage**: Store each piece separately to prevent scratching. Use individual cloth pouches or a jewelry box with separate compartments.\n- **Avoid humidity**: Keep jewelry in a cool, dry place. Humidity can accelerate tarnishing.\n- **Silica gel packets**: Consider adding these to your storage area to absorb moisture.\n- **Proper positioning**: Store necklaces flat or hung to prevent tangling. Ensure rings and bracelets aren\'t under pressure from heavier items.\n\n## Wearing Your Gold Jewelry\n\nPreventative care is the best approach:\n\n- Remove jewelry before swimming in chlorinated pools or hot tubs\n- Apply perfume, hairspray, and cosmetics before putting on jewelry\n- Remove jewelry before household cleaning, gardening, or other manual work\n- Put on jewelry as the final step when getting dressed\n\n## When to Seek Professional Cleaning\n\nWhile regular at-home cleaning is important, professional cleaning is recommended:\n\n- Once a year for regularly worn pieces\n- If your jewelry has intricate detailing that\'s difficult to clean at home\n- When pieces contain valuable gemstones\n- If you notice any loose settings or damage\n\nWith proper care, your gold jewelry will maintain its luster and beauty for years to come, eventually becoming treasured heirlooms for future generations.',
    coverImage: '/images/knowledge/gold-care.jpg',
    category: '2',
    author: 'Ahmed Ben Ali',
    publishedAt: '2023-08-22T14:45:00Z',
    readingTime: 7,
    featured: true
  },
  {
    id: '3',
    title: 'The Rise of Sustainable Jewelry in Tunisia',
    slug: 'rise-of-sustainable-jewelry-in-tunisia',
    excerpt: 'How Tunisian jewelers are embracing ethical sourcing and sustainable practices in their craft.',
    content: '# The Rise of Sustainable Jewelry in Tunisia\n\nThe jewelry industry in Tunisia is undergoing a significant transformation as artisans and businesses increasingly embrace sustainability. This shift reflects both global trends and local values, creating new opportunities in the market.\n\n## Traditional Craftsmanship Meets Modern Ethics\n\nTunisia has a rich history of jewelry craftsmanship dating back centuries. Today\'s artisans are combining these traditional techniques with contemporary ethical considerations:\n\n- Sourcing recycled precious metals\n- Using ethically mined gemstones\n- Implementing efficient workshop practices to reduce waste\n- Creating timeless designs that transcend fast-fashion trends\n\n## Leading Sustainable Jewelry Initiatives\n\nSeveral Tunisian brands are at the forefront of this movement:\n\n### Dar El Jeldiya\n\nThis Tunis-based workshop uses only recycled silver and trains young artisans in sustainable practices. Their pieces combine traditional Berber motifs with contemporary minimalist designs.\n\n### Zitouna Crafts\n\nLocated in Djerba, this collective works directly with mining communities to ensure fair wages and environmentally responsible extraction methods for their materials.\n\n### Medina Modern\n\nThis brand has pioneered the use of innovative materials, incorporating olive wood and recycled plastics alongside precious metals in their contemporary designs.\n\n## Consumer Response\n\nTunisian consumers, particularly younger generations, are increasingly prioritizing sustainability in their purchasing decisions. A recent survey found:\n\n- 68% of Tunisian jewelry buyers under 35 consider ethical sourcing important\n- 72% are willing to pay a premium of 10-15% for sustainably produced pieces\n- 84% value knowing the origin story of their jewelry\n\n## Challenges and Opportunities\n\nDespite growing interest, sustainable jewelry in Tunisia faces challenges:\n\n- Limited access to certain certified ethical materials\n- Higher production costs affecting market competitiveness\n- Need for consumer education about sustainability in jewelry\n\nHowever, these challenges present opportunities for innovation and differentiation in a growing market segment. Government programs supporting artisanal industries are also beginning to incorporate sustainability criteria in their funding requirements.\n\n## The Future Landscape\n\nThe sustainable jewelry movement in Tunisia is positioned for continued growth. Industry experts predict:\n\n- Increased collaboration between traditional artisans and contemporary designers\n- Development of local certification standards for ethical jewelry\n- Growing export opportunities to eco-conscious international markets\n- Integration of digital technologies for supply chain transparency\n\nBy embracing sustainability, Tunisia\'s jewelry industry is not only preserving its rich cultural heritage but also securing its relevance and viability for future generations.',
    coverImage: '/images/knowledge/sustainable-jewelry.jpg',
    category: '3',
    author: 'Leila Mansour',
    publishedAt: '2023-09-10T09:15:00Z',
    readingTime: 6,
    featured: false
  },
  {
    id: '4',
    title: 'The Art of Filigree: Traditional Tunisian Silverwork',
    slug: 'art-of-filigree-traditional-tunisian-silverwork',
    excerpt: 'Exploring the intricate techniques and history behind Tunisia\'s renowned filigree silverwork tradition.',
    content: '# The Art of Filigree: Traditional Tunisian Silverwork\n\nFiligree, known locally as "telkari," is one of Tunisia\'s most distinguished jewelry crafts. This ancient technique involves twisting and curling fine threads of silver or gold to create intricate, lace-like patterns. The resulting pieces are not just jewelry but wearable art that tells the story of Tunisia\'s rich cultural heritage.\n\n## Historical Roots\n\nThe filigree tradition in Tunisia dates back to the Phoenician era, around 800 BCE, but flourished during the Ottoman period when Jewish silversmiths excelled in the craft. These artisans established workshops in medinas across Tunisia, particularly in cities like Tunis, Djerba, and Kairouan.\n\nHistorically, filigree jewelry served as a form of portable wealth for Tunisian women. These pieces were part of a bride\'s dowry and passed down through generations as family heirlooms.\n\n## The Meticulous Process\n\nCreating filigree jewelry requires extraordinary patience and skill:\n\n1. **Preparation**: Silver is melted and drawn into extremely fine wires, sometimes as thin as a human hair.\n\n2. **Wire Forming**: The wires are twisted, curled, and shaped into motifs using specialized pliers and tools.\n\n3. **Pattern Creation**: Individual elements are arranged to form larger patterns based on traditional designs or custom creations.\n\n4. **Assembly**: The components are carefully joined using a silver solder paste.\n\n5. **Finishing**: The piece is cleaned, polished, and sometimes embellished with gemstones or enamel work.\n\nA single elaborate piece can take several weeks to complete.\n\n## Symbolic Motifs\n\nTraditional Tunisian filigree incorporates numerous symbolic elements:\n\n- **The Hand of Fatima (Khamsa)**: For protection against the evil eye\n- **Fish**: Symbolizing fertility and abundance\n- **Crescents and Stars**: Reflecting Islamic heritage\n- **Geometric Patterns**: Representing cosmic order and harmony\n- **Floral Designs**: Celebrating nature and growth\n\n## Modern Revival\n\nToday, a new generation of Tunisian jewelry designers is revitalizing the filigree tradition:\n\n- Combining traditional techniques with contemporary designs\n- Creating more wearable, everyday pieces alongside statement jewelry\n- Using modern tools while preserving hand-crafting methods\n- Developing international markets for these distinctive creations\n\n## Learning the Craft\n\nFor those interested in experiencing this tradition:\n\n- The National Heritage Institute offers workshops in traditional jewelry techniques\n- Several artisan cooperatives in Tunis and Djerba provide apprenticeship opportunities\n- The annual Handicraft Festival showcases master filigree artisans demonstrating their skills\n\n## Preserving a Legacy\n\nAs machine-made jewelry becomes increasingly common, the preservation of filigree craftsmanship is crucial for Tunisia\'s cultural heritage. By supporting artisans who create these pieces, customers not only acquire unique jewelry but also help sustain a tradition that has defined Tunisian craftsmanship for centuries.\n\nEach filigree piece represents not just artistic beauty, but the preservation of knowledge, identity, and technique passed through generations of skilled hands.',
    coverImage: '/images/knowledge/filigree-art.jpg',
    category: '4',
    author: 'Karim Belhadj',
    publishedAt: '2023-10-05T11:20:00Z',
    readingTime: 8,
    featured: false
  },
  {
    id: '5',
    title: 'How to Choose the Perfect Engagement Ring',
    slug: 'how-to-choose-perfect-engagement-ring',
    excerpt: 'A comprehensive guide to selecting an engagement ring that matches your partner\'s style and preferences.',
    content: '# How to Choose the Perfect Engagement Ring\n\nSelecting an engagement ring is one of the most significant purchases you\'ll make. This guide will help you navigate the process and find the perfect ring that aligns with your partner\'s taste, your budget, and quality expectations.\n\n## Understanding Your Partner\'s Style\n\nBefore visiting jewelers, gather information about your partner\'s preferences:\n\n### Observe Existing Jewelry\n\nPay attention to the jewelry your partner already wears:\n\n- **Metal preference**: Do they typically wear yellow gold, white gold, rose gold, or platinum?\n- **Style**: Is their taste minimalist, vintage, modern, or ornate?\n- **Stone shapes**: Do they prefer round, oval, princess, cushion, or other shapes?\n- **Size**: Do they prefer statement pieces or more subtle jewelry?\n\n### Enlist Help\n\n- Ask close friends or family members who might have insights\n- See if your partner has shared preferences with others\n- Check if they have a Pinterest board or saved images related to jewelry\n\n## Choosing the Right Stone\n\n### Diamond Considerations\n\nIf selecting a diamond, familiarize yourself with the 4Cs:\n\n1. **Cut**: Affects how the diamond catches and reflects light. Many experts recommend prioritizing cut quality above other factors.\n\n2. **Color**: Diamonds are graded from D (colorless) to Z (light yellow). For most engagement rings, grades D through J provide excellent value.\n\n3. **Clarity**: Refers to the presence of inclusions or blemishes. Grades range from Flawless to Included. VS1 and VS2 typically offer good value as inclusions aren\'t visible to the naked eye.\n\n4. **Carat**: Represents weight, not necessarily size. Consider how the stone appears on your partner\'s hand rather than focusing solely on the number.\n\n### Alternative Gemstones\n\nMany couples now choose alternatives to diamonds:\n\n- **Sapphires**: Durable and available in various colors\n- **Emeralds**: Unique brilliance with rich history\n- **Moissanite**: Nearly as hard as diamond with similar appearance but more affordable\n- **Lab-grown diamonds**: Chemically identical to mined diamonds but more sustainable and affordable\n\n## Setting Styles\n\nThe setting affects both aesthetics and practicality:\n\n- **Solitaire**: Classic and timeless, highlighting a single stone\n- **Halo**: Small diamonds surrounding the center stone for added sparkle\n- **Three-stone**: Representing past, present, and future\n- **Vintage**: Detailed and ornate, often with milgrain or filigree\n- **Bezel**: Metal surrounds the stone completely, offering maximum protection\n- **Tension**: Stone appears to be held by pressure alone\n\nConsider your partner\'s lifestyle when choosing a setting. Active individuals may prefer lower-profile or more secure settings.\n\n## Determining Ring Size\n\nOptions for finding the right size include:\n\n- Borrowing a ring they already wear on their ring finger\n- Using a ring sizer app or printable guide\n- Asking a family member who might know\n- Selecting a setting that can be easily resized\n\n## Budget Considerations\n\nSet a realistic budget based on your financial situation, not on outdated "rules" about spending a certain number of months\' salary. Quality factors that impact price include:\n\n- Stone quality and size\n- Metal type and purity\n- Craftsmanship and brand\n- Certification and warranties\n\n## Making the Purchase\n\n### Where to Buy\n\n- **Traditional jewelers**: Offer personalized service and the ability to see pieces in person\n- **Online retailers**: Often have lower overhead costs and larger selections\n- **Custom designers**: Can create a unique piece based on your specifications\n\n### Timing\n\nAllow 4-6 weeks for shopping, customization, and possible resizing before you plan to propose.\n\n### Documentation\n\nEnsure your purchase includes:\n\n- GIA or equivalent certification for the center stone\n- Detailed appraisal for insurance purposes\n- Clear warranty and return policy information\n\nRemember that while the process may seem overwhelming, focusing on your partner\'s preferences and your shared values will guide you to the perfect choice. The ring is a symbol of your commitment—choosing one that reflects your partner\'s individual style will make the moment even more special.',
    coverImage: '/images/knowledge/engagement-ring.jpg',
    category: '5',
    author: 'Nadia Feriani',
    publishedAt: '2023-11-12T08:30:00Z',
    readingTime: 10,
    featured: true
  }
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  // Handle different types of requests based on query parameters
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');
  const featured = searchParams.get('featured');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : undefined;
  
  // Return categories list
  if (searchParams.get('type') === 'categories') {
    return NextResponse.json({ categories });
  }
  
  // Return a specific article by slug
  if (slug) {
    const article = articles.find(a => a.slug === slug);
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    // Enhance article with category name
    const category = categories.find(c => c.id === article.category);
    
    return NextResponse.json({ 
      article: {
        ...article,
        categoryName: category?.name || ''
      } 
    });
  }
  
  // Filter articles by category
  let filteredArticles = [...articles];
  
  if (category) {
    filteredArticles = filteredArticles.filter(a => a.category === category);
  }
  
  // Filter by featured status
  if (featured === 'true') {
    filteredArticles = filteredArticles.filter(a => a.featured);
  }
  
  // Sort by publish date (newest first)
  filteredArticles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  
  // Apply limit if specified
  if (limit && limit > 0) {
    filteredArticles = filteredArticles.slice(0, limit);
  }
  
  // Format results with category names
  const formattedArticles = filteredArticles.map(article => {
    const category = categories.find(c => c.id === article.category);
    return {
      ...article,
      categoryName: category?.name || ''
    };
  });
  
  return NextResponse.json({ articles: formattedArticles });
} 