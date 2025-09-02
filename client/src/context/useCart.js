import { create } from "zustand";
import { supabase } from "../supabase";

export const useCartStore = create((set, get) => ({
  cartId: null,
  items: [],
  loading: false,

  setCartId: (id) => set({ cartId: id }),

  // Fetch user's cart
  fetchCart: async (userId) => {
    if (!userId) return;

    set({ loading: true });
    const { data, error } = await supabase
      .from("carts")
      .select("id, cart_items(product_id, quantity, price)")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching cart:", error);
      set({ loading: false });
      return;
    }

    set({
      cartId: data.id,
      items:
        data.cart_items?.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })) || [],
      loading: false,
    });
  },

  // Add or update a product in cart
  addToCart: async (product, qty = 1) => {
    const { cartId, items } = get();

    if (!cartId) {
      console.error("No cart ID found. Make sure user is logged in and fetchCart has run.");
      return;
    }

    // Optimistic update
    const updatedItems = [...items];
    const index = updatedItems.findIndex((i) => i.productId === product.id);

    if (index !== -1) {
      updatedItems[index].quantity += qty;
    } else {
      updatedItems.push({
        productId: product.id,
        quantity: qty,
        price: product.price,
      });
    }
    set({ items: updatedItems });

    // Sync with Supabase
    const { error } = await supabase.rpc("upsert_cart_item", {
      p_cart_id: cartId,
      p_product_id: product.id,
      p_price: product.price,
      p_qty: qty,
    });

    if (error) {
      console.error("Error adding to cart:", error);
    }
  },

  // Update quantity
  updateQuantity: async (productId, newQty) => {
    const { cartId, items } = get();
    if (!cartId) return;

    // Optimistic update
    const updatedItems = items.map((item) =>
      item.productId === productId ? { ...item, quantity: newQty } : item
    );
    set({ items: updatedItems });

    // Sync with Supabase
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("cart_id", cartId)
      .eq("product_id", productId);

    if (error) {
      console.error("Error updating quantity:", error);
    }
  },

  // Remove product from cart
  removeFromCart: async (productId) => {
    const { cartId, items } = get();
    if (!cartId) return;

    set({ items: items.filter((item) => item.productId !== productId) });

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId)
      .eq("product_id", productId);

    if (error) console.error("Error removing from cart:", error);
  },

  // Clear cart
  clearCart: async () => {
    const { cartId } = get();
    if (!cartId) return;

    set({ items: [] });

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId);

    if (error) console.error("Error clearing cart:", error);
  },

  // **Getter for total price**
  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
