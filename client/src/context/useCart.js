import { create } from "zustand";
import { supabase } from "../supabase";

const edgeFunctionUrl = `${import.meta.env.VITE_EDGE_FUNCTION_CCS}/functions/v1/create-checkout-session`;

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
      .select("id, cart_items(product_id, store_id, title, quantity, price)")
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
          storeId: item.store_id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })) || [],
      loading: false,
    });
  },

  // Add or update a product in cart
  addToCart: async (product, qty = 1) => {
    const { cartId, items } = get();
    if (!cartId) return console.error("No cart ID found");

    const updatedItems = [...items];
    const index = updatedItems.findIndex(
      (i) => i.productId === product.id && i.storeId === product.store_id
    );

    if (index !== -1) {
      updatedItems[index].quantity += qty;
    } else {
      updatedItems.push({
        productId: product.id,
        storeId: product.store_id,
        title: product.title,
        price: product.price,
        quantity: qty,
      });
    }
    set({ items: updatedItems });

    // Persist in Supabase (upsert)
    const { error } = await supabase.rpc("upsert_cart_item", {
      p_cart_id: cartId,
      p_product_id: product.id,
      p_store_id: product.store_id,
      p_title: product.title,
      p_price: product.price,
      p_qty: updatedItems[index]?.quantity || qty,
    });
    if (error) console.error("Error adding/updating cart item:", error);
  },

  // Update quantity
  updateQuantity: async (productId, newQty) => {
    const { cartId, items } = get();
    if (!cartId) return;

    const updatedItems = items.map((item) =>
      item.productId === productId
        ? { ...item, quantity: newQty }
        : item
    );
    set({ items: updatedItems });

    // Sync with Supabase directly
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("cart_id", cartId)
      .eq("product_id", productId);

    if (error) console.error("Error updating cart item quantity:", error);
  },

  // Remove product from cart
  removeFromCart: async (productId) => {
    const { cartId, items } = get();
    if (!cartId) return;

    set({
      items: items.filter(
        (item) => !(item.productId === productId && item.storeId === storeId)
      ),
    });

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

  // Getter for total price
  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  
  //checkout cart
  checkout: async (userId) => {
  const { items } = get();
  if (!items.length) {
    console.error("Cart is empty");
    return;
  }

  try {
    const cartPayload = items.map((item) => ({
      productId: item.productId,
      storeId: item.storeId,
      title: item.title,
      price: item.price,
      quantity: item.quantity
    }));

    const response = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, cart: cartPayload })
    });

    const data = await response.json();

    if (data.url) {
      // Redirect user to Stripe checkout
      window.location.href = data.url;
    } else {
      console.error("Error creating checkout session:", data.error);
    }
  } catch (err) {
    console.error("Checkout error:", err);
  }
},

}));

