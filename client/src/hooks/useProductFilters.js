import { useEffect, useState } from "react";

export default function useProductFilters() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  //const [ratings, setRatings] = useState([]);

  useEffect(() => {
    async function fetchFilters() {
      try {
        // Get categories
        const catRes = await fetch("https://xoo-store.onrender.com/api/v1/filter/category");
        const catData = await catRes.json();
        // const catStrings = catData.map((cat) => cat.slug);
        setCategories(catData);
        console.log("the categories:", catData)

        // Get all products to extract brands and ratings
        const prodRes = await fetch("https://xoo-store.onrender.com/api/v1/filter/brand");
        const prodData = await prodRes.json();
        // const allProducts = prodData.products;
        // console.log("the categories:", allProducts)

        // // Extract unique brands
        // const uniqueBrands = [...new Set(allProducts.map((p) => p.brand))];
        setBrands(prodData);
        console.log("the brands:", uniqueBrands)

        // Extract rounded ratings
        // const uniqueRatings = [...new Set(allProducts.map((p) => Math.floor(p.rating)))].sort((a, b) => a - b);
        // setRatings(uniqueRatings);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    }

    fetchFilters();
  }, []);

  return { categories, brands};
}
