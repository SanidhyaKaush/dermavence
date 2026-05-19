from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import Product, CartItem, WishlistItem

class CartAndWishlistTests(APITestCase):
    def setUp(self):
        # Create user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        
        # Create products
        self.product1 = Product.objects.create(
            name='Product 1',
            description='Test Description 1',
            price=19.99
        )
        self.product2 = Product.objects.create(
            name='Product 2',
            description='Test Description 2',
            price=29.99
        )
        
        # Obtain SimpleJWT token
        response = self.client.post(reverse('login'), {
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.token = response.data['access']
        
        # Set Authorization header for all subsequent API requests
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_cart_operations(self):
        # 1. Add product1 to cart
        response = self.client.post(reverse('cart_list_create'), {
            'product_id': self.product1.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['quantity'], 1)
        
        # 2. Add product1 again (should increment quantity to 2)
        response = self.client.post(reverse('cart_list_create'), {
            'product_id': self.product1.id
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['quantity'], 2)
        
        # 3. List cart items
        response = self.client.get(reverse('cart_list_create'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['product']['id'], self.product1.id)
        
        cart_item_id = response.data[0]['id']
        
        # 4. Update cart item quantity
        response = self.client.patch(reverse('cart_detail', kwargs={'pk': cart_item_id}), {
            'quantity': 5
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['quantity'], 5)
        
        # Verify in database
        cart_item = CartItem.objects.get(id=cart_item_id)
        self.assertEqual(cart_item.quantity, 5)
        
        # 5. Delete cart item
        response = self.client.delete(reverse('cart_detail', kwargs={'pk': cart_item_id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify deleted
        self.assertFalse(CartItem.objects.filter(id=cart_item_id).exists())

    def test_wishlist_operations(self):
        # 1. Add product1 to wishlist
        response = self.client.post(reverse('wishlist_list_create'), {
            'product_id': self.product1.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # 2. Add product1 again (should return 200 OK and not duplicate)
        response = self.client.post(reverse('wishlist_list_create'), {
            'product_id': self.product1.id
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 3. List wishlist items
        response = self.client.get(reverse('wishlist_list_create'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['product']['id'], self.product1.id)
        
        wishlist_item_id = response.data[0]['id']
        
        # 4. Delete wishlist item
        response = self.client.delete(reverse('wishlist_delete', kwargs={'pk': wishlist_item_id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify deleted
        self.assertFalse(WishlistItem.objects.filter(id=wishlist_item_id).exists())
