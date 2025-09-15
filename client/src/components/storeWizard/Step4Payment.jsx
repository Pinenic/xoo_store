import { TextInput } from "flowbite-react";

export default function Step4Payment({ formData, onChange, errors }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Payment Information</h2>

      <select
        className="w-full border rounded-lg px-3 py-2 mb-2"
        onChange={(e) => onChange("paymentMethod", e.target.value)}
        value={formData.paymentMethod}
      >
        <option value="">Select Payment Method</option>
        <option>Bank Transfer</option>
        <option>Mobile Money</option>
      </select>
      {errors.paymentMethod && (
        <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
      )}

      <TextInput
        placeholder="Enter account number"
        value={formData.accountNumber}
        onChange={(e) => onChange("accountNumber", e.target.value)}
        color={errors.accountNumber ? "failure" : "gray"}
        helpertext={errors.accountNumber}
        className="mt-2"
      />
    </div>
  );
}
