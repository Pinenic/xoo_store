// src/pages/dashboard/Products.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStoreCtx } from "../../context/useStoreCtx";
import useProducts from "../../hooks/useProductSupa";
import useStoreApi from "../../hooks/useStore";

export default function Products() {
  const navigate = useNavigate();
  const { store } = useStoreCtx();
  const { list, remove } = useProducts(store.id);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error, getInventory, deleteInventoryItem } = useStoreApi();

  const load = async () => {
    setLoading(true);
    try {
      const data = await getInventory(store.id);
      error ? console.log(error) : setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={() => navigate("new")}
          className="px-3 py-2 rounded-lg bg-gray-900 text-white"
        >
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No products yet.
                </td>
              </tr>
            )}
            {rows.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.title}</td>
                <td className="p-3">ZMW {Number(p.price ?? 0).toFixed(2)}</td>
                <td className="p-3">{p.stock ?? 0}</td>
                <td className="p-3 text-right space-x-2">
                  <Link
                    className="px-2 py-1 rounded-lg border"
                    to={`${p.id}/edit`}
                  >
                    Edit
                  </Link>
                  <button
                    className="px-2 py-1 rounded-lg border"
                    onClick={async () => {
                      await deleteInventoryItem(p.id);
                      load();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
