// src/hooks/useProducts.js
import { supabase } from "../supabase";

export default function useProducts(storeId) {
  const list = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  };

  const create = async (payload) => {
    const { data, error } = await supabase
      .from("products")
      .insert([{ ...payload, store_id: storeId }])
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const update = async (id, payload) => {
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .eq("store_id", storeId)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const remove = async (id) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("store_id", storeId);
    if (error) throw error;
  };

  return { list, create, update, remove };
}
