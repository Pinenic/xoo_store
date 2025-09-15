import ProductsLayout from "../components/storefront/ProductsLayout";
import StoreHero from "../components/storefront/StoreHero";
import { Link, useParams } from "react-router-dom";
import useStoreApi from "../hooks/useStore";
import { useEffect, useState } from "react";
import FullScreenSpinner from "../components/global/spinners/FullSreenSpinner";

export default function StoreFront() {
  const {storeId} = useParams();
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true);
    const { error, getInventory,
    getStoreDetails } = useStoreApi();

  const load = async () => {
      setLoading(true);
      try {
        const storeData = await getStoreDetails(storeId);
        setStore(storeData[0])
        const data = await getInventory(storeId);
        console.log(storeData)
        console.log(data)
        error ? console.log(error) : setProducts(data);;
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      load();
    }, []);
    
  const handleShopNow = () => {
    console.log("Redirecting to products...");
  };

  const handleContact = () => {
    console.log("Opening contact form...");
  };

  return (
    <div>
      {loading ? (<> <FullScreenSpinner show={loading}/> </>) : (<><StoreHero
        bannerUrl={store.banner || "https://picsum.photos/1200/400"}
        logoUrl={store.store_logo_url}
        storeName={store.store_name}
        tagline={store.description}
        onShopNow={handleShopNow}
        onContact={handleContact}
      />

      {/* Content starts below hero */}
      <div className="mt-28 p-6">
        <h2 className="text-xl font-semibold">Our Products</h2>
        {/* Products grid here */}
        <ProductsLayout products={products}/>
      </div></>)}
      
    </div>
  );
}
