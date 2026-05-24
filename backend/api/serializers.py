from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Review, CartItem, WishlistItem

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'name', 'rating', 'comment', 'date']

class ProductSerializer(serializers.ModelSerializer):
    avg_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'category', 
            'skinType', 'suitability', 'directions', 'ingredients', 
            'fullIngredients', 'tag', 'image_name', 'fda_notice', 'avg_rating', 'reviews_count'
        ]

    def get_avg_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 0.0
        return round(sum(r.rating for r in reviews) / len(reviews), 1)

    def get_reviews_count(self, obj):
        return obj.reviews.count()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']

class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'product_id']
