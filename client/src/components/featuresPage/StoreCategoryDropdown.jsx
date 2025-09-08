import { useState } from "react";
import { Select, TextInput, Button } from "flowbite-react";

export default function StoreCategoryDropdown({ categories = [], onChange }) {
  const [options, setOptions] = useState(categories);
  const [selected, setSelected] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [addingCustom, setAddingCustom] = useState(false);

  const handleSelect = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setAddingCustom(true);
      setSelected("");
      onChange(""); // reset while typing custom
    } else {
      setAddingCustom(false);
      setSelected(value);
      onChange(value);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customCategory.trim()) {
      const newCat = customCategory.trim();
      // Add new category to list if not already present
      if (!options.includes(newCat)) {
        setOptions([...options, newCat]);
      }
      setSelected(newCat);
      onChange(newCat);

      // Reset form state
      setAddingCustom(false);
      setCustomCategory("");
    }
  };

  return (
    <div className="space-y-4">
      {!addingCustom ? (
        <Select value={selected} onChange={handleSelect}>
          <option value="">Select store category</option>
          {options.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
          <option value="custom">Enter category</option>
        </Select>
      ) : (
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <TextInput
            type="text"
            placeholder="Enter your category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            required
          />
          <Button type="submit" color="indigo">
            Save
          </Button>
          <Button
            color="gray"
            type="button"
            onClick={() => {
              setAddingCustom(false);
              setCustomCategory("");
            }}
          >
            Cancel
          </Button>
        </form>
      )}
    </div>
  );
}
