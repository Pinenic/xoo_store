import React, { useEffect, useState } from 'react'
import { GridProductCard } from '../products/ProductCards';
import Loader from './Loader';
import { Pagination } from 'flowbite-react';
import useMarketplace from '../../hooks/uesMarketplace';

export default function SearchResultsGrid({query, onResults, searchResults, user}) {
  const [Page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { error, searchProducts } = useMarketplace();
  const [totalPages, setTotalPages] = useState(1);
    
//   // load products
//   const load = async (page, filterQuery) => {
//     setLoading(true);
//     try {
//       const data = filterQuery !== "" ? await getAllProducts(page, filterQuery) : await getAllProducts(page);
//       console.log(data);
//       error ? console.log(error) : setProducts(data.Products);
//       setTotalPages(data.TotalPages == 0 ? 1 : data.TotalPages);
//     } finally {
//       setLoading(false);
//     }
//   };
// Run search manually
  const runSearch = async (page, q) => {
    if (!q.trim()) return;
    setLoading(true);
    console.log(q)
    try {
      const res = await searchProducts(page, q);
      if(error) console.log(error);
      onResults?.(res.Products || []);
      setTotalPages(res.TotalPages == 0 ? 1 : res.TotalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // pagination
  const onPageChange = (page) => {
    setPage(page);
    const el = document.querySelector("#product-grid");
    el.scrollIntoView({ behavior: "smooth" });
  };

  // fetch when currentPage changes
  useEffect(() => {
    runSearch(Page, query);
  }, [Page, query]);
    return (
        <>
            {/* Main Content */}
                    <div
                      className="flex flex-col items-center mb-8 scroll-m-[300px] md:scroll-m-[200px]"
                      id="product-grid"
                    >
                      <div className="flex flex-col md:flex-row w-full max-w-7xl">
                        
                        {/* Product Grid */}
                        <div className="flex-1">
                          {loading ? (
                            <div className="h-[30em] flex items-center justify-center">
                              <Loader />
                            </div>
                          ) : (
                            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
                              {searchResults.length > 0 ? (
                                searchResults.map((product) => (
                                  <GridProductCard key={product.id} product={product} user={user}/>
                                ))
                              ) : (
                                <div className="col-span-full text-center text-gray-500">
                                  No products found.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
            
                      {/* Pagination */}
                      <Pagination
                        currentPage={Page}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        className="mx-auto mt-4"
                      />
                    </div>
        </>
    )
}
