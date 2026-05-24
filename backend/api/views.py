from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Product, Review, CartItem, WishlistItem
from .serializers import (
    ProductSerializer, ReviewSerializer, UserSerializer, 
    CartItemSerializer, WishlistItemSerializer
)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password or not email:
            return Response({'error': 'Please provide username, email and password'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username__iexact=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Please provide username and password'}, status=status.HTTP_400_BAD_REQUEST)

        # Handle case-insensitive username lookup
        try:
            user_obj = User.objects.get(username__iexact=username)
            username = user_obj.username
        except User.DoesNotExist:
            pass

        user = authenticate(username=username, password=password)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')

        if category and category != 'All':
            queryset = queryset.filter(category=category)

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(tag__icontains=search)
            )
        return queryset

class ProductReviewsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, product_id):
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        reviews = product.reviews.all().order_by('-date', '-id')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, product_id):
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        name = request.data.get('name')
        rating = request.data.get('rating')
        comment = request.data.get('comment')

        if not name or not rating or not comment:
            return Response({'error': 'Please fill all fields'}, status=status.HTTP_400_BAD_REQUEST)

        review = Review.objects.create(
            product=product,
            name=name,
            rating=int(rating),
            comment=comment
        )
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CartAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(user=request.user, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_200_OK)

    def put(self, request):
        cart_item_id = request.data.get('cart_item_id')
        quantity = int(request.data.get('quantity'))

        try:
            cart_item = CartItem.objects.get(pk=cart_item_id, user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

        if quantity <= 0:
            cart_item.delete()
            return Response({'message': 'Item deleted'}, status=status.HTTP_200_OK)

        cart_item.quantity = quantity
        cart_item.save()
        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_200_OK)

    def delete(self, request):
        cart_item_id = request.query_params.get('cart_item_id')
        clear_all = request.query_params.get('clear_all')

        if clear_all == 'true':
            CartItem.objects.filter(user=request.user).delete()
            return Response({'message': 'Cart cleared'}, status=status.HTTP_200_OK)

        try:
            cart_item = CartItem.objects.get(pk=cart_item_id, user=request.user)
            cart_item.delete()
            return Response({'message': 'Item deleted'}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

class WishlistAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = WishlistItem.objects.filter(user=request.user)
        serializer = WishlistItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        product_id = request.data.get('product_id')

        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        wishlist_item, created = WishlistItem.objects.get_or_create(user=request.user, product=product)
        return Response(WishlistItemSerializer(wishlist_item).data, status=status.HTTP_200_OK)

    def delete(self, request):
        wishlist_item_id = request.query_params.get('wishlist_item_id')
        product_id = request.query_params.get('product_id')

        if wishlist_item_id:
            try:
                wishlist_item = WishlistItem.objects.get(pk=wishlist_item_id, user=request.user)
                wishlist_item.delete()
                return Response({'message': 'Item removed from wishlist'}, status=status.HTTP_200_OK)
            except WishlistItem.DoesNotExist:
                return Response({'error': 'Wishlist item not found'}, status=status.HTTP_404_NOT_FOUND)
        elif product_id:
            try:
                wishlist_item = WishlistItem.objects.get(product=product_id, user=request.user)
                wishlist_item.delete()
                return Response({'message': 'Item removed from wishlist'}, status=status.HTTP_200_OK)
            except WishlistItem.DoesNotExist:
                return Response({'error': 'Wishlist item not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'error': 'Provide wishlist_item_id or product_id'}, status=status.HTTP_400_BAD_REQUEST)
