import { useState, useEffect, useRef } from "react";
import { Spinner } from "flowbite-react";
import { Search, X } from "lucide-react";
import useMarketplace from "../../hooks/uesMarketplace";

export default function SearchBar({
  placeholder = "Search...",
  onResults,
  setSearchQuery,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const defaultPage = 1;
  const wrapperRef = useRef(null);
  const { searchProducts } = useMarketplace();

  // Run search manually
  const runSearch = async (page, q) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await searchProducts(page, q);
      setResults(res.Products || []);
      onResults?.(res.Products || []);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // Reset search
  const resetSearch = async () => {
    setQuery("");
    setSearchQuery("");
    setResults([]);
    setOpen(false);
    // const all = await fetchAllProducts(); // 🔥 load everything again
    onResults?.([]);
  };

  // Debounce preview
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchProducts(defaultPage, query);
        setResults(res.Products || []);
        setOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchQuery(query);
      runSearch(defaultPage, query);
    }
  };

  const handleSelect = (item) => {
    setQuery(item.name || item.title || item.toString());
    setSearchQuery(item.name || item.title || item.toString());
    setOpen(false);
    onResults?.([item]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full flex-1 max-w-md">
      {/* Input with icon button */}
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-1 text-sm focus:outline-none"
        />
        {/* Reset button */}
        {query && (
          <button
            onClick={resetSearch}
            className="px-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => {
            setSearchQuery(query);
            runSearch(defaultPage, query);
          }}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 h-full rounded-r-lg text-white flex items-center justify-center"
        >
          {loading ? (
            <Spinner size="sm" color="white" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          {results.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {item.name || item.title || item.toString()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
