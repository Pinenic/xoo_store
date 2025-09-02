import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import { useStoreCtx } from "../../context/useStoreCtx";
import useStoreApi from "../../hooks/useStore";

export default function Settings() {
  const { store, setStore } = useStoreCtx();
  const navigate = useNavigate();
  const {loading, error, updateStoreInfo} = useStoreApi()

  const [form, setForm] = useState({
    name: store?.store_name || "",
    description: store?.description || "",
    category: store?.category || "",
    payment_method: store?.payment_method || "",
    account_number: store?.account_number || "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (store) {
      setForm({
        name: store.store_name || "",
        description: store.description || "",
        category: store.category || "",
        payment_method: store.payment_method || "",
        account_number: store.account_number || "",
      });
    }
  }, [store]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();

      // Append all fields dynamically
      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, value);
      });

      // Append logo file if present
      if (logoFile) {
        payload.append("file", logoFile);
      }

      console.log("Submitting Settings Payload:", Array.from(payload.entries()));

      // Call backend API (adjust endpoint as needed)
      const res = await updateStoreInfo(store.id, payload);

      if (error) throw error;

      alert("Settings updated successfully!");
      navigate("/store/dashboard");
    } catch (err) {
      console.error("Error updating settings:", err);
      alert(`Failed to update settings: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Store Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Store Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Store Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Store category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="payment_method"
          placeholder="Payment method"
          value={form.payment_method}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="account_number"
          placeholder="Account number"
          value={form.account_number}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files[0])}
          className="w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
