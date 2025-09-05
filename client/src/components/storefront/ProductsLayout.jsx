// src/pages/ProductsLayout.jsx
import { Button } from "flowbite-react";
import ProductsGrid from "./ProductsGrid";

export default function ProductsLayout({products}) {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar Filters (hidden on mobile, visible on lg) */}
      <aside className="hidden lg:block w-64 bg-gray-50 p-4">
        <h3 className="font-semibold">Categories</h3>
        {/* filters go here */}
      </aside>

      {/* Main Section */}
      <main className="flex-1">
        {/* Topbar for mobile + tablet */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <Button color="gray">Filters</Button>
          <Button color="gray">Sort</Button>
        </div>

        <ProductsGrid products={products}/>
      </main>
    </div>
  );
}
