import facewashImg from '../assets/facewash.png';
import sunscreenImg from '../assets/sunscreen.png';
import vitcImg from '../assets/vitc.png';
import moisturizerImg from '../assets/moisturizer.jpg';

export const products = [
  {
    id: 1,
    name: 'Vit C Serum 20%',
    description: 'A dermatologist-inspired antioxidant serum designed for glow, protection and daily skincare support with a premium pharmacy finish.',
    price: '34.99',
    image: vitcImg,
    category: 'Serums',
    skinType: 'All Skin Types (including Sensitive)',
    suitability: 'Daily Protection & Pigmentation Support',
    directions: 'Apply 3-5 drops on clean, dry face and neck in the AM. Pat gently until absorbed, then follow with Sunprotect Sunscreen.',
    ingredients: ['Ferulic Acid 1%', 'Hyaluronic Acid 1%', 'Dermatologically Tested'],
    fullIngredients: 'Purified Water, L-Ascorbic Acid (Vitamin C) 20%, Propylene Glycol, Sodium Hyaluronate, Ferulic Acid 1%, Phenoxyethanol, Ethylhexylglycerin, Sodium Hydroxide.',
    tag: 'DERMAVENCE • Stabilized Antioxidant'
  },
  {
    id: 2,
    name: 'Intense Deep Clean Face Wash',
    description: 'Deep cleansing formula designed to unclog pores, fight acne and refresh skin while maintaining a clean, premium pharma look.',
    price: '24.99',
    image: facewashImg,
    category: 'Cleansers',
    skinType: 'Oily, Combination & Acne-Prone Skin',
    suitability: 'Daily Sebum & Acne-Control Support',
    directions: 'Dampen face. Pump a small amount onto palms, massage in circular motions for 30 seconds avoiding eye area, and rinse thoroughly.',
    ingredients: ['2% Salicylic Acid', '0.5% Glycolic Acid', 'Unclogs Pores'],
    fullIngredients: 'Aqua, Sodium Lauroyl Sarcosinate, Cocamidopropyl Betaine, Glycerin, Salicylic Acid 2%, Glycolic Acid 0.5%, Aloe Barbadensis Leaf Extract, Panthenol, Allantoin, Disodium EDTA.',
    tag: 'DERMAVENCE • Doctor-Driven Care'
  },
  {
    id: 3,
    name: 'Sunprotect Sunscreen',
    description: 'Daily broad-spectrum UVA/UVB defense for Indian climate — designed with a premium, dermatologist-friendly presentation.',
    price: '27.99',
    image: sunscreenImg,
    category: 'Sunscreens',
    skinType: 'All Skin Types (Non-Comedogenic)',
    suitability: 'High-Temperature, Humid & Dry Climate',
    directions: 'Apply generously to face, neck, and exposed skin 15 minutes before sun exposure. Reapply every 3-4 hours if outdoors.',
    ingredients: ['SPF 50+', 'PA++++', 'With Vitamin C'],
    fullIngredients: 'Aqua, Octocrylene, Ethylhexyl Methoxycinnamate, Zinc Oxide, Titanium Dioxide, Butyl Methoxydibenzoylmethane, Ascorbic Acid (Vitamin C), Glycerin, Cyclopentasiloxane, Dimethicone.',
    tag: 'DERMAVENCE • Clinical Protection'
  },
  {
    id: 4,
    name: 'Moisturizer',
    description: 'A daily hydrating moisturizer featuring a blend of active ingredients designed to restore, protect and nourish your skin barrier with a clean, premium finish.',
    price: '29.99',
    image: moisturizerImg,
    category: 'Moisturizers',
    skinType: 'All Skin Types',
    suitability: 'Daily Hydration, Skin Barrier Restoration & Protection',
    directions: 'Apply a generous amount onto clean, dry skin. Massage gently in upward circular motions until fully absorbed. Best used after serum.',
    ingredients: ['Alpha Arbutin', 'Ceramide Pantavitin', 'Niacinamide', 'Vitamin E', 'Allantoin'],
    fullIngredients: 'Purified Water, Niacinamide, Alpha Arbutin, Ceramide NP, Saccharide Isomerate (Pantavitin), Vitamin E, Allantoin, Glycerin, Caprylic/Capric Triglyceride, Cetearyl Alcohol, Phenoxyethanol, Disodium EDTA.',
    tag: 'DERMAVENCE • Hydrate • Protect • Restore',
    fda_notice: 'NOT APPROVED BY FDA BADDI IN COSMETIC'
  }
];
