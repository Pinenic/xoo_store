export default function Step2Media({ formData, onChange, errors }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload Media</h2>
      <label className="block mb-2">Logo</label>
      <input
        type="file"
        onChange={(e) => onChange("file", e.target.files[0])}
        className="mb-4"
      />{errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
      <label className="block mb-2">Banner</label>
      <input
        type="file"
        onChange={(e) => onChange("banner", e.target.files[0])}
      />{errors.banner && <p className="text-red-500 text-sm">{errors.banner}</p>}
    </div>
  );
}
