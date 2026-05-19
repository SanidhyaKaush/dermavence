from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, CurrentUserView, ProductListView,
    CartItemListCreateView, CartItemDetailView,
    WishlistListCreateView, WishlistItemDeleteView
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', CurrentUserView.as_view(), name='current_user'),
    
    path('products/', ProductListView.as_view(), name='product_list'),
    
    path('cart/', CartItemListCreateView.as_view(), name='cart_list_create'),
    path('cart/<int:pk>/', CartItemDetailView.as_view(), name='cart_detail'),
    
    path('wishlist/', WishlistListCreateView.as_view(), name='wishlist_list_create'),
    path('wishlist/<int:pk>/', WishlistItemDeleteView.as_view(), name='wishlist_delete'),
]
