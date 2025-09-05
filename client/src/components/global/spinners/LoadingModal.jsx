// src/components/LoadingModal.jsx
import { Modal, Spinner } from "flowbite-react";

export default function LoadingModal({ show = false, message = "Loading..." }) {
  return (
    <Modal
      show={show}
      size="md"
      popup
      onClose={() => {}}
      className="flex items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center p-6">
        <Spinner size="xl" color="info" />
        <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
      </div>
    </Modal>
  );
}
