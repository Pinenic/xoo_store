import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabase";
import { useStoreCtx } from "../../context/useStoreCtx";
import useStoreApi from "../../hooks/useStore";

export default function ProductForm({ mode = "create" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { store } = useStoreCtx();
  const { loading, error, addInventoryItem, updateInventoryItem } = useStoreApi();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    //sku: "",
   // discount_percentage: "",
    //minimum_order_quantity: "",
    //availability_status: "",
   // weight: "",
   // dimensions: { length: "", width: "", height: "" },
    tags: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load product details in edit mode
  useEffect(() => {
    if (mode === "edit" && id) {
      supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("store_id", store.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
            return;
          }
          if (data) {
            setForm({
              name: data.title ?? "",
              description: data.description ?? "",
              price: data.price ?? "",
              stock: data.stock ?? "",
              category: data.category ?? "",
              brand: data.brand ?? "",
              sku: data.sku ?? "",
              discount_percentage: data.discount_percentage ?? "",
              minimum_order_quantity: data.minimum_order_quantity ?? "",
              availability_status: data.availability_status ?? "",
              weight: data.weight ?? "",
              dimensions: data.dimensions ?? { length: "", width: "", height: "" },
              tags: data.tags?.join(", ") ?? "",
            });
          }
        })
        .catch(console.error);
    }
  }, [mode, id, store.id]);

  // Handle form input changes
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("dimensions.")) {
      const key = name.split(".")[1];
      setForm((f) => ({
        ...f,
        dimensions: { ...f.dimensions, [key]: value },
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Handle file input changes
  const onFileChange = (e, multiple = false, target = "thumbnail") => {
    const files = multiple ? Array.from(e.target.files) : [e.target.files?.[0]];
    if (!files || files.length === 0) return;

    if (target === "thumbnail") {
      setThumbnailFile(files[0]);
    } else {
      setImageFiles((prev) => [...prev, ...files]);
    }
  };

  // Handle form submission
const onSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    const formData = new FormData();

    // Base fields to send to backend
    const fields = {
      name: form.name,
      description: form.description,
      price: Number(form.price || 0),
      stock: Number(form.stock || 0),
      category: form.category || "",
      brand: form.brand || "",
      tags: form.tags,
      store_id: store.id,
    };

    // Append fields dynamically
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append file fields if present
    if (thumbnailFile) {
      formData.append("file", thumbnailFile);
    }

    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => formData.append("files", file));
    }

    // Debug: inspect the form data payload
    console.log("Submitting data:", Array.from(formData.entries()));

    // Call correct API method
    if (mode === "create") {
      await addInventoryItem(formData);
    } else {
      await updateInventoryItem(id, formData);
    }

    navigate("/store/dashboard/products");
  } catch (err) {
    console.error("Error submitting product:", err);
    alert(`Failed to save product: ${err.message || err}`);
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">
        {mode === "create" ? "Add Product" : "Edit Product"}
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2"
            rows={4}
          />
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Price (ZMW)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={onChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={onChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm mb-1">Thumbnail</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e, false, "thumbnail")}
            />
            {thumbnailFile && (
              <span className="text-sm">{thumbnailFile.name}</span>
            )}
          </div>
        </div>

        {/* Additional Images */}
        <div>
          <label className="block text-sm mb-1">Additional Images</label>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onFileChange(e, true, "images")}
            />
            {imageFiles.map((file, idx) => (
              <span key={idx} className="text-sm">{file.name}</span>
            ))}
          </div>
        </div>

        {/* Category and Brand */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={onChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Brand</label>
            <input
              name="brand"
              value={form.brand}
              onChange={onChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        {/* SKU and Discount *}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">SKU</label>
            <input
              name="sku"
              value={form.sku}
              onChange={onChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Discount %</label>
            <input
              type="number"
              step="0.01"
              name="discount_percentage"
              value={form.discount_percentage}
              onChange={onChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        {/* Minimum Order Quantity *}
        <div>
          <label className="block text-sm mb-1">Minimum Order Quantity</label>
          <input
            type="number"
            name="minimum_order_quantity"
            value={form.minimum_order_quantity}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Availability Status *}
        <div>
          <label className="block text-sm mb-1">Availability Status</label>
          <input
            name="availability_status"
            value={form.availability_status}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Weight *}
        <div>
          <label className="block text-sm mb-1">Weight (kg)</label>
          <input
            type="number"
            step="0.01"
            name="weight"
            value={form.weight}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Dimensions *}
        <div className="grid grid-cols-3 gap-4">
          {["length", "width", "height"].map((dim) => (
            <div key={dim}>
              <label className="block text-sm mb-1 capitalize">{dim}</label>
              <input
                type="number"
                step="0.01"
                name={`dimensions.${dim}`}
                value={form.dimensions[dim]}
                onChange={onChange}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          ))}
        </div>
          {/** */}
        {/* Tags */}
        <div>
          <label className="block text-sm mb-1">Tags (comma separated)</label>
          <input
            name="tags"
            value={form.tags}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
