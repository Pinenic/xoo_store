import { TextInput, Textarea } from "flowbite-react";
import StoreCategoryDropdown from "../featuresPage/StoreCategoryDropdown";

export default function Step1StoreInfo({ formData, onChange, errors }) {
  const categories = ["Fashion", "Electronics", "Home & Kitchen"];
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Store Information</h2>
      <TextInput
        placeholder="Enter store name"
        value={formData.storeName}
        onChange={(e) => onChange("storeName", e.target.value)}
            color={errors.storeName ? "failure" : "gray"}
            helpertext={errors.storeName}
        className="mb-4"
      />
      <Textarea
        placeholder="Describe your store"
        value={formData.description}
        onChange={(e) => onChange("description", e.target.value)}
            color={errors.description ? "failure" : "gray"}
            helpertext={errors.description}
        className="mb-4"
      />
      <StoreCategoryDropdown
        categories={categories}
        onChange={(value) => onChange("category", value)}
      />
      {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
    </div>
  );
}
