import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  getWishlistApi,
  addToWishlistApi,
  removeFromWishlistApi,
} from '../services/api';

const notify = (message, type = 'info') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message, type } }));
  }
};

const useStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      token: null,
      login: (userData, token) => set({ user: userData, token }),
      logout: () => set({ user: null, token: null, cart: [], wishlist: [] }), // Clear user data on logout

      // Cart/Wishlist State (Local cache, synced with backend when possible)
      cart: [],
      wishlist: [],
      
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

      fetchWishlist: async () => {
        if (!get().token) return;
        try {
          const data = await getWishlistApi();
          set({ wishlist: data.map((x) => x.productId) });
        } catch (error) {
          console.error('Failed to fetch wishlist', error);
        }
      },

      toggleWishlist: async (productId) => {
        if (!get().token) {
          notify('Please login first to use wishlist', 'error');
          return;
        }

        const exists = get().wishlist.includes(productId);
        try {
          if (exists) {
            await removeFromWishlistApi(productId);
            set({ wishlist: get().wishlist.filter((id) => id !== productId) });
            notify('Removed from wishlist', 'info');
          } else {
            await addToWishlistApi(productId);
            set({ wishlist: [...get().wishlist, productId] });
            notify('Added to wishlist', 'success');
          }
        } catch (error) {
          console.error('Failed to update wishlist', error);
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
          notify('Please login first to use the cart', 'error');
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
