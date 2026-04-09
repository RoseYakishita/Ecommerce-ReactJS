import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCartApi, addToCartApi, updateCartItemApi, removeCartItemApi } from '../services/api';

const useStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      token: null,
      login: (userData, token) => set({ user: userData, token }),
      logout: () => set({ user: null, token: null, cart: [] }), // Clear cart on logout

      // Cart State (Local cache, synced with backend when possible)
      cart: [],
      
      // Async Cart Actions
      fetchCart: async () => {
        if (!get().token) return;
        try {
          const remoteCart = await getCartApi();
          // Transform backend cart items to match our frontend UI structure
          const formattedCart = remoteCart.items.map(item => ({
            id: item.id, // CartItem ID
            productId: item.product.id,
            name: item.product.name,
            price: Number(item.product.price),
            image: item.product.images?.[0] || item.product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
            quantity: item.quantity
          }));
          set({ cart: formattedCart });
        } catch (error) {
          console.error("Failed to fetch cart", error);
          if (error.response?.status === 401) {
            get().logout();
          }
        }
      },

      addToCart: async (product, quantity = 1) => {
        if (get().token) {
          try {
            await addToCartApi(product.id, quantity);
            get().fetchCart(); // Refetch updated cart from DB
          } catch (error) {
            console.error("Failed to add to cart", error);
          }
        } else {
          alert('Please login first to use the cart');
        }
      },

      removeFromCart: async (cartItemId) => {
        if (get().token) {
          try {
            await removeCartItemApi(cartItemId);
            get().fetchCart();
          } catch (error) {
            console.error("Failed to remove item", error);
          }
        }
      },

      updateQuantity: async (cartItemId, quantity) => {
        if (get().token) {
          try {
            await updateCartItemApi(cartItemId, Math.max(1, quantity));
            get().fetchCart();
          } catch (error) {
            console.error("Failed to update item", error);
          }
        }
      },

      clearCart: () => set({ cart: [] }),
      
      // Cart computed (Still runs locally on cached state for instant UI updates)
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      getCartItemCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'ecommerce-storage',
      partialize: (state) => ({ token: state.token, user: state.user }), // We only persist token/user, cart comes from DB
    }
  )
);

export default useStore;
