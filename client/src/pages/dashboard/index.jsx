// src/pages/dashboard/index.jsx
import { useEffect, useState } from "react";
import { useStoreCtx } from "../../context/useStoreCtx";
import useProducts from "../../hooks/useProductSupa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import useStoreApi from "../../hooks/useStore";

export default function Overview() {
  const { store } = useStoreCtx();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const { error, getInventory} = useStoreApi();

  const load = async () => {
    setLoading(true);
    try {
      const data = await getInventory(store.id);
      error ? console.log(error) : setProducts(data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load()
  },[]);

  const chartData = products.map(p => ({ name: p.title, stock: p.stock ?? 0 }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Products</p>
          <p className="text-2xl font-semibold">{products.length}</p>
        </div>
        {/* Add more stat cards later */}
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <h2 className="font-medium mb-3">Stock by Product</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
