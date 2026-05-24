from django.core.management.base import BaseCommand
from api.models import Product, Review

class Command(BaseCommand):
    help = 'Seeds the MySQL database with products and default reviews'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing products and reviews...')
        Review.objects.all().delete()
        Product.objects.all().delete()

        products_data = [
            {
                'id': 1,
                'name': 'Vit C Serum 20%',
                'description': 'A dermatologist-inspired antioxidant serum designed for glow, protection and daily skincare support with a premium pharmacy finish.',
                'price': 34.99,
                'category': 'Serums',
                'skinType': 'All Skin Types (including Sensitive)',
                'suitability': 'Daily Protection & Pigmentation Support',
                'directions': 'Apply 3-5 drops on clean, dry face and neck in the AM. Pat gently until absorbed, then follow with Sunprotect Sunscreen.',
                'ingredients': ['Ferulic Acid 1%', 'Hyaluronic Acid 1%', 'Dermatologically Tested'],
                'fullIngredients': 'Purified Water, L-Ascorbic Acid (Vitamin C) 20%, Propylene Glycol, Sodium Hyaluronate, Ferulic Acid 1%, Phenoxyethanol, Ethylhexylglycerin, Sodium Hydroxide.',
                'tag': 'DERMAVENCE • Stabilized Antioxidant',
                'image_name': 'vitc.png',
                'reviews': [
                    { 'name': 'Dr. Anjali Mehta (Dermatologist)', 'rating': 5, 'comment': 'Highly stable formula. The 20% concentration is perfect for brightening skin and reducing hyperpigmentation without irritation.' },
                    { 'name': 'Rohan Sharma', 'rating': 4, 'comment': 'Great texture, absorbs quickly in humid weather. Seeing good results on my dark spots after 2 weeks of daily use.' }
                ]
            },
            {
                'id': 2,
                'name': 'Intense Deep Clean Face Wash',
                'description': 'Deep cleansing formula designed to unclog pores, fight acne and refresh skin while maintaining a clean, premium pharma look.',
                'price': 24.99,
                'category': 'Cleansers',
                'skinType': 'Oily, Combination & Acne-Prone Skin',
                'suitability': 'Daily Sebum & Acne-Control Support',
                'directions': 'Dampen face. Pump a small amount onto palms, massage in circular motions for 30 seconds avoiding eye area, and rinse thoroughly.',
                'ingredients': ['2% Salicylic Acid', '0.5% Glycolic Acid', 'Unclogs Pores'],
                'fullIngredients': 'Aqua, Sodium Lauroyl Sarcosinate, Cocamidopropyl Betaine, Glycerin, Salicylic Acid 2%, Glycolic Acid 0.5%, Aloe Barbadensis Leaf Extract, Panthenol, Allantoin, Disodium EDTA.',
                'tag': 'DERMAVENCE • Doctor-Driven Care',
                'image_name': 'facewash.png',
                'reviews': [
                    { 'name': 'Karan Patel', 'rating': 5, 'comment': 'Perfect for oily and combination skin. The salicylic acid concentration keeps my breakouts under control without stripping my face dry.' },
                    { 'name': 'Dr. Vikrant Roy', 'rating': 5, 'comment': 'Excellent formulation for pore management. Recommended for daily sebum control.' }
                ]
            },
            {
                'id': 3,
                'name': 'Sunprotect Sunscreen',
                'description': 'Daily broad-spectrum UVA/UVB defense for Indian climate — designed with a premium, dermatologist-friendly presentation.',
                'price': 27.99,
                'category': 'Sunscreens',
                'skinType': 'All Skin Types (Non-Comedogenic)',
                'suitability': 'High-Temperature, Humid & Dry Climate',
                'directions': 'Apply generously to face, neck, and exposed skin 15 minutes before sun exposure. Reapply every 3-4 hours if outdoors.',
                'ingredients': ['SPF 50+', 'PA++++', 'With Vitamin C'],
                'fullIngredients': 'Aqua, Octocrylene, Ethylhexyl Methoxycinnamate, Zinc Oxide, Titanium Dioxide, Butyl Methoxydibenzoylmethane, Ascorbic Acid (Vitamin C), Glycerin, Cyclopentasiloxane, Dimethicone.',
                'tag': 'DERMAVENCE • Clinical Protection',
                'image_name': 'sunscreen.png',
                'reviews': [
                    { 'name': 'Sanya Sen', 'rating': 5, 'comment': 'Truly non-comedogenic! Absolutely zero white cast, feels light as water under makeup. Highly recommended for Indian weather.' },
                    { 'name': 'Amit Verma', 'rating': 4, 'comment': 'Great sunscreen. Doesn\'t feel sticky at all and protects well. Fits easily in my daily routine.' }
                ]
            },
            {
                'id': 4,
                'name': 'Moisturizer',
                'description': 'A daily hydrating moisturizer featuring a blend of active ingredients designed to restore, protect and nourish your skin barrier with a clean, premium finish.',
                'price': 29.99,
                'category': 'Moisturizers',
                'skinType': 'All Skin Types',
                'suitability': 'Daily Hydration, Skin Barrier Restoration & Protection',
                'directions': 'Apply a generous amount onto clean, dry skin. Massage gently in upward circular motions until fully absorbed. Best used after serum.',
                'ingredients': ['Alpha Arbutin', 'Ceramide Pantavitin', 'Niacinamide', 'Vitamin E', 'Allantoin'],
                'fullIngredients': 'Purified Water, Niacinamide, Alpha Arbutin, Ceramide NP, Saccharide Isomerate (Pantavitin), Vitamin E, Allantoin, Glycerin, Caprylic/Capric Triglyceride, Cetearyl Alcohol, Phenoxyethanol, Disodium EDTA.',
                'tag': 'DERMAVENCE • Hydrate • Protect • Restore',
                'image_name': 'moisturizer.jpg',
                'fda_notice': 'NOT APPROVED BY FDA BADDI IN COSMETIC',
                'reviews': [
                    { 'name': 'Dr. Neha Gupta', 'rating': 5, 'comment': 'Rich in barrier-repairing ceramides. The pantavitin provides deep, long-lasting hydration for dry or compromised skin.' },
                    { 'name': 'Rahul Mehta', 'rating': 4, 'comment': 'Keeps my skin hydrated all day without feeling sticky or heavy. Works very well under sunscreen.' }
                ]
            }
        ]

        for p_data in products_data:
            reviews_list = p_data.pop('reviews')
            product = Product.objects.create(**p_data)
            self.stdout.write(f'Created product: {product.name}')
            for r_data in reviews_list:
                Review.objects.create(product=product, **r_data)
            self.stdout.write(f'  Added {len(reviews_list)} reviews for {product.name}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded products and reviews database.'))
