// Define jewelry knowledge data
export const categories = [
  { id: 'gemstones', name: 'Gemstones' },
  { id: 'metals', name: 'Precious Metals' },
  { id: 'care', name: 'Jewelry Care' },
  { id: 'history', name: 'Jewelry History' },
  { id: 'design', name: 'Jewelry Design' },
];

export const articles = [
  {
    id: '1',
    slug: 'understanding-diamond-clarity',
    title: 'Understanding Diamond Clarity',
    summary: 'Learn about the factors that affect diamond clarity and how it impacts value.',
    content: `
      <h2>What is Diamond Clarity?</h2>
      <p>Diamond clarity refers to the absence of inclusions and blemishes in a diamond. Diamonds without these birthmarks are rare, and most have at least some inclusions that occurred during the diamond's formation process deep within the earth.</p>
      
      <h2>The Clarity Scale</h2>
      <p>The GIA Diamond Clarity Scale has 6 categories, some with subcategories, for a total of 11 specific grades:</p>
      <ul>
        <li>Flawless (FL) - No inclusions or blemishes visible under 10x magnification</li>
        <li>Internally Flawless (IF) - No inclusions and only blemishes visible under 10x magnification</li>
        <li>Very, Very Slightly Included (VVS1 and VVS2) - Inclusions that are difficult to see under 10x magnification</li>
        <li>Very Slightly Included (VS1 and VS2) - Inclusions are clearly visible under 10x magnification but can be characterized as minor</li>
        <li>Slightly Included (SI1 and SI2) - Inclusions are noticeable under 10x magnification</li>
        <li>Included (I1, I2, and I3) - Inclusions are obvious under 10x magnification and may affect transparency and brilliance</li>
      </ul>
    `,
    category: 'gemstones',
    publishDate: '2023-05-15',
    author: 'Emma Johnson',
    image: '/images/blog/diamond-clarity.jpg'
  },
  {
    id: '2',
    slug: 'gold-karat-guide',
    title: 'Gold Karat Guide: Understanding Purity',
    summary: 'Everything you need to know about gold karats and how they affect jewelry quality.',
    content: `
      <h2>What are Gold Karats?</h2>
      <p>Gold karat is a measure of gold purity. Pure gold is 24 karats, meaning that 24 out of 24 parts are gold. Lower karat numbers indicate a lower percentage of gold in the metal.</p>
      
      <h2>Common Gold Karat Types</h2>
      <ul>
        <li><strong>24K Gold (99.9% pure):</strong> Pure gold is soft and malleable, making it less ideal for everyday jewelry.</li>
        <li><strong>22K Gold (91.7% pure):</strong> Contains 22 parts gold and 2 parts other metals. Used for high-end jewelry.</li>
        <li><strong>18K Gold (75% pure):</strong> A good balance between purity and durability. Common in fine jewelry.</li>
        <li><strong>14K Gold (58.3% pure):</strong> More durable than higher karat gold. Standard for engagement rings in the US.</li>
        <li><strong>10K Gold (41.7% pure):</strong> Minimum karat that can be legally marketed as gold in the US. Most durable but least pure.</li>
      </ul>
      
      <h2>Gold Alloys and Colors</h2>
      <p>Gold is alloyed with different metals to create various colors:</p>
      <ul>
        <li><strong>Yellow Gold:</strong> Gold + silver and copper</li>
        <li><strong>White Gold:</strong> Gold + white metals like silver, palladium, or nickel</li>
        <li><strong>Rose Gold:</strong> Gold + copper and sometimes silver</li>
      </ul>
    `,
    category: 'metals',
    publishDate: '2023-06-02',
    author: 'Michael Chen',
    image: '/images/blog/gold-karats.jpg'
  },
  {
    id: '3',
    slug: 'how-to-clean-your-jewelry',
    title: 'How to Clean Your Jewelry at Home',
    summary: 'Simple methods for keeping your precious jewelry looking its best.',
    content: `
      <h2>Basic Jewelry Cleaning Solutions</h2>
      <p>You can clean most jewelry at home with simple ingredients:</p>
      <ul>
        <li><strong>Dish Soap Solution:</strong> Mix a few drops of mild dish soap with warm (not hot) water. This works for most jewelry types.</li>
        <li><strong>Ammonia Solution:</strong> For diamonds and gold, a solution of 1 part ammonia to 6 parts water can be effective.</li>
        <li><strong>Baking Soda Paste:</strong> For heavy tarnish on silver, make a paste with baking soda and water.</li>
      </ul>
      
      <h2>Cleaning Different Types of Jewelry</h2>
      
      <h3>Diamonds and Hard Gemstones</h3>
      <p>Soak in dish soap solution for 20-40 minutes, then gently brush with a soft toothbrush, especially around the setting. Rinse thoroughly and pat dry with a lint-free cloth.</p>
      
      <h3>Gold Jewelry</h3>
      <p>Soak in dish soap solution for 15-30 minutes. Brush gently with a soft brush, rinse, and dry with a soft cloth. For deeper cleaning, professional ultrasonic cleaners are recommended.</p>
      
      <h3>Silver Jewelry</h3>
      <p>Use a special silver polishing cloth or a baking soda paste. Gently rub the tarnished areas, rinse, and dry thoroughly. Avoid soaking silver as it can accelerate tarnishing.</p>
      
      <h3>Pearls and Delicate Gems</h3>
      <p>Wipe with a damp cloth lightly dipped in very diluted soap solution. Never soak pearls, opals, turquoise, or coral, as they are porous and can be damaged by water and chemicals.</p>
    `,
    category: 'care',
    publishDate: '2023-07-10',
    author: 'Sophia Martinez',
    image: '/images/blog/jewelry-cleaning.jpg'
  },
  {
    id: '4',
    slug: 'ancient-egyptian-jewelry',
    title: 'Ancient Egyptian Jewelry: Symbols and Techniques',
    summary: 'Discover the symbolism and craftsmanship behind ancient Egyptian jewelry.',
    content: `
      <h2>Significance in Egyptian Culture</h2>
      <p>In ancient Egypt, jewelry was more than adornment—it was imbued with religious and symbolic significance. Both men and women wore jewelry, but it also served as a way to display wealth and status, and was believed to have protective qualities.</p>
      
      <h2>Materials and Techniques</h2>
      <p>Egyptian jewelers worked with:</p>
      <ul>
        <li><strong>Gold:</strong> Symbolizing the sun and considered the flesh of the gods</li>
        <li><strong>Semi-precious stones:</strong> Lapis lazuli, turquoise, carnelian, and jasper</li>
        <li><strong>Faience:</strong> A ceramic material created as an inexpensive substitute for turquoise and lapis lazuli</li>
        <li><strong>Glass:</strong> Used to create colored inlays</li>
      </ul>
      <p>Techniques included granulation, cloisonné, filigree, and inlay work.</p>
      
      <h2>Common Symbols</h2>
      <ul>
        <li><strong>Ankh:</strong> The key of life, symbolizing eternal life</li>
        <li><strong>Scarab beetle:</strong> Representing rebirth and the sun god Ra</li>
        <li><strong>Eye of Horus:</strong> Offering protection and good health</li>
        <li><strong>Lotus flower:</strong> Symbolizing rebirth and regeneration</li>
      </ul>
      
      <h2>Types of Jewelry</h2>
      <p>Common forms included broad collars, pectorals (chest ornaments), bracelets, armlets, rings, and earrings. Headpieces and crowns were reserved for royalty and deities.</p>
    `,
    category: 'history',
    publishDate: '2023-08-18',
    author: 'Dr. Alexander Thompson',
    image: '/images/blog/egyptian-jewelry.jpg'
  },
  {
    id: '5',
    slug: 'contemporary-jewelry-trends',
    title: 'Contemporary Jewelry Design: Trends and Innovations',
    summary: 'Explore the latest trends in contemporary jewelry design and innovative techniques.',
    content: `
      <h2>Current Design Trends</h2>
      <p>Contemporary jewelry design is marked by experimentation and innovation. Current trends include:</p>
      <ul>
        <li><strong>Minimalism:</strong> Clean lines and simple geometric forms</li>
        <li><strong>Sustainable Materials:</strong> Recycled metals and ethically sourced gemstones</li>
        <li><strong>Mixed Materials:</strong> Combining precious metals with non-traditional materials like wood, concrete, or textile</li>
        <li><strong>Customization:</strong> Personalized and bespoke pieces</li>
        <li><strong>Statement Pieces:</strong> Bold, artistic designs meant to express individuality</li>
      </ul>
      
      <h2>Innovative Techniques</h2>
      <p>Modern jewelry designers are pushing boundaries with techniques such as:</p>
      <ul>
        <li><strong>3D Printing:</strong> Allowing complex geometries previously impossible to create</li>
        <li><strong>Laser Cutting:</strong> Creating precise patterns and openwork</li>
        <li><strong>Alternative Stone Setting:</strong> Tension settings, flush settings, and other modern approaches</li>
        <li><strong>Digital Design:</strong> CAD/CAM tools enabling greater precision and experimentation</li>
      </ul>
      
      <h2>Notable Contemporary Designers</h2>
      <p>Designers pushing the boundaries include Iris van Herpen, who blends fashion and jewelry with 3D printing, and Shaun Leane, known for his work with Alexander McQueen creating avant-garde pieces that challenge traditional concepts of jewelry.</p>
    `,
    category: 'design',
    publishDate: '2023-09-05',
    author: 'Jessica Taylor',
    image: '/images/blog/contemporary-jewelry.jpg'
  },
]; 