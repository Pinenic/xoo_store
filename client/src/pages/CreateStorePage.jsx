import { useState } from "react";
import { Button, TextInput, Textarea, FileInput, Select, Radio } from "flowbite-react";

export default function CreateStorePage() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    logo: null,
    category: "",
    paymentMethod: "",
    accountNumber: "",
    plan: "individual",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" }); // Clear error on change
  };

  // Validation logic
  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.storeName.trim()) newErrors.storeName = "Store name is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      if (!formData.logo) newErrors.logo = "Please upload a store logo";
      if (!formData.category) newErrors.category = "Select a category";
    } else if (step === 2) {
      if (!formData.paymentMethod) newErrors.paymentMethod = "Select a payment method";
      if (!formData.accountNumber.trim()) newErrors.accountNumber = "Enter your account number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    if (validateStep()) {
      console.log("Submitting data:", formData);
      alert("Store created successfully!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      {/* Progress Header */}
      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-700">
          Step {step} of 3
        </p>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Store Info */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Store Information</h2>

          <TextInput
            placeholder="Enter store name"
            value={formData.storeName}
            onChange={(e) => handleChange("storeName", e.target.value)}
            color={errors.storeName ? "failure" : "gray"}
            helperText={errors.storeName}
            className="mb-4"
          />

          <Textarea
            placeholder="Describe your store"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            color={errors.description ? "failure" : "gray"}
            helperText={errors.description}
            className="mb-4"
          />

          <FileInput
            onChange={(e) => handleChange("logo", e.target.files[0])}
            color={errors.logo ? "failure" : "gray"}
            className="mb-2"
          />
          {errors.logo && <p className="text-red-500 text-sm">{errors.logo}</p>}

          <Select
            onChange={(e) => handleChange("category", e.target.value)}
            value={formData.category}
            color={errors.category ? "failure" : "gray"}
            className="mb-2"
          >
            <option value="">Select Category</option>
            <option>Fashion</option>
            <option>Electronics</option>
            <option>Home & Kitchen</option>
          </Select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>
      )}

      {/* Step 2: Payment Info */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Payment Information</h2>

          <Select
            onChange={(e) => handleChange("paymentMethod", e.target.value)}
            value={formData.paymentMethod}
            color={errors.paymentMethod ? "failure" : "gray"}
            className="mb-2"
          >
            <option value="">Select Payment Method</option>
            <option>Bank Transfer</option>
            <option>Mobile Money</option>
          </Select>
          {errors.paymentMethod && (
            <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
          )}

          <TextInput
            placeholder="Enter account number"
            value={formData.accountNumber}
            onChange={(e) => handleChange("accountNumber", e.target.value)}
            color={errors.accountNumber ? "failure" : "gray"}
            helperText={errors.accountNumber}
            className="mb-2"
          />
        </div>
      )}

      {/* Step 3: Seller Plan */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Choose Your Seller Plan</h2>

          <div className="flex items-center gap-4 mb-4">
            <Radio
              id="individual"
              name="plan"
              value="individual"
              checked={formData.plan === "individual"}
              onChange={(e) => handleChange("plan", e.target.value)}
            />
            <label htmlFor="individual">Individual (Free)</label>
          </div>

          <div className="flex items-center gap-4">
            <Radio
              id="professional"
              name="plan"
              value="professional"
              checked={formData.plan === "professional"}
              onChange={(e) => handleChange("plan", e.target.value)}
            />
            <label htmlFor="professional">Professional ($20/month)</label>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <Button color="gray" onClick={prevStep}>
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button onClick={nextStep}>Next</Button>
        ) : (
          <Button color="success" onClick={handleSubmit}>
            Create Store
          </Button>
        )}
      </div>
    </div>
  );
}
