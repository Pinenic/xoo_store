// src/components/FullScreenSpinner.jsx
import { Spinner } from "flowbite-react";

export default function FullScreenSpinner({ show = false, message = "Loading..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/60">
      <Spinner size="xl" color="info" />
      <p className="mt-4 text-lg font-medium text-white">{message}</p>
    </div>
  );
}
