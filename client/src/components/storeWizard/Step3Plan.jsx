import { Radio } from "flowbite-react";

export default function Step3Plan({ formData, onChange }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Choose Your Seller Plan</h2>

      <div className="flex items-center gap-4 mb-4">
        <Radio
          id="individual"
          name="plan"
          value="individual"
          checked={formData.plan === "individual"}
          onChange={(e) => onChange("plan", e.target.value)}
        />
        <label htmlFor="individual">Individual (Free)</label>
      </div>

      <div className="flex items-center gap-4">
        <Radio
          id="professional"
          name="plan"
          value="professional"
          checked={formData.plan === "professional"}
          onChange={(e) => onChange("plan", e.target.value)}
        />
        <label htmlFor="professional">Professional (K20/month)</label>
      </div>
    </div>
  );
}
