from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, LogoutView, UserView,
    ProductViewSet, ProductReviewsView, CartAPIView, WishlistAPIView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/user/', UserView.as_view(), name='user'),
    path('products/<int:product_id>/reviews/', ProductReviewsView.as_view(), name='product-reviews'),
    path('cart/', CartAPIView.as_view(), name='cart'),
    path('wishlist/', WishlistAPIView.as_view(), name='wishlist'),
]
