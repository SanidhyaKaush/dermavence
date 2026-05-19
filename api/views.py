from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Product, CartItem, WishlistItem
from .serializers import (
    UserSerializer, RegisterSerializer, ProductSerializer,
    CartItemSerializer, WishlistItemSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CurrentUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (permissions.AllowAny,)

class CartItemListCreateView(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        existing_item = CartItem.objects.filter(user=request.user, product_id=product_id).first()
        
        if existing_item:
            existing_item.quantity += 1
            existing_item.save()
            serializer = self.get_serializer(existing_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        existing_item = WishlistItem.objects.filter(user=request.user, product_id=product_id).first()
        
        if existing_item:
            serializer = self.get_serializer(existing_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class WishlistItemDeleteView(generics.DestroyAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user)
