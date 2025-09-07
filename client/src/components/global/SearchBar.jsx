import { useState, useEffect, useRef } from "react";
import { TextInput, Spinner, Button } from "flowbite-react";
import { Search } from "lucide-react";
import useMarketplace from "../../hooks/uesMarketplace";

export default function SearchBar({
  placeholder = "Search...",
  onResults, // parent will receive results
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { error, searchProducts } = useMarketplace();

  // Run search (manual or Enter press)
  const runSearch = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await searchProducts(q);
      setResults(res || []);
      onResults?.(res || []); // send results up to parent grid
      setOpen(false); // 🔒 hide dropdown after search
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce live preview
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchProducts(query);
        setResults(res || []);
        setOpen(true); // preview dropdown only during typing
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

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch(query);
    }
  };

  // Handle selection from dropdown
  const handleSelect = (item) => {
    setQuery(item.name || item.title || item.toString());
    setOpen(false);
    onResults?.([item]); // return just the clicked item
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md flex gap-2">
      <TextInput
        icon={Search}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Button color="blue" onClick={() => runSearch(query)}>
        Search
      </Button>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 flex items-center justify-center">
              <Spinner size="sm" />
            </div>
          ) : (
            results.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {item.name || item.title || item.toString()}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
