export interface Product {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images: string[];
  category: string;
  type: 'ring' | 'bracelet' | 'necklace' | 'earring' | 'pendant';
  materials: string[];
  metalTypes: string[];
  gemTypes: string[];
  sizes: number[];
  modelPath: string;
  featured: boolean;
  new: boolean;
  bestseller: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  hasAR: boolean;
  has3D: boolean;
  specifications: {
    weight?: string;
    dimensions?: string;
    metalPurity?: string;
    gemCarat?: string;
    gemClarity?: string;
    gemColor?: string;
    gemCut?: string;
    chainLength?: string;
    closure?: string;
    settingType?: string;
  };
  careInstructions: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'diamond-engagement-ring-solitaire',
    name: 'Celestial Solitaire Diamond Engagement Ring',
    description: 'A timeless solitaire diamond ring set in 18k gold with exceptional brilliance and clarity.',
    detailedDescription: 'Our Celestial Solitaire Diamond Engagement Ring features a breathtaking 1-carat round brilliant diamond of exceptional clarity (VS1) and color (F), secured in a classic 6-prong setting. The band is crafted from ethically sourced 18k gold with a polished finish that elegantly complements the diamond\'s radiance. This timeless design symbolizes eternal love with its perfect proportions and exquisite craftsmanship. The ring comes presented in our signature blue velvet box, ready to create a perfect proposal moment.',
    price: 4299,
    images: [
      '/images/jewelry/high-res/diamond-ring-1.jpg',
      '/images/jewelry/high-res/diamond-ring-2.jpg', 
      '/images/jewelry/high-res/diamond-ring-3.jpg',
      '/images/jewelry/high-res/diamond-ring-4.jpg'
    ],
    category: 'Engagement Rings',
    type: 'ring',
    materials: ['Gold', 'Diamond'],
    metalTypes: ['gold', 'whitegold', 'rosegold', 'platinum'],
    gemTypes: ['diamond'],
    sizes: [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9],
    modelPath: '/models/diamond_solitaire_ring.glb',
    featured: true,
    new: false,
    bestseller: true,
    rating: 4.9,
    reviewCount: 124,
    stock: 15,
    availability: 'in-stock',
    hasAR: true,
    has3D: true,
    specifications: {
      weight: '4.2g',
      metalPurity: '18k',
      gemCarat: '1.0ct',
      gemClarity: 'VS1',
      gemColor: 'F',
      gemCut: 'Excellent',
      settingType: '6-Prong Setting'
    },
    careInstructions: [
      'Clean with a soft, lint-free cloth',
      'Store in a jewelry box or pouch when not worn',
      'Remove before swimming or using harsh chemicals',
      'Have professionally cleaned and inspected every 6 months'
    ],
    reviews: [
      {
        id: 'rev-001',
        author: 'Emily Johnson',
        rating: 5,
        date: '2023-12-15',
        title: 'Absolutely perfect!',
        comment: 'My fiancé proposed with this ring and I couldn\'t be happier! The diamond catches light from every angle and the craftsmanship is exceptional. It fits perfectly and I receive compliments everywhere I go.',
        verified: true,
        helpful: 34,
        images: ['/images/reviews/review-ring-1.jpg']
      },
      {
        id: 'rev-002',
        author: 'Michael Peters',
        rating: 5,
        date: '2023-11-20',
        title: 'She said yes!',
        comment: 'The ring arrived in perfect condition and looked even better in person. The diamond is incredibly brilliant and the gold setting complements it beautifully. Most importantly, she said yes!',
        verified: true,
        helpful: 28
      },
      {
        id: 'rev-003',
        author: 'Sarah Williams',
        rating: 4,
        date: '2023-10-05',
        title: 'Beautiful ring, sizing was off',
        comment: 'The ring is stunning and exactly as pictured. I had to get it resized as it ran slightly small, but the customer service was excellent in helping me through the process.',
        verified: true,
        helpful: 15
      }
    ]
  },
  {
    id: 'tennis-bracelet-diamond',
    name: 'Eternity Diamond Tennis Bracelet',
    description: 'Elegant tennis bracelet featuring premium diamonds in a classic line setting with secure clasp.',
    detailedDescription: 'Our Eternity Diamond Tennis Bracelet showcases 36 round-cut diamonds (total weight 3.5ct) of exceptional brilliance arranged in a continuous line. Each diamond is meticulously set in 18k white gold with a secure, easy-to-use hidden box clasp. This timeless piece is versatile enough for both everyday elegance and special occasions. The balanced proportion and weight ensure comfort for extended wear, while the high-quality craftsmanship provides durability and a lifetime of enjoyment. A statement piece that transcends trends and will become a treasured heirloom.',
    price: 7999,
    salePrice: 6999,
    discountPercentage: 12,
    images: [
      '/images/jewelry/high-res/tennis-bracelet-1.jpg',
      '/images/jewelry/high-res/tennis-bracelet-2.jpg',
      '/images/jewelry/high-res/tennis-bracelet-3.jpg',
      '/images/jewelry/high-res/tennis-bracelet-4.jpg'
    ],
    category: 'Bracelets',
    type: 'bracelet',
    materials: ['White Gold', 'Diamond'],
    metalTypes: ['whitegold', 'platinum'],
    gemTypes: ['diamond'],
    sizes: [6.5, 7, 7.5, 8],
    modelPath: '/models/tennis_bracelet.glb',
    featured: true,
    new: true,
    bestseller: false,
    rating: 4.8,
    reviewCount: 89,
    stock: 10,
    availability: 'in-stock',
    hasAR: true,
    has3D: true,
    specifications: {
      weight: '18.3g',
      dimensions: '7" length',
      metalPurity: '18k',
      gemCarat: '3.5ct total',
      gemClarity: 'VS1-VS2',
      gemColor: 'F-G',
      closure: 'Hidden box clasp with safety catch'
    },
    careInstructions: [
      'Clean with warm water, mild soap and a soft brush',
      'Have clasp and settings checked annually',
      'Remove before physical activities',
      'Store flat in a jewelry box to prevent tangling'
    ],
    reviews: [
      {
        id: 'rev-004',
        author: 'Jennifer Adams',
        rating: 5,
        date: '2023-11-30',
        title: 'Absolutely stunning',
        comment: "This tennis bracelet exceeds all my expectations. The diamonds catch light beautifully and the white gold setting is elegant and secure. It's comfortable enough to wear all day and receives endless compliments.",
        verified: true,
        helpful: 42
      },
      {
        id: 'rev-005',
        author: 'Robert Chen',
        rating: 5,
        date: '2023-10-25',
        title: 'Perfect anniversary gift',
        comment: 'I purchased this for our 10th anniversary and my wife was speechless. The quality is exceptional and the presentation box made the moment even more special. Worth every penny.',
        verified: true,
        helpful: 31
      }
    ]
  },
  {
    id: 'emerald-cut-engagement-ring',
    name: 'Regal Emerald-Cut Diamond Ring',
    description: 'Sophisticated emerald-cut diamond ring with tapered baguette side stones in platinum setting.',
    detailedDescription: 'The Regal Emerald-Cut Diamond Ring features a stunning 2-carat center stone with exceptional clarity that showcases the unique step-cut facets characteristic of emerald-cut diamonds. The elongated shape creates an elegant, sophisticated look while the tapered baguette side stones add additional brilliance and frame the center diamond perfectly. Set in platinum for superior durability and a naturally white finish that will never tarnish or fade. This ring embodies timeless elegance with modern proportions that look beautiful on the hand. The design allows the diamond to sit low enough for comfortable everyday wear while maintaining a prestigious profile.',
    price: 9299,
    images: [
      '/images/jewelry/high-res/emerald-cut-ring-1.jpg',
      '/images/jewelry/high-res/emerald-cut-ring-2.jpg',
      '/images/jewelry/high-res/emerald-cut-ring-3.jpg',
      '/images/jewelry/high-res/emerald-cut-ring-4.jpg'
    ],
    category: 'Engagement Rings',
    type: 'ring',
    materials: ['Platinum', 'Diamond'],
    metalTypes: ['platinum', 'whitegold'],
    gemTypes: ['diamond'],
    sizes: [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9],
    modelPath: '/models/emerald_cut_ring.glb',
    featured: true,
    new: true,
    bestseller: true,
    rating: 4.9,
    reviewCount: 57,
    stock: 8,
    availability: 'in-stock',
    hasAR: true,
    has3D: true,
    specifications: {
      weight: '6.3g',
      metalPurity: '950 Platinum',
      gemCarat: '2.0ct center, 0.5ct side stones',
      gemClarity: 'VVS2',
      gemColor: 'E',
      gemCut: 'Excellent',
      settingType: 'Four-prong with channel set baguettes'
    },
    careInstructions: [
      'Clean with a soft brush and mild soapy water',
      'Have professionally inspected and cleaned annually',
      'Remove before applying lotions or perfumes',
      'Store separately to prevent scratching'
    ],
    reviews: [
      {
        id: 'rev-006',
        author: 'Victoria Morgan',
        rating: 5,
        date: '2023-12-12',
        title: 'Exceptional quality and elegance',
        comment: "My fiancé proposed with this ring and I'm completely in love with it. The emerald cut diamond is so clear and brilliant, while the platinum setting feels substantial and luxurious. It's both modern and timeless.",
        verified: true,
        helpful: 24,
        images: ['/images/reviews/review-emerald-ring-1.jpg']
      }
    ]
  },
  {
    id: 'pearl-strand-necklace',
    name: 'Akoya Pearl Strand Necklace',
    description: 'Luxurious strand of perfectly matched Akoya pearls with 18k gold clasp.',
    detailedDescription: 'Our Akoya Pearl Strand Necklace features 87 perfectly matched cultured pearls from the pristine waters of Japan. Each pearl has been carefully selected for its exceptional luster, clean surface, and perfectly round shape. The strand is hand-knotted with silk thread between each pearl for security and proper drape. The 18k gold ball clasp provides a secure closure while complementing the creamy luster of the pearls. This classic necklace transitions beautifully from daytime to evening wear, adding elegance to any outfit. The 18-inch length sits perfectly at the collarbone, making it the ideal length for both high and scoop necklines.',
    price: 3499,
    images: [
      '/images/jewelry/high-res/pearl-necklace-1.jpg',
      '/images/jewelry/high-res/pearl-necklace-2.jpg',
      '/images/jewelry/high-res/pearl-necklace-3.jpg'
    ],
    category: 'Necklaces',
    type: 'necklace',
    materials: ['Pearl', 'Gold'],
    metalTypes: ['gold'],
    gemTypes: [],
    sizes: [16, 18, 20, 24],
    modelPath: '/models/pearl_necklace.glb',
    featured: false,
    new: true,
    bestseller: false,
    rating: 4.7,
    reviewCount: 74,
    stock: 12,
    availability: 'in-stock',
    hasAR: false,
    has3D: true,
    specifications: {
      weight: '42g',
      dimensions: '18" length',
      metalPurity: '18k gold clasp',
      closure: 'Ball clasp',
      settingType: 'Hand-knotted with silk thread'
    },
    careInstructions: [
      'Wipe with a soft, damp cloth after wearing',
      'Apply perfume, hairspray and other cosmetics before putting on pearls',
      'Store in a soft pouch away from other jewelry',
      'Restring every 2-3 years if worn regularly'
    ],
    reviews: [
      {
        id: 'rev-007',
        author: 'Sophia Williams',
        rating: 5,
        date: '2023-09-15',
        title: 'Heirloom quality',
        comment: "These pearls are absolutely stunning with incredible luster. The necklace is perfectly balanced and drapes beautifully. I purchased it for my daughter's wedding day, and it made her feel so elegant.",
        verified: true,
        helpful: 36
      },
      {
        id: 'rev-008',
        author: 'Margaret Liu',
        rating: 4,
        date: '2023-08-20',
        title: 'Beautiful but clasp could be improved',
        comment: "The pearls themselves are exceptional - matched perfectly with beautiful luster. My only minor complaint is that the clasp can be a bit difficult to manage when putting it on by yourself. Otherwise, it's a gorgeous necklace that I wear frequently.",
        verified: true,
        helpful: 19
      }
    ]
  },
  {
    id: 'sapphire-drop-earrings',
    name: 'Ceylon Sapphire Drop Earrings',
    description: 'Stunning sapphire earrings with diamond halos and leverback closures for secure wear.',
    detailedDescription: "Our Ceylon Sapphire Drop Earrings feature two exquisite pear-shaped sapphires (2.5ct total) sourced from the prestigious mines of Sri Lanka, known for producing sapphires of exceptional blue color. Each sapphire is surrounded by a halo of 28 small round brilliant diamonds (0.75ct total) that enhance the center stone and add remarkable sparkle. The earrings are crafted in 18k white gold with secure leverback closures that ensure they won't slip off during wear. The articulated design allows the drops to move slightly with wear, catching the light from multiple angles. Perfect for special occasions or to add a touch of luxury to everyday outfits.",
    price: 5299,
    images: [
      '/images/jewelry/high-res/sapphire-earrings-1.jpg',
      '/images/jewelry/high-res/sapphire-earrings-2.jpg',
      '/images/jewelry/high-res/sapphire-earrings-3.jpg'
    ],
    category: 'Earrings',
    type: 'earring',
    materials: ['White Gold', 'Sapphire', 'Diamond'],
    metalTypes: ['whitegold', 'platinum'],
    gemTypes: ['sapphire', 'diamond'],
    sizes: [],
    modelPath: '/models/sapphire_earrings.glb',
    featured: false,
    new: false,
    bestseller: true,
    rating: 4.8,
    reviewCount: 63,
    stock: 7,
    availability: 'in-stock',
    hasAR: true,
    has3D: true,
    specifications: {
      weight: '5.8g each',
      dimensions: '1.5" drop length',
      metalPurity: '18k',
      gemCarat: '2.5ct sapphires, 0.75ct diamonds',
      gemClarity: 'VS1-VS2 (diamonds)',
      gemColor: 'Medium-blue (sapphires), F-G (diamonds)',
      closure: 'Leverback'
    },
    careInstructions: [
      'Clean with a soft cloth dampened with mild soapy water',
      'Avoid ultrasonic cleaners which may damage sapphires',
      'Remove before swimming or showering',
      'Store in a lined jewelry box separated from other pieces'
    ],
    reviews: [
      {
        id: 'rev-009',
        author: 'Catherine Davis',
        rating: 5,
        date: '2023-11-05',
        title: 'Even more beautiful in person',
        comment: "These earrings are absolutely stunning. The sapphires are a gorgeous deep blue color and the diamonds add the perfect amount of sparkle. The leverbacks are secure and comfortable for all-day wear. I've received countless compliments!",
        verified: true,
        helpful: 28,
        images: ['/images/reviews/review-sapphire-earrings-1.jpg']
      }
    ]
  },
  {
    id: 'ruby-eternity-band',
    name: 'Ruby and Diamond Eternity Band',
    description: 'Luxurious eternity band featuring alternating rubies and diamonds set in 18k rose gold.',
    detailedDescription: 'This exquisite Ruby and Diamond Eternity Band showcases perfectly matched round rubies alternating with round brilliant diamonds that encircle the entire band. The vivid red Burmese rubies (1.2ct total) are renowned for their "pigeon blood" color and exceptional clarity, while the diamonds (0.8ct total) provide brilliant contrast. Set in 18k rose gold that beautifully complements the ruby\'s crimson hue, this ring features a comfort-fit interior for everyday wearability. Each stone is secured in a shared-prong setting that maximizes light entry while maintaining a sleek profile. Whether worn as a wedding band, anniversary ring, or luxurious statement piece, this eternity band symbolizes never-ending love with its continuous circle of precious gems.',
    price: 4599,
    images: [
      '/images/jewelry/high-res/ruby-eternity-band-1.jpg',
      '/images/jewelry/high-res/ruby-eternity-band-2.jpg', 
      '/images/jewelry/high-res/ruby-eternity-band-3.jpg'
    ],
    category: 'Rings',
    type: 'ring',
    materials: ['Rose Gold', 'Ruby', 'Diamond'],
    metalTypes: ['rosegold', 'gold'],
    gemTypes: ['ruby', 'diamond'],
    sizes: [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8],
    modelPath: '/models/ruby_eternity_band.glb',
    featured: true,
    new: true,
    bestseller: false,
    rating: 4.9,
    reviewCount: 42,
    stock: 6,
    availability: 'in-stock',
    hasAR: true,
    has3D: true,
    specifications: {
      weight: '4.2g',
      metalPurity: '18k',
      gemCarat: '1.2ct rubies, 0.8ct diamonds',
      gemClarity: 'VS1-VS2 (diamonds)',
      gemColor: 'F-G (diamonds)',
      settingType: 'Shared-prong setting'
    },
    careInstructions: [
      'Clean with mild soap and warm water using a soft brush',
      'Avoid harsh chemicals and ultrasonic cleaners',
      'Remove before activities that may impact the ring',
      'Have professionally inspected annually'
    ],
    reviews: [
      {
        id: 'rev-010',
        author: 'Thomas Reynolds',
        rating: 5,
        date: '2023-10-18',
        title: 'Spectacular anniversary gift',
        comment: "I purchased this for our ruby anniversary and it's absolutely perfect. The rubies are a vivid red color and the craftsmanship is superb. My wife hasn't taken it off since receiving it!",
        verified: true,
        helpful: 21
      }
    ]
  }
];

export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(product => product.id === id);
};

export const getRelatedProducts = (product: Product, limit: number = 4): Product[] => {
  return PRODUCTS.filter(p => 
    (p.id !== product.id) && 
    (p.category === product.category || 
     p.materials.some(m => product.materials.includes(m)))
  ).slice(0, limit);
};

export const getFeaturedProducts = (limit: number = 4): Product[] => {
  return PRODUCTS.filter(p => p.featured).slice(0, limit);
};

export const getNewArrivals = (limit: number = 4): Product[] => {
  return PRODUCTS.filter(p => p.new).slice(0, limit);
};

export const getBestsellers = (limit: number = 4): Product[] => {
  return PRODUCTS.filter(p => p.bestseller).slice(0, limit);
}; 