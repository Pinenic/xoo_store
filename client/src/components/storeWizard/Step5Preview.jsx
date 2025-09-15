export default function Step5Preview({ formData }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Preview Your Store Information</h2>

      <div className="space-y-4 text-gray-700">
        <div>
          <strong>Store Name:</strong> {formData.storeName}
        </div>
        <div>
          <strong>Description:</strong> {formData.description}
        </div>
        <div>
          <strong>Category:</strong> {formData.category}
        </div>
        <div>
          <strong>Plan:</strong> {formData.plan}
        </div>
        <div>
          <strong>Payment Method:</strong> {formData.paymentMethod}
        </div>
        <div>
          <strong>Account Number:</strong> {formData.accountNumber}
        </div>
        <div>
          <strong>Logo:</strong>{" "}
          {formData.file ? (
            <img
              src={URL.createObjectURL(formData.file)}
              alt="Logo preview"
              className="h-16 mt-2"
            />
          ) : (
            "Not uploaded"
          )}
        </div>
        <div>
          <strong>Banner:</strong>{" "}
          {formData.banner ? (
            <img
              src={URL.createObjectURL(formData.banner)}
              alt="Banner preview"
              className="h-24 mt-2"
            />
          ) : (
            "Not uploaded"
          )}
        </div>
      </div>
    </div>
  );
}
